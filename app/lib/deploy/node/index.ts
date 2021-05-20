import { Deployment, Project } from 'db'
import Docker from 'dockerode'

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
        }, 2000)
      })
    })
  })
}

type deployNodeArgs = {
  project: Project
  Deployment: Deployment
}

const deployNode = async (args: deployNodeArgs): Promise<void> => {
  const history = []
  const repo = args.Deployment.git

  const commands = args.project.commands
  const env = args['env']
  const workdir = '/usr/src/app/' + repo.split('/').slice(-1)[0]

  docker.createContainer(
    {
      Image: 'nodejs',
      Tty: true,
      Cmd: ['/bin/sh'],
      name: `${args.project.name}_${args.Deployment.name}_${args.Deployment.id}`,
      Env: env,
    },
    (err, container) => {
      container?.start({}, (err, data) => {
        runExec({ container, cmd: 'git clone ' + repo, workdir: '/usr/src/app', history })
          .then(() => runExec({ container, cmd: commands['install'], workdir, history }))
          .then(() => runExec({ container, cmd: commands['build'], workdir, history }))
          .then(() => {
            runExec({ container, cmd: commands['start'], workdir, history })
            console.log('finished')
          })
      })
    },
  )
}

export default deployNode
