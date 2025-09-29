import { useMutation } from '@tanstack/react-query'
import { signupRequest } from '@/apis/auth'

export const useSignUp = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutate: signupMutation,
  } = useMutation({
    mutationFn: signupRequest,
    onSuccess: (data: any) => {
      console.log('Successfully signed up', data)
    },
    onError: (error: Error) => {
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
