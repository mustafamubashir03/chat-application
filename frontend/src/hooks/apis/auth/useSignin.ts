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
    onSuccess: (data: any) => {
      toast.success('You have signed in sucessfully.')
      console.log('Successfully signed up', data)
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
