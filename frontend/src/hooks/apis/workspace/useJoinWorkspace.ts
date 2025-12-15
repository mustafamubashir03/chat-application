import { joinWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useJoinWorkspace = ({
  workspaceId,
  joinCode,
}: {
  workspaceId: string
  joinCode: string
}) => {
  const { auth } = useAuth()
  const {
    mutateAsync: joinWorkspaceMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: () => joinWorkspace({ workspaceId, joinCode, token: auth?.token || '' }),
    onError: (e: any) => {
      console.log('error has occured while adding member to workspace', e)
      toast.error('Error occured while joining workspace')
    },
    onSuccess: () => {
      console.log('Member has been added to the workspace')
      toast.success('You have successfully joined the workspace')
    },
  })

  return {
    joinWorkspaceMutation,
    isPending,
    isSuccess,
    error,
  }
}
