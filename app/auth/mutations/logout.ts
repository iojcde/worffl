// app/auth/muations/logout.ts
import { Ctx } from 'blitz'

export default async function logout(_: unknown, ctx: Ctx): Promise<void> {
  // 1. Revoke the current user session, logging them out.
  return await ctx.session.$revoke()
}
