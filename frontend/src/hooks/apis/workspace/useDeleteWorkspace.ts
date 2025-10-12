import { deleteWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  const { auth } = useAuth()
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: deleteWorkspaceMutation,
  } = useMutation({
    mutationFn: () => deleteWorkspace({ workspaceId, token: auth?.token || '' }),
    onError: (error: any) => {
      toast.error('Error has occured while deleting your workspace')
      console.log(error)
    },
    onSuccess: (data) => {
      toast.success('Workspace have been deleted successfully')
      console.log(data)
    },
  })
  return {
    deleteWorkspaceMutation,
    isPending,
    isSuccess,
    error,
  }
}
