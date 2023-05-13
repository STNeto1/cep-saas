import { Api, StackContext, use } from 'sst/constructs'
import { Database } from './Database'

export function API({ stack }: StackContext) {
  const db = use(Database)

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [db]
      }
    },
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
      'GET /search/{cep}': 'packages/functions/src/search.handler'
    }
  })

  stack.addOutputs({
    ApiEndpoint: api.url
  })
}
