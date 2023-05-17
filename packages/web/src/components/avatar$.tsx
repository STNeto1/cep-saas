import { Component, JSX, splitProps } from 'solid-js'
import { cn } from '~/lib/utils'

export const Avatar$: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
  props
) => {
  const [styleProps, cleanProps] = splitProps(props, ['class'])

  return (
    <span
      class={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
        styleProps.class
      )}
      {...cleanProps}
    />
  )
}

export const AvatarImage$: Component<
  JSX.ImgHTMLAttributes<HTMLImageElement>
> = (props) => {
  const [styleProps, cleanProps] = splitProps(props, ['class'])

  return (
    <img
      class={cn('aspect-square h-full w-full', styleProps.class)}
      {...cleanProps}
    />
  )
}

export const AvatarFallback$: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
  props
) => {
  const [styleProps, cleanProps] = splitProps(props, ['class'])

  return (
    <span
      class={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        styleProps.class
      )}
      {...cleanProps}
    />
  )
}
