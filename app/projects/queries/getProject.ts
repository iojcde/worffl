import { Ctx } from 'blitz'
import db, { Deployment, GhRepo, Project } from 'db'

interface GetProjectInput {
  // This accepts type of undefined, but is required at runtime
  id?: number
  name: string
}
const getProject = async (
  { id, name }: GetProjectInput,
  ctx: Ctx,
): Promise<
  | (Project & {
      GhRepo: GhRepo | null
      Deployments: Deployment[]
    })
  | null
> => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const project = await db.project.findFirst({
    where: {
      OR: [
        { userId: ctx.session.userId, name: name },
        { userId: ctx.session.userId, id: id },
        { team: { members: { some: { id: ctx.session.userId } } } },
      ],
    },
    include: { GhRepo: true, Deployments: true },
  })

  return project
}

export default getProject
