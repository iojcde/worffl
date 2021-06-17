import db from 'db'
import crypto from 'crypto'
import { config } from 'app/api/github/webhooks'
import { createAppAuth } from '@octokit/auth-app'
import { Ctx, resolver } from 'blitz'
import { z } from 'zod'
import logger from 'logs'
import deployNode from 'app/lib/deploy/frameworks/node'

const childLogger = logger.child({ service: 'worffl:createProject' })
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
        include: {
          Deployments: true,
          GhRepo: {
            select: { ownerTeam: true, owner: true, ghid: true, name: true, defaultBranch: true },
          },
        },
      })

      const user = await db.user.findFirst({
        where: { id: ctx.session.userId },
        select: { installationId: true, ghusername: true },
      })

      const installationId = user?.installationId
      if (installationId == null) {
        childLogger.error('installationId is null')
        return
      }
      const auth = createAppAuth({
        appId: config.appId,
        privateKey: config.privateKey,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        installationId: installationId,
      })
      const installationToken = await auth({
        type: 'installation',
      }).then((res) => res['token'])

      const repo = await fetch(`https://api.github.com/repositories/${project.GhRepo?.ghid}`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      })
        .then((res) => res.json())
        .catch((err) => childLogger.error(err))

      const sha = await fetch(
        `https://api.github.com/repositories/${project.GhRepo?.ghid}/git/refs/heads/${project.GhRepo?.defaultBranch}`,
        {
          headers: {
            authorization: `bearer ${installationToken}`,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => data.object.sha)
        .catch((err) => childLogger.error(err))

      const owner =
        repo.organization === undefined
          ? await db.user.findFirst({ where: { ghuserid: repo.owner.id } })
          : await db.team.findFirst({ where: { ghOrgId: repo.organization.id } })

      if (owner == null) {
        childLogger.error('owner is null')
        return
      }

      const type = project.Deployments.length === 0 ? 'PRODUCTION' : 'PREVIEW'

      const tmpDeployment = await db.deployment.create({
        data: {
          projectId: project.id,
          type: type,
          sha: sha,
          status: 'IN_PROGRESS',
          domain: `will_be_edited`,
        },
      })

      const _domainHash = crypto.createHash('sha1')
      const data = _domainHash.update(tmpDeployment.id + sha)

      const domainHash = data.digest('hex').slice(0, 7)

      const deploymentData = await db.deployment.update({
        data: {
          projectId: project.id,
          type: type,
          sha: sha,
          status: 'IN_PROGRESS',
          domain: `${project.name}-${domainHash}-${owner.name}.worffl.jcde.xyz`,
        },
        where: { id: tmpDeployment.id },
      })

      await deployNode({
        project: project,
        deployment: deploymentData,
        image: 'builder',
        owner: owner,
      })
    } catch (e) {
      logger.error(e)
    }
  },
)
