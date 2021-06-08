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

  if (payload.installation.account.type === 'User') {
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await fetch(`https://api.github.com/repositories/${item.id}`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())
      const branches = await fetch(`https://api.github.com/repos/${moredata.full_name}/branches`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())

      const language = await fetch(moredata.languages_url, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      })
        .then((res) => res.json())
        .then((langs) => Object.keys(langs)[0])

      await db.ghRepo.upsert({
        where: { ghid: item.id },
        create: {
          ghid: item.id,
          defaultBranch: moredata.default_branch,
          lang: language,
          private: item.private,
          branches: branches.map((branch: Record<string, unknown>) => branch.name),
          name: item.full_name,
          ownerType: 'USER',
          createdAt: moredata.created_at,
          updatedAt: moredata.updated_at,
          owner: { connect: { ghuserid: payload.sender.id } },
        },
        update: {
          private: item.private,
          name: item.full_name,
          lang: language,
          ownerType: 'USER',
          branches: branches.map((branch: Record<string, unknown>) => branch.name),
          defaultBranch: moredata.default_branch,
          updatedAt: moredata.updated_at,
        },
      })
      await db.user.update({
        where: { ghuserid: payload.sender.id },
        data: { installationId: payload.installation.id },
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
    db.user.update({
      data: { teams: { connect: { id: team.id } } },
      where: { ghuserid: payload.sender.id },
    })
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await fetch(`https://api.github.com/repositories/${item.id}`, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())

      const branches = await fetch(moredata.branches_url, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      }).then((res) => res.json())

      const language = await fetch(moredata.languages_url, {
        headers: {
          authorization: `bearer ${installationToken}`,
        },
      })
        .then((res) => res.json())
        .then((langs) => Object.keys(langs)[0])

      await db.ghRepo.upsert({
        where: { ghid: item.id },
        create: {
          name: item.full_name,
          ghid: item.id,
          lang: language,
          branches: branches.map((branch: Record<string, unknown>) => branch.name),
          defaultBranch: moredata.default_branch,
          private: item.private,
          createdAt: moredata.created_at,
          updatedAt: moredata.updated_at,
          ownerType: 'TEAM',
          ownerTeam: {
            connect: {
              ghOrgId: account.id,
            },
          },
        },
        update: {
          private: item.private,
          lang: language,
          branches: branches.map((branch: Record<string, unknown>) => branch.name),
          defaultBranch: moredata.default_branch,
          ownerType: 'TEAM',
          name: item.full_name,
          updatedAt: moredata.updated_at,
        },
      })
    })
  }
}

export default installationHandler
