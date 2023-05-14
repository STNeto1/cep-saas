import { Show } from 'solid-js'
import { redirect, useRouteData } from 'solid-start'
import { createServerData$, json } from 'solid-start/server'
import { getToken } from '~/lib/cookie'

type User = {
  id: string
  email: string
  apiKey: string
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const sessionToken = await getToken(request)

    if (!sessionToken) {
      console.log('no session token')
      throw redirect('/login')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    })

    if (!response.ok) {
      throw redirect('/login')
    }

    const data: User = await response.json()
    return data
  })
}

export default function Home() {
  const data = useRouteData<typeof routeData>()

  return (
    <main>
      <Show when={data.loading}>loading...</Show>
      <Show when={data.error}>error: {data.error.message}</Show>
      <Show when={data()}>
        <pre>{JSON.stringify(data(), null, 2)}</pre>
      </Show>
    </main>
  )
}
