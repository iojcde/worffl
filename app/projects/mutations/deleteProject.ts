import { resolver, Ctx } from 'blitz'
import db from 'db'
import * as z from 'zod'
const CreateProject = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateProject),
  resolver.authorize(),
  async ({ id }, ctx: Ctx) => {
    ctx.session.$authorize()
    if (
      ctx.session.userId ===
      db.project.findFirst({
        where: { id: id },
        select: { userId: true },
      })[0].userID
    )
      return await db.project.deleteMany({ where: { id: id } })
  },
)
