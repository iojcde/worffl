// app/api/auth/[...auth].ts
import { passportAuth } from 'blitz'
import db from 'db'
import { Strategy as GithubStrategy } from 'passport-github2'

export default passportAuth({
  successRedirectUrl: '/',
  secureProxy: true,
  errorRedirectUrl: '/',
  strategies: [
    {
      strategy: new GithubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        async function (_token, _tokenSecret, profile, done) {
          const email = profile.emails && profile.emails[0]?.value
          const photo = profile.photos && profile.photos[0]?.value
          if (!email) {
            // This can happen if you haven't enabled email access in your twitter app permissions
            return done(new Error("Github OAuth response doesn't have email."))
          }

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
              ghuserid: parseInt(profile.id),
              ghusername: profile.username,
              picture: photo,
            },
            update: { email, picture: photo },
          })
          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: 'github',
          }
          done(undefined, { publicData })
        },
      ),
    },
  ],
})
