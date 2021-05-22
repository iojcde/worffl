import { App, createNodeMiddleware } from '@octokit/app'
import { installationHandler, pushHandler } from 'app/lib/handlers'

import fs from 'fs'

export const config = {
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET as string,
  appId: parseInt(process.env.GITHUB_APP_ID as string) as number,
  privateKey:
    process.env.NODE_ENV === 'development'
      ? (fs.readFileSync('/home/jcde/sirius/dply-app-dev.pem', 'utf-8') as string)
      : (process.env.GITHUB_PRIVATE_KEY as string),
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

export default createNodeMiddleware(app)
