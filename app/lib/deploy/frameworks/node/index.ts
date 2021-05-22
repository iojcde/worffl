import db, { Deployment, Project, Team, User } from 'db'
import { createAppAuth } from '@octokit/auth-app'
import { config } from 'app/api/github/webhooks'
import Docker from 'dockerode'
import { Image } from 'types'

const docker = new Docker()
type runExecProps = {
  container: Docker.Container
  cmd: string
  workdir: string
  history: string[]
  dpId: number
}

const runExec = ({ container, cmd, workdir, history, dpId }: runExecProps): Promise<void> => {
  return new Promise<void>((resolve) => {
    const options = {
      Cmd: ['/bin/sh', '-c', cmd],
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: workdir,
    }
    container.exec(options, (err, exec) => {
      if (err || exec === undefined) return
      exec.start({}, (err, stream) => {
        if (err) return

        stream?.on('data', (chunk) => {
          history.push(chunk)
          db.deployment.update({ data: { logs: history }, where: { id: dpId } })
        })

        setInterval(() => {
          exec.inspect((err, data) => {
            if (err || data === undefined) return
            if (!data.Running) resolve()
          })
        }, 1000)
      })
    })
  })
}

type deployNodeArgs = {
  project: Project & {
    GhRepo: {
      ghrepoid: number
      owner: User | null
      ownerTeam: Team | null
    } | null
  }
  deployment: Deployment
  image: Image
  owner: Team | User
}

const deployNode = async (args: deployNodeArgs): Promise<void> => {
  const history = []

  const commands = args.project.commands
  const env = args['env']
  const repoData = await fetch(
    `https://api.github.com/repositories/${args.project.GhRepo?.ghrepoid}`,
  ).then((res) => res.json())

  const repoFullName = repoData.full_name

  const workdir = '/usr/src/app/'

  const auth = createAppAuth({
    appId: 95733,
    installationId:
      args.project.ownerType === 'TEAM'
        ? (args.project.GhRepo?.ownerTeam?.installationId as number)
        : (args.project.GhRepo?.owner?.installationId as number),
    privateKey: config.privateKey,
    clientId: config.clientID,
    clientSecret: config.clientSecret,
  })

  const installationAuthentication = await auth({ type: 'installation' })
  const repo = `https://x-access-token:${installationAuthentication['token']}@github.com/${repoFullName}`
  const dpId = args.deployment.id
  docker.createContainer(
    {
      Image: args.image,
      Tty: true,
      Cmd: ['/bin/sh'],
      name: `${args.project.name}_${args.deployment.name}_${args.deployment.id}`,
      Env: env,
    },
    (err, container) => {
      container?.start({}, async (err, data) => {
        runExec({ container, cmd: 'git clone ' + repo, workdir: '/usr/src/app', history, dpId })
        await runExec({ container, cmd: commands['install'], workdir, history, dpId })
        await runExec({ container, cmd: commands['build'], workdir, history, dpId })
        await runExec({ container, cmd: commands['start'], workdir, history, dpId })
        console.log('finished')
      })
    },
  )
}

export default deployNode
