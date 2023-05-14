import { SolidStartSite, StackContext } from 'sst/constructs'

export function Web({ stack }: StackContext) {
  const site = new SolidStartSite(stack, 'site', {
    path: 'packages/web'
  })

  stack.addOutputs({
    URL: site.url || 'localhost:3000'
  })

  return site
}
