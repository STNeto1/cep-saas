import { Api, Auth, StackContext, use } from 'sst/constructs'
import { Database } from './Database'
import { Secret } from './Secret'

export function API({ stack }: StackContext) {
  const db = use(Database)
  const {
    GOOGLE_CLIENT_ID,
    AUTH_REDIRECT_URL,
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY
  } = use(Secret)

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler'
    }
  })

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [
          db,
          GOOGLE_CLIENT_ID,
          AUTH_REDIRECT_URL,
          STRIPE_PUBLISHABLE_KEY,
          STRIPE_SECRET_KEY
        ]
      }
    },
    cors: {
      allowCredentials: true,
      allowHeaders: ['content-type'],
      allowMethods: ['ANY'],
      allowOrigins: ['http://localhost:3000', 'https://INSERT_PROD_URL']
    },
    routes: {
      'GET /search/{cep}': 'packages/functions/src/search.handler',

      'GET /user': 'packages/functions/src/user.profileHandler',
      'POST /user/refresh': 'packages/functions/src/user.refreshHandler',

      'GET /products': 'packages/functions/src/stripe.listHandler',
      'POST /products': 'packages/functions/src/stripe.createHandler'
    }
  })

  auth.attach(stack, {
    api,
    prefix: '/auth'
  })

  stack.addOutputs({
    ApiEndpoint: api.url
  })

  return api
}
