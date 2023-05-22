import { Config, StackContext } from 'sst/constructs'

export function Secret({ stack }: StackContext) {
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, 'GOOGLE_CLIENT_ID')
  const AUTH_REDIRECT_URL = new Config.Secret(stack, 'AUTH_REDIRECT_URL')
  const STRIPE_PUBLISHABLE_KEY = new Config.Secret(
    stack,
    'STRIPE_PUBLISHABLE_KEY'
  )
  const STRIPE_SECRET_KEY = new Config.Secret(stack, 'STRIPE_SECRET_KEY')

  stack.addOutputs({
    SECRETS: [
      GOOGLE_CLIENT_ID.name,
      AUTH_REDIRECT_URL.name,
      STRIPE_PUBLISHABLE_KEY.name,
      STRIPE_SECRET_KEY.name
    ].join(', ')
  })

  return {
    GOOGLE_CLIENT_ID,
    AUTH_REDIRECT_URL,
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY
  }
}
