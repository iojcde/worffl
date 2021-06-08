import db from 'db'
import { createAppAuth } from '@octokit/auth-app'
import { RepoCreatedHandlerArgsType } from 'app/lib/handlers/types'
import { config } from 'app/api/github/webhooks'

export const repoCreatedHandler = async ({
  octokit,
  payload,
}: RepoCreatedHandlerArgsType): Promise<void> => {
  const auth = createAppAuth({
    appId: config.appId,
    privateKey: config.privateKey,
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    installationId: payload.installation?.id,
  })
  const installationToken = await auth({
    type: 'installation',
  }).then((res) => res['token'])
  if (payload.repository.owner.type === 'User') {
    const branches = await fetch(payload.repository.branches_url, {
      headers: {
        authorization: `bearer ${installationToken}`,
      },
    }).then((res) => res.json())

    await db.ghRepo.upsert({
      where: { ghid: payload.repository.id },
      create: {
        lang: payload.repository.language!,
        ghid: payload.repository.id,
        defaultBranch: payload.repository.default_branch,
        private: payload.repository.private,
        branches: branches.map((branch: Record<string, unknown>) => branch.name),
        name: payload.repository.full_name,
        ownerType: 'USER',
        createdAt: payload.repository.created_at.toString(),
        updatedAt: payload.repository.updated_at,
        owner: { connect: { ghuserid: payload.sender.id } },
      },
      update: {
        private: payload.repository.private,
        name: payload.repository.full_name,
        ownerType: 'USER',

        lang: payload.repository.language!,
        branches: branches.map((branch: Record<string, unknown>) => branch.name),
        defaultBranch: payload.repository.default_branch,
        updatedAt: payload.repository.updated_at,
      },
    })
  }
  if (payload.repository.owner.type === 'Organization') {
    const branches = await fetch(payload.repository.branches_url, {
      headers: {
        authorization: `bearer ${installationToken}`,
      },
    }).then((res) => res.json())
    await db.ghRepo.upsert({
      where: { ghid: payload.repository.id },
      create: {
        lang: payload.repository.language!,
        ghid: payload.repository.id,
        defaultBranch: payload.repository.default_branch,
        private: payload.repository.private,
        branches: branches.map((branch: Record<string, unknown>) => branch.name),
        name: payload.repository.full_name,
        ownerType: 'TEAM',
        createdAt: payload.repository.created_at.toString(),
        updatedAt: payload.repository.updated_at,
        ownerTeam: {
          connect: { ghOrgId: payload.repository.owner.id },
        },
      },
      update: {
        private: payload.repository.private,
        lang: payload.repository.language!,
        name: payload.repository.full_name,
        ownerType: 'TEAM',
        branches: branches.map((branch: Record<string, unknown>) => branch.name),
        defaultBranch: payload.repository.default_branch,
        updatedAt: payload.repository.updated_at,
      },
    })
  }
}

export default repoCreatedHandler
