import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

const SidebarButton = ({ Icon, Label }: { Icon: LucideIcon; Label: string }) => {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer gap-y-0.1">
      <Button className={'size9 p-2 group-hover:text-slate-100'} variant={'transparent'}>
        <Icon className={'size-5 text-slate-300 group-hover:scale-110 transition-all'} />
      </Button>
      <span className="text-[10px] text-slate-400 group-hover:text-slate-200">{Label}</span>
    </div>
  )
}

export default SidebarButton
