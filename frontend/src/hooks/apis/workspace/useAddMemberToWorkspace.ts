import { addMemberToWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'

export const useAddMemberToWorkspace = ({
  workspaceId,
  memberId,
  role,
}: {
  workspaceId: string
  memberId: string
  role: string
}) => {
  const { auth } = useAuth()
  const {
    mutateAsync: addMemberToWorkspaceMutation,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: () =>
      addMemberToWorkspace({ workspaceId, memberId, role, token: auth?.token || '' }),
    onError: (e: any) => {
      console.log('error has occured while adding member to workspace', e)
    },
    onSuccess: () => {
      console.log('Member has been added to the workspace')
    },
  })

  return {
    addMemberToWorkspaceMutation,
    isPending,
    isSuccess,
    error,
  }
}
