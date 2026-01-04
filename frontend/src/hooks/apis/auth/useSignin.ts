import { signinRequest } from '@/apis/auth'
import { useAuth } from '@/hooks/context/useAuth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useSignin = () => {
  const { setAuth } = useAuth()
  const {
    isSuccess,
    isPending,
    error,
    mutateAsync: signinMutation,
  } = useMutation({
    mutationFn: signinRequest,
    onSuccess: (response: any) => {
      toast.success('You have signed in sucessfully.')
      localStorage.setItem('user', JSON.stringify(response.data))
      localStorage.setItem('token', JSON.stringify(response.data.token))
      setAuth({
        user: response.data,
        token: response.data.token,
        isLoading: false,
      })
    },
    onError: () => {
      toast.error('Error has occured while signing in. Please try again')
    },
  })
  return {
    isPending,
    error,
    signinMutation,
    isSuccess,
  }
}

export default useSignin
