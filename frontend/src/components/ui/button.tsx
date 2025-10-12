import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none   aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          'px-6 py-3 rounded-[8px] font-medium text-white bg-gradient-to-r from-[var(--primary-start)] via-[var(--primary-mid)] to-[var(--primary-end)] shadow-md transition duration-300 hover:shadow-lg cursor-pointer',
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 ',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        transparent:
          'bg-transparent text-slate-300 hover:bg-foreground/5 dark:hover:bg-foreground/10 border border-transparent hover:border-border transition-all',
        darkBlue: 'bg-blue-950/30 text-blue-300 hover:bg-blue-900 active:bg-blue-800/30 shadow-sm',
        indigoGlow:
          'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 active:bg-indigo-800/40 shadow-sm border border-indigo-800/40',
        BlueDark:
          'bg-blue-950 delay-0.2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ease-in-out hover:bg-blue-700 hover:text-blue-100 hover:rounded-full transition-all   cursor-pointer rounded-xl text-blue-400  shadow-sm',
        delete:
          'px-6 py-3 rounded-[8px] font-medium bg-red-800/40 text-red-300  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-red-900/50 active:scale-[0.98] cursor-pointer',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
