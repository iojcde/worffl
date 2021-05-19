import { resolver } from 'blitz'
import db from 'db'
import * as z from 'zod'
import { Ctx } from 'blitz'
const CreateProject = z
  .object({
    name: z.string(),
    commands: z.array(z.string()),
    domains: z.array(z.string()),
    git: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateProject),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    ctx.session.$authorize()
    const project = await db.project.create({ data: { userId: ctx.session.userId, ...input } })
    return project
  },
)
