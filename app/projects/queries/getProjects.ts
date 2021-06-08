import { paginate, resolver, Ctx } from 'blitz'
import { Prisma } from 'db'
import db from 'db'

type GetProjectsInput = Pick<
  Prisma.ProjectFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take' | 'include'
>

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, include, orderBy, skip = 0, take = 100 }: GetProjectsInput, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.project.count({ where }),
      query: (paginateArgs) => db.project.findMany({ ...paginateArgs, where, orderBy, include }),
    })
    ctx.session.$authorize()

    return {
      projects,
      nextPage,
      hasMore,
      count,
    }
  },
)
