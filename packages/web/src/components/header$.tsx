import { PopoverPanel, Transition } from 'solid-headless'
import {
  Component,
  For,
  Show,
  createSignal,
  createEffect,
  createMemo
} from 'solid-js'
import { A, useLocation } from 'solid-start'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/menu$'
import { SiteName } from '~/lib/config'
import { cn } from '~/lib/utils'
import { User } from '~/routes'
import { Avatar$, AvatarFallback$, AvatarImage$ } from './avatar$'
import { CloseIcon, LogoIcon, UserIcon } from './icons$'

type Props = {
  user: User | undefined
}

export const Header: Component<Props> = (props) => {
  return (
    <header class="container z-40 bg-background">
      <div class="flex h-20 items-center justify-between py-6">
        <MainNav />
        <Show when={props.user} fallback={'Loading...'}>
          {(usr) => <UserAccountNav {...usr()} />}
        </Show>
      </div>
    </header>
  )
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/'
  }
]

const MainNav: Component = () => {
  const [showMobileMenu, setShowMobileMenu] = createSignal<boolean>(false)
  const location = useLocation()

  const menuIcon = createMemo(() => {
    if (showMobileMenu()) {
      return <CloseIcon class="h-5 w-5" />
    }

    return <LogoIcon class="h-5 w-5" />
  })

  return (
    <div class="flex gap-6 md:gap-10">
      <A href="/" class="hidden items-center space-x-2 md:flex">
        <span class="hidden font-bold sm:inline-block">{SiteName}</span>
      </A>
      <For each={navItems}>
        {(item) => (
          <nav class="hidden gap-6 md:flex">
            <A
              href={item.href}
              class={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                location.pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </A>
          </nav>
        )}
      </For>
      <button
        class="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu((prev) => !prev)}
      >
        {menuIcon()}
        <span class="font-bold">Menu</span>
      </button>

      <Show when={showMobileMenu()}>
        <MobileNav />
      </Show>
    </div>
  )
}

const MobileNav: Component = () => {
  return (
    <div
      class={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
      )}
    >
      <div class="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <A href="/" class="flex items-center space-x-2">
          <LogoIcon />
          <span class="font-bold">{SiteName}</span>
        </A>
        <nav class="grid grid-flow-row auto-rows-max text-sm">
          <For each={navItems}>
            {(item) => (
              <A
                href={item.href}
                class={cn(
                  'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline'
                )}
              >
                {item.title}
              </A>
            )}
          </For>
        </nav>
      </div>
    </div>
  )
}

const UserAvatar: Component<User> = (props) => (
  <Avatar$>
    <Show
      when={Boolean(props.profilePicture)}
      fallback={
        <>
          <AvatarFallback$>
            <span class="sr-only">{props.name}</span>
            <UserIcon class="h-4 w-4" />
          </AvatarFallback$>
        </>
      }
    >
      <AvatarImage$
        src={props.profilePicture!}
        alt={props.name ?? props.email}
      />
    </Show>
  </Avatar$>
)

const UserAccountNav: Component<User> = (props) => {
  return (
    <div class="">
      <DropdownMenu defaultOpen={false} class="relative">
        {({ isOpen }) => (
          <>
            <DropdownMenuTrigger>
              <UserAvatar {...props} />
            </DropdownMenuTrigger>

            <Transition
              show={isOpen()}
              enter="transition duration-200"
              enterFrom="opacity-0 -translate-y-1 scale-50"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="transition duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 -translate-y-1 scale-50"
            >
              <PopoverPanel
                unmount={false}
                class="absolute z-10 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl"
              >
                <DropdownMenuPanel>
                  <div class="flex items-center justify-start gap-2 p-2">
                    <div class="flex flex-col space-y-1 leading-none">
                      {props.name && <p class="font-medium">{props.name}</p>}
                      {props.email && (
                        <p class="w-[200px] truncate text-sm text-muted-foreground">
                          {props.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  <For each={navItems}>
                    {(item) => (
                      <DropdownMenuItem>
                        <A href={item.href}>{item.title}</A>
                      </DropdownMenuItem>
                    )}
                  </For>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuPanel>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </DropdownMenu>
    </div>
  )
}
