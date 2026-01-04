import { updateWorkspaceDetails } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useUpdateWorkspace = ({
  workspaceId,
  name,
}: {
  workspaceId: string
  name: string
}) => {
  const { auth } = useAuth()
  const {
    mutateAsync: updateWorkspaceDetailsMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: () => updateWorkspaceDetails({ workspaceId, name, token: auth?.token || '' }),
    onSuccess: () => {
      toast.success('Workspace Details updated successfully')

    },
    onError: () => {
      toast.error('Error occured while updating workspace')

    },
  })
  return {
    updateWorkspaceDetailsMutation,
    isPending,
    isSuccess,
    error,
  }
}
