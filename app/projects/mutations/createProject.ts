import db, { OwnerType, Project } from 'db'
import { Ctx } from 'blitz'
type CreateProject = {
  name: string
  commands: string[]
  domains: string
  ownerType: OwnerType
  lang: string
  mainBranch: string
  ghRepoId: number
}
const createProject = async (input: CreateProject, ctx: Ctx): Promise<Project> => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const project = await db.project.create({
    data: {
      GhRepo: { connect: { ghrepoid: input.ghRepoId } },
      ...input,
    },
  })
  return project
}
export default createProject
