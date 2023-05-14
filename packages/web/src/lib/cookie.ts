import { createCookieSessionStorage, redirect } from 'solid-start'

const storage = createCookieSessionStorage({
  cookie: {
    name: 'auth.token',
    secure: process.env.NODE_ENV === 'production',
    secrets: ['some-secret'],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  }
})

export async function getToken(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return session.get('token')
}

export async function createSession(request: Request, token: string) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  session.set('token', token)

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

export async function deleteSession(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}
