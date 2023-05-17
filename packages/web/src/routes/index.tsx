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
      </main>
    </>
  )
}
