const { sessionMiddleware, simpleRolesIsAuthorized } = require('blitz')

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}
