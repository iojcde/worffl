import { App, createNodeMiddleware } from '@octokit/app'
import { installationHandler, pushHandler, repoCreatedHandler } from 'app/lib/handlers'

import fs from 'fs'
console.log(process.env.NODE_ENV)

export const config = {
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET as string,
  appId: parseInt(process.env.GITHUB_APP_ID as string) as number,
  privateKey: fs.readFileSync('/usr/src/app/worffl.pem', 'utf8') as string,
}

const app = new App({
  appId: config.appId,
  privateKey: config.privateKey,
  oauth: {
    clientId: config.clientID,
    clientSecret: config.clientSecret,
  },
  webhooks: {
    secret: config.webhookSecret,
  },
})

app.webhooks.on('installation.created', async ({ ...args }) => {
  installationHandler({ ...args })
})

app.webhooks.on('push', async ({ ...args }) => {
  pushHandler({ ...args })
})

app.webhooks.on('repository.created', async ({ ...args }) => {
  repoCreatedHandler({ ...args })
})

export default createNodeMiddleware(app)
