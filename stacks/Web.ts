import { SolidStartSite, StackContext, use } from 'sst/constructs'
import { API } from './Api'

export function Web({ stack }: StackContext) {
  const api = use(API)

  const site = new SolidStartSite(stack, 'site', {
    path: 'packages/web',
    environment: {
      VITE_API_URL: api.url
    }
  })

  stack.addOutputs({
    URL: site.url || 'localhost:3000'
  })

  return site
}
