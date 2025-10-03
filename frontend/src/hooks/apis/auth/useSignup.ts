import { useMutation } from '@tanstack/react-query'
import { signupRequest } from '@/apis/auth'
import { toast } from 'sonner'

export const useSignUp = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: signupMutation,
  } = useMutation({
    mutationFn: signupRequest,
    onSuccess: (data: any) => {
      toast.success('You have signed up sucessfully.')
      console.log('Successfully signed up', data)
    },
    onError: (error: Error) => {
      toast.error('Error has occured. Please try again')
      console.log('Error occured', error)
    },
  })

  return {
    isPending,
    isSuccess,
    error,
    signupMutation,
  }
}
