import db from 'db'
import deployNode from 'app/lib/deploy/frameworks/node'
import { PushHandlerArgsType } from 'app/lib/handlers/types'
import logger from 'logs'
import crypto from 'crypto'
const childLogger = logger.child({ service: 'pushHandler' })
export const pushHandler = async ({ octokit, payload }: PushHandlerArgsType): Promise<void> => {
  childLogger.info('Handling "push" event')

  const owner =
    payload.organization === undefined
      ? await db.user.findFirst({ where: { ghuserid: payload.sender.id } })
      : await db.team.findFirst({ where: { ghOrgId: payload.organization.id } })

  if (owner === null) childLogger.error('owner is null')

  const project = await db.project.findFirst({
    where: { GhRepo: { ghid: payload.repository.id } },
    include: {
      Deployments: true,
      GhRepo: { select: { ownerTeam: true, owner: true, ghid: true, name: true } },
    },
  })
  if (project === null) {
    childLogger.error('Owner is null')
    return
  }
  if (owner === null) {
    childLogger.error('Owner is null')
    return
  }
  if (project.GhRepo === null) {
    childLogger.error('Ghrepo is null')
    return
  }
  const type = project.Deployments.length === 0 ? 'PRODUCTION' : 'PREVIEW'

  const tmpDeployment = await db.deployment.create({
    data: {
      projectId: project.id,
      type: type,
      sha: payload.after,
      status: 'IN_PROGRESS',
      domain: 'willBeEdited',
    },
  })
  const _domainHash = crypto.createHash('sha1')
  const data = _domainHash.update(tmpDeployment.id + payload.after)

  const domainHash = data.digest('hex').slice(0, 7)

  const deploymentData = await db.deployment.update({
    data: {
      projectId: project.id,
      type: type,
      sha: payload.after,
      status: 'IN_PROGRESS',
      domain: `${project.name}-${domainHash}-${owner.name}.worffl.jcde.xyz`,
    },
    where: { id: tmpDeployment.id },
  })
  deployNode({ image: 'builder', project, deployment: deploymentData, owner: owner })
    .catch((err) => childLogger.error(err))
    .then((message) => childLogger.info(message))
}
