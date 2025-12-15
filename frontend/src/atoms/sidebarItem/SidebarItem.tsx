import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const sidebarItemVariants = cva(
  'flex items-center justify-start rounded-sm gap-1.5 font-normal h-7 px-[20px] text-sm overflow-hidden  border-none hover:border-none',
  {
    variants: {
      variant: {
        default: 'text-slate-300',
        active: 'text-blue-300 bg-blue-950/80 hover:bg-blue-900/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const SidebarItem = ({
  label,
  Icon,
  variant,
}: {
  label: string
  Icon: LucideIcon
  variant: 'default' | 'active'
}) => {
  const { workspaceId } = useParams()
  const { channelId } = useParams()

  return (
    <Button className={cn(sidebarItemVariants({ variant }))} variant={'transparent'} size={'sm'}>
      <Link
        className="flex items-center justify-center gap-2"
        to={`/workspace/${workspaceId}/channels/${channelId}`}
      >
        <Icon className="size-3.5 mr-1" />
        <span className="text-md">{label}</span>
      </Link>
    </Button>
  )
}

export default SidebarItem
