import { redirect } from 'solid-start/server'
import { User } from '~/routes'
import { getToken } from './cookie'

export const fetchUser = async (request: Request) => {
  const sessionToken = await getToken(request)

  if (!sessionToken) {
    throw redirect('/login')
  }

  console.log({
    sessionToken
  })

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
}
