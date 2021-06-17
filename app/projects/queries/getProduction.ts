import { resolver } from 'blitz'
import db from 'db'
import * as z from 'zod'

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  projectId: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetProject),
  resolver.authorize(),
  async ({ projectId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const deployment = await db.deployment.findFirst({
      where: { projectId: projectId, type: 'PRODUCTION' },
    })

    if (!deployment) return null

    return deployment
  },
)
