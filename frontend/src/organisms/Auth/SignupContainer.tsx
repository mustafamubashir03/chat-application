import { useEffect, useState } from 'react'
import { SignupCard } from './SignupCard'
import { useSignUp } from '@/hooks/apis/auth/useSignup'
import { useNavigate } from 'react-router-dom'

const SignupContainer = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState<String | null>()
  const { isPending, isSuccess, error, signupMutation } = useSignUp()
  const navigate = useNavigate()
  async function onSignupFormSubmit(e: any) {
    try {
      setValidationError(null)
      e.preventDefault()
      if (
        !signupForm.email ||
        !signupForm.password ||
        !signupForm.confirmPassword ||
        !signupForm.username
      ) {
        setValidationError('All fields are required')
        return
      }
      if (signupForm.password !== signupForm.confirmPassword) {
        setValidationError('Passwords do not match')
        return
      }
      setValidationError(null)
      await signupMutation({
        email: signupForm.email,
        username: signupForm.username,
        password: signupForm.password,
      })
    } catch (error: any) {
      // Extract error message - prioritize error.message (from our Error object)
      const errorMessage =
        error?.message || error?.response?.data?.message || 'Something went wrong'
      setValidationError(errorMessage)
    }
  }
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/auth/signin')
      }, 3000)
    }
  }, [isSuccess])
  return (
    <div>
      <SignupCard
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        validationError={validationError}
        onSignupFormSubmit={onSignupFormSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
      />
    </div>
  )
}

export default SignupContainer
