import {
  Menu,
  MenuItem,
  MenuItemProps,
  Popover,
  PopoverButton
} from 'solid-headless'
import { Component, JSX, splitProps } from 'solid-js'
import { cn } from '~/lib/utils'

export const DropdownMenu = Popover

export const DropdownMenuTrigger = PopoverButton

export const DropdownMenuPanel: Component<{ children: JSX.Element }> = (
  props
) => {
  return (
    <Menu class="z-50 min-w-max overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in">
      {props.children}
    </Menu>
  )
}
export const DropdownMenuSeparator: Component = () => (
  <div class="-mx-1 my-1 h-px bg-muted" aria-hidden="true"></div>
)

export const DropdownMenuItem = (props: MenuItemProps<'button'>) => {
  const [styleProps, cleanProps] = splitProps(props, ['class', 'classList'])

  return (
    <MenuItem
      as="button"
      class={cn(
        'relative w-full flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        styleProps.class,
        styleProps.classList
      )}
      {...cleanProps}
    >
      {cleanProps.children}
    </MenuItem>
  )
}
