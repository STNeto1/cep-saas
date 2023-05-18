import { Show } from 'solid-js'
import { redirect, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Header } from '~/components/header$'
import { getToken } from '~/lib/cookie'

export type User = {
  id: string
  name: string | null
  email: string
  profilePicture: string | null
  apiKey: string
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const sessionToken = await getToken(request)

    if (!sessionToken) {
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
    <>
      <main>
        <Header user={data()} />

        <section class="container  bg-muted w-1/2 p-4 rounded">
          <h2 class="font-medium text-xl">Home</h2>

          <section class="pt-4">
            <h4 class="font-medium text-lg">Api Key</h4>
            <Show when={data()?.apiKey} fallback={'Loading...'}>
              <p class="text-sm">
                Your API key is <code>{data()?.apiKey}</code>
              </p>
            </Show>
          </section>

          <section class="pt-4">
            <h4 class="font-medium text-lg">Invoices</h4>
            <Show when={data()?.apiKey} fallback={'Loading...'}>
              <p class="text-sm">
                Your API key is <code>{data()?.apiKey}</code>
              </p>
            </Show>
          </section>
        </section>
      </main>
    </>
  )
}
