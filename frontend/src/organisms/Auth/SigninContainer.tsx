import { useEffect, useState } from 'react'
import { SigninCard } from './SigninCard'
import useSignin from '@/hooks/apis/auth/useSignin'
import { useNavigate } from 'react-router-dom'

const SigninContainer = () => {
  const navigate = useNavigate()
  const [signinForm, setSigninForm] = useState({
    email: '',
    password: '',
  })
  const { isPending, isSuccess, error, signinMutation } = useSignin()
  const [validationError, setValidationError] = useState<String | null>()
  const onSigninFormSubmit = async (e: any) => {
    try {
      e.preventDefault()
      if (!signinForm.email || !signinForm.password) {
        console.log('All fields are required')
        setValidationError('Please fill all the input fields')
      }
      await signinMutation({
        email: signinForm.email,
        password: signinForm.password,
      })
    } catch (error: any) {
      setValidationError(error?.response?.data?.message || error?.message || 'Something went wrong')
    }
  }
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/home')
      }, 3000)
    }
  }, [isSuccess])
  return (
    <SigninCard
      signinForm={signinForm}
      setSigninForm={setSigninForm}
      onSigninFormSubmit={onSigninFormSubmit}
      isPending={isPending}
      isSuccess={isSuccess}
      error={error}
      validationError={validationError}
    />
  )
}

export default SigninContainer
