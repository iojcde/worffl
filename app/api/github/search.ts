import { SessionContext, BlitzApiHandler, getSession } from 'blitz'
import db from 'db'

const searchApi: BlitzApiHandler = async (req, res) => {
  const session: SessionContext = await getSession(req, res)

  const query = req.query.q
  session.$authorize()

  const repos = await db.ghRepo.findMany({
    where: {
      OR: [
        {
          name: { contains: query as string, mode: 'insensitive' },
          ownerId: session.userId,
        },
        {
          name: { contains: query as string, mode: 'insensitive' },
          ownerTeam: { members: { some: { id: session.userId } } },
        },
      ],
    },
  })
  res.json(repos)
}
export default searchApi
