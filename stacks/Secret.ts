import { Config, StackContext } from 'sst/constructs'

export function Secret({ stack }: StackContext) {
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, 'GOOGLE_CLIENT_ID')
  const AUTH_REDIRECT_URL = new Config.Secret(stack, 'AUTH_REDIRECT_URL')

  stack.addOutputs({
    SECRETS: [GOOGLE_CLIENT_ID.name, AUTH_REDIRECT_URL.name].join(', ')
  })

  return {
    GOOGLE_CLIENT_ID,
    AUTH_REDIRECT_URL
  }
}
