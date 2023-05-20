import { Component, For, Show, createMemo, createSignal } from 'solid-js'
import { A, useLocation } from 'solid-start'

import {
  DropdownMenu$,
  DropdownMenuContent$,
  DropdownMenuItem$,
  DropdownMenuSeparator$,
  DropdownMenuTrigger$
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
  const location = useLocation()

  return (
    <header class="bg-background z-40 px-6">
      <div class="flex items-center justify-between pt-4">
        <MainNav />
        <Show when={props.user} fallback={'Loading...'}>
          {(usr) => <UserAccountNav {...usr()} />}
        </Show>
      </div>

      <section class="flex flex-grow flex-shrink-0 items-center">
        <div class="flex">
          <For each={navItems}>
            {(elem) => (
              <A
                href={elem.disabled ? '#' : elem.href}
                class="relative inline-block px-4 py-3 outline-none cursor-pointer text-sm"
                classList={{
                  'text-primary border-b border-primary':
                    location.pathname === elem.href,
                  'text-muted-foreground': location.pathname !== elem.href,
                  'opacity-50 cursor-not-allowed': elem.disabled
                }}
              >
                {elem.title}
              </A>
            )}
          </For>
        </div>
      </section>
    </header>
  )
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    disabled: false
  }
]

const MainNav: Component = () => {
  const [showMobileMenu, setShowMobileMenu] = createSignal<boolean>(false)

  const menuIcon = createMemo(() => {
    if (showMobileMenu()) {
      return <CloseIcon class="h-5 w-5" />
    }

    return <LogoIcon class="h-5 w-5" />
  })

  return (
    <nav class="flex flex-col gap-4 items-center justify-start">
      <div class="flex gap-6 md:gap-10">
        <A href="/" class="hidden items-center space-x-2 md:flex">
          <span class="hidden font-bold sm:inline-block">{SiteName}</span>
        </A>
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
    </nav>
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
      <DropdownMenu$>
        <DropdownMenuTrigger$>
          <UserAvatar {...props} />
        </DropdownMenuTrigger$>

        <DropdownMenuContent$>
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
          <DropdownMenuSeparator$ />

          <For each={navItems}>
            {(item) => (
              <DropdownMenuItem$>
                <A class="w-full h-full" href={item.href}>
                  {item.title}
                </A>
              </DropdownMenuItem$>
            )}
          </For>
          <DropdownMenuSeparator$ />
          <DropdownMenuItem$>
            <button class="w-full h-full text-left">Sign Out</button>
          </DropdownMenuItem$>
        </DropdownMenuContent$>
      </DropdownMenu$>
    </div>
  )
}
