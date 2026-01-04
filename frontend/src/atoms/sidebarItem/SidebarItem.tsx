import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { cva } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const sidebarItemVariants = cva(
  'flex items-center justify-start rounded-sm gap-1.5 font-normal h-7 px-[20px] text-sm overflow-hidden  border-none hover:border-none',
  {
    variants: {
      variant: {
        default: 'text-slate-300 cursor-pointer',
        active: 'text-blue-300 bg-blue-950/80 hover:bg-blue-900/80 cursor-pointer',
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
  id,
  variant,
}: {
  label: string
  Icon: LucideIcon
  id?: string
  variant: 'default' | 'active'
}) => {
  const { workspaceId } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const handleItemChange = () => {
    queryClient.invalidateQueries({ queryKey: [`getMessagesByChannelId-${id}`] })
    navigate(`/workspace/${workspaceId}/channels/${id}`)
  }

  return (
    <Button
      onClick={handleItemChange}
      className={cn(sidebarItemVariants({ variant }))}
      variant={'transparent'}
      size={'sm'}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon className="size-3.5 mr-1" />
        <span className="text-md">{label}</span>
      </div>
    </Button>
  )
}

export default SidebarItem
