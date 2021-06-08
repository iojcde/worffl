import db from 'db'
import { Ctx, resolver } from 'blitz'
import { z } from 'zod'
import logger from 'logs'
const createProject = z.object({
  name: z.string(),
  commands: z.object({ installCmd: z.string(), buildCmd: z.string(), startCmd: z.string() }),
  domains: z.string(),
  ownerType: z.enum(['TEAM', 'USER']),
  lang: z.string(),
  mainBranch: z.string(),
  ghRepoId: z.number(),
})

export default resolver.pipe(
  resolver.zod(createProject),

  async (input, ctx: Ctx) => {
    ctx.session.$authorize()
    const createdCommand = await db.commands.create({
      data: {
        installCmd: input.commands.installCmd,
        buildCmd: input.commands.buildCmd,
        startCmd: input.commands.startCmd,
      },
    })
    try {
      const project = await db.project.create({
        data: {
          GhRepo: { connect: { id: input.ghRepoId } },
          name: input.name,
          commands: { connect: { id: createdCommand.id } },
          ownerType: input.ownerType,
          mainBranch: input.mainBranch,
          lang: input.lang,
          user: { connect: { id: ctx.session.userId } },
        },
      })
      return project
    } catch (e) {
      logger.error(e)
    }
  },
)
