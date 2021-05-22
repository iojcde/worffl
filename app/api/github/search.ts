import { SessionContext, BlitzApiHandler, getSession } from 'blitz'
import db from 'db'

const searchApi: BlitzApiHandler = async (req, res) => {
  const session: SessionContext = await getSession(req, res)

  const query = req.query.q
  session.$authorize()
  console.log(query)
  const repos = await db.ghRepo.findMany({
    where: {
      name: { contains: query as string },
      ownerId: session.userId,
    },
  })
  res.json(repos)
}
export default searchApi
