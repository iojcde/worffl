import { Deployment, Project, GhRepo } from 'db'
import Docker from 'dockerode'
import { Image } from 'types'

const docker = new Docker()
type runExecProps = {
  container: Docker.Container
  cmd: string
  workdir: string
  history: string[]
}

const runExec = ({ container, cmd, workdir, history }: runExecProps): Promise<void> => {
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
    GhRepo: GhRepo | null
  }
  deployment: Deployment
  image: Image
}

const deployNode = async (args: deployNodeArgs): Promise<void> => {
  const history = []
  const repo = args.project.GhRepo?.url

  const commands = args.project.commands
  const env = args['env']
  const workdir = '/usr/src/app/' + repo?.split('/').slice(-1)[0]

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
        runExec({ container, cmd: 'git clone ' + repo, workdir: '/usr/src/app', history })
        await runExec({ container, cmd: commands['install'], workdir, history })
        await runExec({ container, cmd: commands['build'], workdir, history })
        await runExec({ container, cmd: commands['start'], workdir, history })
        console.log('finished')
      })
    },
  )
}

export default deployNode
