import { createWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'

const useCreateWorkspace = () => {
  const { auth } = useAuth()
  const {
    mutateAsync: createWorkspaceMutation,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: Object) => createWorkspace({ ...data, token: auth?.token }),
    onError: (error) => console.log(error),
    onSuccess: (data) => console.log(data),
  })
  return {
    isPending,
    isSuccess,
    createWorkspaceMutation,
    error,
  }
}

export default useCreateWorkspace
