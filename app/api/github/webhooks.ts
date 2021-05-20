import { App, createNodeMiddleware } from '@octokit/app'
import db from 'db'
import fs from 'fs'
import { log } from '@blitzjs/display'

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

/* app.webhooks.on('push', async ({ id, name, payload }) => {
  const project = await db.project.findFirst({ where: { GhRepo: { id: payload.repository.id } } })
  if (project !== null) {
  }
}) */
export default createNodeMiddleware(app)
