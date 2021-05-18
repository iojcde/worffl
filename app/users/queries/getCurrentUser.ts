import { Ctx } from "blitz"
import db from "db"
export type getCurrentUserResult = {
  role: string
  id: number
  name: string
  email: string
  picture: string | null
}
export default async function getCurrentUser(
  _ = null,
  { session }: Ctx
): Promise<getCurrentUserResult | null> {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, picture: true },
  })

  return user
}
