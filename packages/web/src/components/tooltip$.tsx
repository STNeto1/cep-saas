import { Tooltip as KTooltip } from '@kobalte/core'
import { Component } from 'solid-js'
import { cn } from '~/lib/utils'

export const TooltipProvider$ = KTooltip.Root

export const Tooltip$ = KTooltip.Root

export const TooltipTrigger$ = KTooltip.Trigger

export const TooltipContent$: Component<KTooltip.TooltipContentProps> = (
  props
) => (
  <KTooltip.Content
    class={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      props.class,
      props.classList
    )}
    {...props}
  />
)
