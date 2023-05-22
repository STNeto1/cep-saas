import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Header$ } from '~/components/header$'
import { fetchUser } from '~/lib/api$'

export function routeData() {
  return createServerData$(async (_, { request }) => fetchUser(request))
}

export default function Billing() {
  const data = useRouteData<typeof routeData>()
  return (
    <>
      <main>
        <Header$ user={data()} />
      </main>
    </>
  )
}
