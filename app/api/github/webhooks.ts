import { App, createNodeMiddleware } from '@octokit/app'
import db from 'db'
import fs from 'fs'
import { log } from '@blitzjs/display'
import deployNode from 'app/lib/deploy/frameworks/node'

const clientID = process.env.GITHUB_CLIENT_ID as string,
  clientSecret = process.env.GITHUB_CLIENT_SECRET as string,
  webhookSecret = process.env.GITHUB_WEBHOOK_SECRET as string

const app = new App({
  appId: 95733,
  privateKey: fs.readFileSync('/home/jcde/sirius/dply-app.pem', 'utf-8'),
  oauth: {
    clientId: clientID,
    clientSecret: clientSecret,
  },
  webhooks: {
    secret: webhookSecret,
  },
})

app.webhooks.on('installation.created', async ({ id, name, payload }) => {
  const user = await db.user.findFirst({ where: { ghuserid: payload.sender.id } })
  payload.repositories?.forEach(async (item) => {
    await db.ghRepo.upsert({
      where: { ghrepoid: item.id },
      create: {
        url: 'https://github.com/' + item.full_name,
        ghrepoid: item.id,
        private: item.private,
        owner: {
          connect: { id: 22 },
        },
      },
      update: { private: item.private },
    })
  })
  log.info(user?.name + ' Installed the Github app')
})

app.webhooks.on('push', async ({ id, name, payload }) => {
  const owner = await db.user.findFirst({ where: { ghuserid: payload.sender.id } })
  if (owner === null) return

  const project = await db.project.findFirst({
    where: { GhRepo: { id: payload.repository.id }, userId: owner.id },
    include: { GhRepo: true },
  })
  if (project === null) return

  const dplymntName = payload.after
  const ref = payload.ref
  const isProduction = ref.substring(ref.lastIndexOf('/') + 1) === project.mainBranch
  const deploymentData = await db.deployment.create({
    data: {
      name: dplymntName,
      projectId: project.id,
      production: isProduction,
      sha: payload.after,
      domain: `https://${dplymntName}.${owner.name}.dply.app`,
    },
  })

  deployNode({ image: 'node:14-alpine', project, deployment: deploymentData })
})

export default createNodeMiddleware(app)
