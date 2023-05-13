import { User } from '@cep-saas/core/user'
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth'

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userID: string
      role: string
    }
  }
}

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      onSuccess: async (tokenSet) => {
        const claims = tokenSet.claims()

        let existingUser = await User.fromEmail(claims.email!)
        if (!existingUser) {
          existingUser = await User.create(claims.email!)
        }

        return Session.cookie({
          redirect:
            'https://fnuhcvjm9b.execute-api.sa-east-1.amazonaws.com/auth/',
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
