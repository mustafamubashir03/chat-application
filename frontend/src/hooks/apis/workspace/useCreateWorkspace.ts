import { createWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useCreateWorkspace = () => {
  const { auth } = useAuth()
  const {
    mutateAsync: createWorkspaceMutation,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: Object) => createWorkspace({ ...data, token: auth?.token }),
    onError: () => {
      toast.error('Error occurred while creating workspace')

    },
    onSuccess: () => {
      toast.success('Workspace have been created')
    },
  })
  return {
    isPending,
    isSuccess,
    createWorkspaceMutation,
    error,
  }
}

export default useCreateWorkspace
