import { APIEvent, redirect } from 'solid-start'
import { createSession } from '~/lib/cookie'

export function GET(event: APIEvent) {
  const url = new URL(event.request.url)

  const token = url.searchParams.get('token')

  if (!token) {
    throw redirect('/login')
  }

  return createSession(event.request, token)
}
