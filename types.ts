import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from 'blitz'
import { User } from 'db'

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = 'ADMIN' | 'USER'
export type Image = 'node:14-alpine' | 'alpine' | 'node:14' | 'builder'

declare module 'blitz' {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User['id']
      role: Role
    }
  }
}

export type parseConfigReturn = {
  err?: string
  data?: Config
}

export interface Config {
  image: Image
  redirects: Array<string>
  headers: Array<string>
  build: string
  install: string
}

export interface getConfigInput {
  token: string
  repo: string
  path: string
}

export interface logMessage {
  status: 'success' | 'error'
  type: 'deployment' | 'info'
  message: string
}
