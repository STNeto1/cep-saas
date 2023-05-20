import { Show, createEffect } from 'solid-js'
import {
  FormError,
  redirect,
  refetchRouteData,
  useRouteData
} from 'solid-start'
import { createServerAction$, createServerData$ } from 'solid-start/server'
import { Button$ } from '~/components/button$'
import { Header } from '~/components/header$'
import { CopyIcon, RefreshIcon } from '~/components/icons$'
import { Input$ } from '~/components/input$'
import {
  Tooltip$,
  TooltipContent$,
  TooltipProvider$,
  TooltipTrigger$
} from '~/components/tooltip$'
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

  const handleCopy = async () => {
    const value = data()?.apiKey
    if (!value) {
      // TODO: show error
      return
    }

    // TODO: show success?
    await navigator.clipboard.writeText(value)
  }

  const [refreshState, refresh$] = createServerAction$(
    async (_, { request }) => {
      const sessionToken = await getToken(request)

      if (!sessionToken) {
        throw redirect('/login')
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/refresh`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }
      )

      if (!response.ok) {
        throw new FormError('Something went wrong')
      }

      return { success: true }
    }
  )

  createEffect(async () => {
    if (refreshState.result?.success) {
      await refetchRouteData()
    }
  })

  return (
    <>
      <main>
        <Header user={data()} />

        <section class="container bg-background max-w-6xl rounded mt-12">
          <section class="py-4 flex flex-col gap-4">
            <h4 class="font-medium text-2xl">Credenciais</h4>
            <Show when={data()?.apiKey} fallback={'Loading...'}>
              <section class="flex flex-col gap-2">
                <span>x-api-key</span>
                <div class="flex items-start gap-2">
                  <Input$ value={data()?.apiKey} readonly />

                  <TooltipProvider$>
                    <Tooltip$>
                      <TooltipTrigger$>
                        <Button$ variant={'outline'} onClick={handleCopy}>
                          <CopyIcon class="h-4 w-4" />
                        </Button$>
                      </TooltipTrigger$>

                      <TooltipContent$>
                        <p>Click to copy</p>
                      </TooltipContent$>
                    </Tooltip$>
                  </TooltipProvider$>

                  <TooltipProvider$>
                    <Tooltip$>
                      <TooltipTrigger$>
                        <refresh$.Form>
                          <Button$
                            variant={'destructive'}
                            type="submit"
                            disabled={refreshState.pending}
                          >
                            <RefreshIcon class="h-4 w-4" />
                          </Button$>
                        </refresh$.Form>
                      </TooltipTrigger$>

                      <TooltipContent$>
                        <p>Reset key</p>
                      </TooltipContent$>
                    </Tooltip$>
                  </TooltipProvider$>
                </div>
              </section>
            </Show>
          </section>
        </section>
      </main>
    </>
  )
}
