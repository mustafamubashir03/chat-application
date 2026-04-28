import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

import { Link } from 'react-router-dom'

const userItemVariatns = cva(
  'flex outline-none border-none hover:border-none items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow:hidden',
  {
    variants: {
      variant: {
        default: 'text-[f9edffcc]',
        active: 'text-[481350] bg-white/90 hover:bg-white/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const UserItem = ({
  id,
  label = 'User',
  variant = 'default',
  image,
}: {
  id?: string
  label: string
  variant?: 'default' | 'active'
  image: string
}) => {
  const { currentWorkspace } = useCurrentWorkspace()
  return (
    <Button
      asChild
      className={`${cn(userItemVariatns({ variant }))} my-3`}
      variant={'transparent'}
      size={'sm'}
    >
      <Link
        className="flex gap-2 items-center justify-center"
        to={`/workspace/${currentWorkspace._id}/members/${id}`}
      >
        <Avatar className="hover:opacity-60 transition-opacity border-2 border-[var(--primary-end)]">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>{label}</span>
      </Link>
    </Button>
  )
}

export default UserItem
