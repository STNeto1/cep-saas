import { Tabs as KTabs } from '@kobalte/core'
import { Component } from 'solid-js'
import { cn } from '~/lib/utils'

export const Tabs$ = KTabs.Root

export const TabsList$: Component<KTabs.TabsListProps> = (props) => {
  return (
    <KTabs.List
      {...props}
      class={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        props.class,
        props.classList
      )}
    />
  )
}

export const TabsTrigger$: Component<KTabs.TabsTriggerProps> = (props) => {
  return (
    <KTabs.Trigger
      {...props}
      class={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.class,
        props.classList
      )}
    />
  )
}

export const TabsContent$: Component<KTabs.TabsContentProps> = (props) => {
  return (
    <KTabs.Content
      {...props}
      class={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class,
        props.classList
      )}
    />
  )
}
