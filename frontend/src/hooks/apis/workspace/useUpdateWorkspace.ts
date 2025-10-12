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
    onSuccess: (data) => {
      toast.success('Workspace Details updated successfully')
      console.log(data)
    },
    onError: (error) => {
      toast.error('Error occured while updating workspace')
      console.log(error)
    },
  })
  return {
    updateWorkspaceDetailsMutation,
    isPending,
    isSuccess,
    error,
  }
}
