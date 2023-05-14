import { buttonVariants } from '~/components/button$'
import { cn } from '~/lib/utils'

export default function Login() {
  return (
    <main class="min-h-screen">
      <div class="container flex h-screen w-screen flex-col items-center justify-center">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">
              Bem Vindo de Volta
            </h1>
          </div>

          <div class={cn('grid gap-6')}>
            <div class="grid gap-2">
              <a
                href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}
                class={cn(buttonVariants({ variant: 'outline' }))}
              >
                Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
