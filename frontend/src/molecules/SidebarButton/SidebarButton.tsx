import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

const SidebarButton = ({
  Icon,
  Label,
  onClick,
  active = false,
}: {
  Icon: LucideIcon
  Label: string
  onClick?: () => void
  active?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer gap-y-0.5 group"
    >
      <Button
        className={`size-9 p-2 transition-all rounded-lg ${
          active
            ? 'bg-white/20 text-white'
            : 'hover:bg-white/10 text-slate-300 hover:text-white'
        }`}
        variant={'transparent'}
      >
        <Icon className={'size-5 transition-all group-hover:scale-110'} />
      </Button>
      <span
        className={`text-[10px] transition-colors ${
          active ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
        }`}
      >
        {Label}
      </span>
    </div>
  )
}

export default SidebarButton
