import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/lib/utils'

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={cn('toaster group', className)}
      toastOptions={{
        classNames: {
          toast: cn(
            'bg-card text-card-foreground border rounded-xl shadow-sm',
            'flex items-start gap-3 p-4 transition-all duration-300'
          ),
          title: 'font-semibold',
          description: 'text-sm text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm font-medium',
          cancelButton:
            'bg-muted text-muted-foreground hover:bg-muted/80 rounded-md px-3 py-1 text-sm font-medium',
        },
      }}
      position="top-right"
      richColors
      closeButton
      duration={5000}
      {...props}
    />
  )
}

export { Toaster }
