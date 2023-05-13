import { Api, Auth, StackContext, use } from 'sst/constructs'
import { Database } from './Database'

export function API({ stack }: StackContext) {
  const db = use(Database)

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler'
    }
  })

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [db],
        environment: {
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
        }
      }
    },
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
      'GET /search/{cep}': 'packages/functions/src/search.handler',

      'POST /keys/create': 'packages/functions/src/keys.createHandler',
      'GET /keys/list': 'packages/functions/src/keys.listHandler',
      'DELETE /keys/delete/{id}': 'packages/functions/src/keys.deleteHandler'
    }
  })

  auth.attach(stack, {
    api,
    prefix: '/auth'
  })

  stack.addOutputs({
    ApiEndpoint: api.url
  })
}
