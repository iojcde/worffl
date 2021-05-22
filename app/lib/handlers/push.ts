import db from 'db'
import deployNode from 'app/lib/deploy/frameworks/node'
import { PushHandlerArgsType } from 'app/lib/handlers/types'
export const pushHandler = async ({ id, name, payload }: PushHandlerArgsType): Promise<void> => {
  const owner =
    payload.organization === undefined
      ? await db.user.findFirst({ where: { ghuserid: payload.sender.id } })
      : await db.team.findFirst({ where: { ghOrgId: payload.organization.id } })
  if (owner === null) return

  const project = await db.project.findFirst({
    where: { GhRepo: { id: payload.repository.id } },
    include: { GhRepo: { select: { ownerTeam: true, owner: true, ghrepoid: true } } },
  })
  if (project === null) return
  if (project.GhRepo === null) return

  const dplymntName = payload.after
  const ref = payload.ref
  const isProduction = ref.substring(ref.lastIndexOf('/') + 1) === project.mainBranch
  const deploymentData = await db.deployment.create({
    data: {
      name: dplymntName,
      projectId: project.id,
      production: isProduction,
      sha: payload.after,
      domain: `https://${dplymntName}.${owner.name}.dply.app`,
    },
  })

  deployNode({ image: 'node:14-alpine', project, deployment: deploymentData, owner: owner })
}
