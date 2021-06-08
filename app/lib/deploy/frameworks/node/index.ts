import db, { Deployment, Project, Team, User } from 'db'
import { createAppAuth } from '@octokit/auth-app'
import redis from 'redis'
import logger from 'logs'
import { config } from 'app/api/github/webhooks'
import Docker from 'dockerode'
import { Image } from 'types'

const client = redis.createClient({ url: 'redis://redis' })

const docker = new Docker({ socketPath: '/var/run/docker.sock' })
interface runExecProps {
  container: Docker.Container
  cmd: string
  workdir: string
  dpId: number
  redact?: string[]
}
const childLogger = logger.child({ service: 'pushHandler' })

const runExec = ({ container, cmd, workdir, dpId }: runExecProps): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const options = {
      Cmd: ['/bin/sh', '-c', cmd],
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: workdir,
    }
    container.exec(options, (err, exec) => {
      if (err) reject(new Error(err))
      if (exec === undefined) reject('Dockerode did not return an "exec" object')
      exec?.start({}, (err, stream) => {
        if (err) return

        stream?.on('data', async (chunk) => {
          console.log(chunk.toString())
          /*   await db.logLine.create({
            data: {
              content: chunk.toString(),
              deploymentId: dpId,
            },
          }) */
        })
        setInterval(() => {
          exec.inspect((err, data) => {
            if (err || data === undefined) return
            if (!data.Running) resolve(`Success running ${cmd}`)
          })
        }, 1000)
      })
    })
  })
}

type deployNodeArgs = {
  project: Project & {
    GhRepo: {
      ghid: number
      name: string
      owner: User | null
      ownerTeam: Team | null
    } | null
  }
  deployment: Deployment
  image: Image
  owner: Team | User
}

const deployNode = async (args: deployNodeArgs): Promise<string> => {
  if (args.project.GhRepo === null) return "We don't know how this happened.."

  const commands = await db.commands.findFirst({ where: { id: args.project.commandsId } })

  const env = args['env']
  const workdir = '/usr/src/app'

  const auth = createAppAuth({
    appId: config.appId,
    installationId:
      args.project.ownerType === 'TEAM'
        ? (args.project.GhRepo?.ownerTeam?.installationId as number)
        : (args.project.GhRepo?.owner?.installationId as number),
    privateKey: config.privateKey,
    clientId: config.clientID,
    clientSecret: config.clientSecret,
  })

  const installationAuthentication = await auth({ type: 'installation' })
  const repo = `https://x-access-token:${installationAuthentication['token']}@github.com/${args.project.GhRepo.name}`

  const dpId = args.deployment.id
  console.log(3)
  return new Promise<string>((resolve, reject) => {
    docker.createContainer(
      {
        Image: args.image,
        Tty: true,
        Cmd: ['/bin/sh'],
        name: `${args.project.name}_${args.deployment.name}_${args.deployment.id}`,
        Env: env,
        HostConfig: { AutoRemove: true, NetworkMode: 'node' },
      },
      (err, container) => {
        if (err != null) reject(new Error(err))
        if (commands == null) return 'fuck'
        if (commands === null) reject('Commands is null. Please check your deploy configs.')
        console.log(commands)
        return container?.start({}, async () => {
          await runExec({
            container,
            cmd: 'git clone ' + repo + ' ./',
            workdir: '/usr/src/app',
            dpId,
            redact: [installationAuthentication['token']],
          })
            .catch((err) => reject(err))
            .then((message) => childLogger.info(message))
          console.log(4)
          await runExec({ container, cmd: commands.installCmd, workdir, dpId })
            .catch((err) => reject(err))
            .then((message) => childLogger.info(message))

          await runExec({ container, cmd: commands.buildCmd, workdir, dpId })
            .catch((err) => reject(err))
            .then((message) => childLogger.info(message))

          const deployment = await db.deployment.update({
            data: { status: 'SUCCESS' },
            where: { id: args.deployment.id },
          })
          client.set(deployment.domain, 'http://' + container.id.slice(0, 12) + ':3000')
          await runExec({ container, cmd: commands.startCmd, workdir, dpId })
            .catch((err) => reject(err))
            .then((message) => childLogger.info(message))

          resolve(`Finished deploying deploying deployment id ${dpId}!`)
        })
      },
    )
  })
}

export default deployNode
