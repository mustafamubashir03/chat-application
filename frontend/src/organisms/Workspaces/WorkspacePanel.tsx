import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useParams } from 'react-router-dom'
import WorkspacePanelHeader from './WorkspacePanelHeader'

const WorkspacePanel = () => {
  const { workspaceId } = useParams()
  const { workspaceDetails, isPending, isSuccess } = useGetWorkspaceById({
    workspaceId: workspaceId || '',
  })
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
      </div>
    )
  }
}

export default WorkspacePanel
