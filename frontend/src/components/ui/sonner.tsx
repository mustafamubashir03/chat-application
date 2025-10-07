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
            'bg-card text-slate-800 border rounded-xl shadow-sm',
            'flex items-start gap-3 p-4 transition-all duration-300',
          ),
          title: 'font-semibold',
          description: 'text-sm text-slate-700',
          actionButton:
            'bg-primary text-slate-800 hover:bg-primary/90 rounded-md px-3 py-1 text-sm font-medium',
          cancelButton:
            'bg-muted text-slate-800 hover:bg-muted/80 rounded-md px-3 py-1 text-sm font-medium',
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
