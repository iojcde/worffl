import db from 'db'
import deployNode from 'app/lib/deploy/frameworks/node'
import { PushHandlerArgsType } from 'app/lib/handlers/types'
import logger from 'logs'

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
    include: { GhRepo: { select: { ownerTeam: true, owner: true, ghid: true, name: true } } },
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
    childLogger.error('Ghrepo is')
    return
  }

  const dplymntName = payload.after
  const deploymentData = await db.deployment.create({
    data: {
      name: dplymntName,
      projectId: project.id,
      type: 'STAGING',
      sha: payload.after,
      status: 'IN_PROGRESS',
      domain: `${project.name}-${payload.after.slice(0, 7)}.${owner.name}.worffl.jcde.xyz`,
    },
  })
  deployNode({ image: 'builder', project, deployment: deploymentData, owner: owner })
    .catch((err) => childLogger.error(err))
    .then((message) => childLogger.info(message))
}
