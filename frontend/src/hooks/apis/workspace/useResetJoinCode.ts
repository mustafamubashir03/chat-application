import { resetJoinCode } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useResetJoinCode = ({ workspaceId }: { workspaceId: string }) => {
  const { auth } = useAuth()
  const {
    mutateAsync: resetJoinCodeMutatation,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => resetJoinCode({ token: auth?.token || '', workspaceId }),
    onSuccess: () => {
      toast.success('Join code has been reset')
    },
    onError: () => {
      toast.error('Error resetting join code')
    },
  })
  return {
    resetJoinCodeMutatation,
    error,
    isPending,
  }
}
