import { User } from '@cep-saas/core/user'
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth'
import { Config } from 'sst/node/config'

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userID: string
      role: User.Info['role']
    }
  }
}

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async (tokenSet) => {
        const claims = tokenSet.claims()

        let existingUser = await User.fromEmail(claims.email!)
        if (!existingUser) {
          existingUser = await User.create({
            email: claims.email!,
            name: claims.name,
            profilePicture: claims.picture
          })
        }

        return Session.parameter({
          redirect: Config.AUTH_REDIRECT_URL,
          type: 'user',
          properties: {
            userID: existingUser?.userID,
            role: existingUser?.role
          }
        })
      }
    })
  }
})
