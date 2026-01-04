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
    onSuccess: () => {
      toast.success('You have signed up sucessfully.')
    },
    onError: (error: Error) => {
      // Display the specific error message from the backend
      const errorMessage = error.message || 'An error occurred. Please try again'
      toast.error(errorMessage)
    },
  })

  return {
    isPending,
    isSuccess,
    error,
    signupMutation,
  }
}
