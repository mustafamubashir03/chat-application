import { Button } from '@/components/ui/button'
import useCreateChannelModal from '@/hooks/apis/channel/useCreateChannelModal'
import { ChevronDown, PlusIcon } from 'lucide-react'

const WorkspacePanelSection = ({
  children,
  label,
  openState,
  setOpenState,
}: {
  children: React.ReactNode
  label: string
  openState: boolean
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { setOpenCreateChannelModal } = useCreateChannelModal()
  return (
    <div className="flex flex-col mt-2 px-2">
      <div
        onClick={() => setOpenState(!openState)}
        className="flex items-center px-2 group cursor-pointer transition-all"
      >
        <Button
          variant="transparent"
          size="sm"
          className="p-1 text-slate-400 hover:text-slate-300 transition-colors"
        >
          <ChevronDown
            className={`size-4 transition-transform ${openState ? 'rotate-0' : '-rotate-90'}`}
          />
        </Button>
        <div className="flex items-center justify-between flex-1 px-2 py-1">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            {label}
          </span>
          {openState && (
            <Button
              onClick={() => setOpenCreateChannelModal(true)}
              variant="transparent"
              size="sm"
              className="opacity-90 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-blue-400"
            >
              <PlusIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {openState && <div className="ml-4">{children}</div>}
    </div>
  )
}

export default WorkspacePanelSection
