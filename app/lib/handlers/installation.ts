import { log } from '@blitzjs/display'
import db from 'db'
import { InstallationCreatedHandlerArgsType } from 'app/lib/handlers/types'

export const installationHandler = async ({
  octokit,
  payload,
}: InstallationCreatedHandlerArgsType): Promise<void> => {
  if (payload.sender.type === 'User') {
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await octokit
        .request(`GET /repos/{owner}/{repo}`, {
          owner: payload.installation.account.login,
          repo: item.name,
        })
        .then((res) => res.data)
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
    log.info(payload.sender.name + 'has Installed the Github app')
  }

  if (payload.sender.type === 'Organization') {
    const account = payload.installation.account
    await db.team.upsert({
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
    // update repos to db
    payload.repositories?.forEach(async (item) => {
      const moredata = await octokit
        .request(`GET /repos/{owner}/{repo}`, {
          owner: payload.installation.account.login,
          repo: item.name,
        })
        .then((res) => res.data)

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
              ghOrgId: payload.sender.id,
            },
          },
        },
        update: { private: item.private, name: item.full_name, updatedAt: moredata.updated_at },
      })
    })
  }
}
export default installationHandler
