import { Octokit } from '@octokit/core'
import { EmitterWebhookEvent } from '@octokit/webhooks'
export type InstallationCreatedHandlerArgsType = EmitterWebhookEvent<'installation.created'> & {
  octokit: Octokit
}
export type PushHandlerArgsType = EmitterWebhookEvent<'push'> & {
  octokit: Octokit
}

export type RepoCreatedHandlerArgsType = EmitterWebhookEvent<'repository.created'> & {
  octokit: Octokit
}
