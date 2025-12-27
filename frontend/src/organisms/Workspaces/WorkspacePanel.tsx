import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import {
  HashIcon,
  Loader2,
  MessageSquareTextIcon,
  SendHorizonalIcon,
  TriangleAlert,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import WorkspacePanelHeader from './WorkspacePanelHeader'
import SidebarItem from '@/atoms/sidebarItem/SidebarItem'
import WorkspacePanelSection from './WorkspacePanelSection'
import { useOpenWorkspacePanelSection } from '@/hooks/context/useOpenWorkspacePanelSection'
import { useState } from 'react'
import UserItem from '@/molecules/UserItem/UserItem'

const WorkspacePanel = () => {
  const { workspaceId } = useParams()
  const { openChannelPanelSection, setOpenChannelPanelSection } = useOpenWorkspacePanelSection()
  const [openPersonalState, setOpenPersonalState] = useState<boolean>(false)
  const [openMembersState, setOpenMembersState] = useState<boolean>(false)
  const { workspaceDetails, isPending, isSuccess } = useGetWorkspaceById({
    workspaceId: workspaceId || '',
  })
  console.log(workspaceDetails)
  if (isPending) {
    return (
      <div>
        <Loader2 className="animate-spin size-6 text-slate-400" />
      </div>
    )
  }
  if (!isSuccess) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center text-red-300">
        <TriangleAlert className="text-red-400" />
      </div>
    )
  }
  if (isSuccess) {
    return (
      <div className="text-slate-300 flex flex-col h-full">
        <WorkspacePanelHeader workspace={workspaceDetails} />
        <WorkspacePanelSection
          label="Personal"
          openState={openPersonalState}
          setOpenState={setOpenPersonalState}
        >
          <SidebarItem
            key="Threads"
            label={'Threads'}
            Icon={MessageSquareTextIcon}
            variant="default"
          />
          <SidebarItem
            key="Drafs & Sends"
            label={'Drafts & Sends'}
            Icon={SendHorizonalIcon}
            variant="default"
          />
        </WorkspacePanelSection>
        <WorkspacePanelSection
          label="Channels"
          openState={openChannelPanelSection}
          setOpenState={setOpenChannelPanelSection}
        >
          {workspaceDetails?.channels?.map((channel: any) => (
            <SidebarItem
              key={channel._id}
              id={channel._id}
              label={channel.name}
              Icon={HashIcon}
              variant="default"
            />
          ))}
        </WorkspacePanelSection>
        <WorkspacePanelSection
          label="Direct Messages"
          openState={openMembersState}
          setOpenState={setOpenMembersState}
        >
          {workspaceDetails?.members && workspaceDetails.members.length > 0 ? (
            workspaceDetails.members.map((member: any) => {
              if (member.role !== 'admin') {
                return (
                  <UserItem
                    key={member.memberId._id}
                    id={member.memberId._id}
                    image={member.memberId.avatar}
                    label={member.memberId.username}
                  />
                )
              }
              return null
            })
          ) : (
            <div className="text-slate-300">No members</div>
          )}
        </WorkspacePanelSection>
      </div>
    )
  }
}

export default WorkspacePanel
