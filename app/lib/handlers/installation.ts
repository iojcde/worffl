import { log } from '@blitzjs/display'
import db from 'db'
import { createAppAuth } from '@octokit/auth-app'
import { InstallationCreatedHandlerArgsType } from 'app/lib/handlers/types'
import { config } from 'app/api/github/webhooks'

export const installationHandler = async ({
  octokit,
  payload,
}: InstallationCreatedHandlerArgsType): Promise<void> => {
  const auth = createAppAuth({
    appId: config.appId,
    privateKey: config.privateKey,
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    installationId: payload.installation.id,
  })
  const installationToken = await auth({
    type: 'installation',
  }).then((res) => res['token'])
  console.log('heres a token: ' + installationToken)

  if (payload.installation.account.type === 'User') {
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await fetch(`https://api.github.com/repositories/${item.id}`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())
      await db.ghRepo.upsert({
        where: { ghrepoid: item.id },
        create: {
          ghrepoid: item.id,
          private: item.private,
          name: item.full_name,
          createdAt: moredata.created_at,
          updatedAt: moredata.updated_at,
          owner: { connect: { ghuserid: payload.sender.id } },
        },
        update: { private: item.private, name: item.full_name, updatedAt: moredata.updated_at },
      })
    })
    log.info(payload.sender.login + ' has Installed the Github app')
  }

  if (payload.installation.account.type === 'Organization') {
    const account = payload.installation.account

    const team = await db.team.upsert({
      where: { ghOrgId: account.id },
      create: {
        name: account.name === undefined ? account.login : account.name,
        installationId: payload.installation.id,
        ghOrgId: account.id,
      },
      update: {
        name: account.name === undefined ? account.login : account.name,
        installationId: payload.installation.id,
      },
    })
    console.log(team)
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await fetch(`https://api.github.com/repositories/${item.id}`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())

      await db.ghRepo.upsert({
        where: { ghrepoid: item.id },
        create: {
          name: item.full_name,
          ghrepoid: item.id,
          private: item.private,
          createdAt: moredata.created_at,
          updatedAt: moredata.updated_at,
          ownerTeam: {
            connect: {
              ghOrgId: account.id,
            },
          },
        },
        update: { private: item.private, name: item.full_name, updatedAt: moredata.updated_at },
      })
    })
  }
}

export default installationHandler
