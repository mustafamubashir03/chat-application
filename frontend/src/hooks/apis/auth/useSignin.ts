import { signinRequest } from '@/apis/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useSignin = () => {
  const {
    isSuccess,
    isPending,
    error,
    mutateAsync: signinMutation,
  } = useMutation({
    mutationFn: signinRequest,
    onSuccess: (response: any) => {
      toast.success('You have signed in sucessfully.')
      localStorage.setItem("user",JSON.stringify(response.data))
      localStorage.setItem('token',JSON.stringify(response.data.token))
    },
    onError: (error: Error) => {
      toast.error('Error has occured while signing in. Please try again')
      console.log('Error occured', error)
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
