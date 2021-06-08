import { resolver, NotFoundError, Ctx } from 'blitz'
import db from 'db'
import * as z from 'zod'

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetProject),
  resolver.authorize(),
  async ({ id, name }, ctx: Ctx) => {
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
      include: { GhRepo: true },
    })

    if (!project) throw new NotFoundError()

    return project
  },
)
