import { updateWorkspaceDetails } from '@/apis/workspace'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useUpdateWorkspace = () => {
  const {
    mutateAsync: updateWorkspaceDetailsMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: updateWorkspaceDetails,
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
