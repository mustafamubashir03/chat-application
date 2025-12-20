import axios from '@/config/axiosConfig'
import { type UserSignInType, type UserSignUpType } from '@itz____mmm/common'

export const signupRequest = async ({ email, password, username }: UserSignUpType) => {
  try {
    const response = await axios.post('/user/signup', {
      email,
      password,
      username,
    })
    console.log(response.data)
    return response.data
  } catch (error: any) {
    // Extract error message from backend response
    const errorData = error.response?.data
    const errorMessage =
      errorData?.message || errorData?.err || error.message || 'An error occurred'
    throw new Error(errorMessage)
  }
}
export const signinRequest = async ({ email, password }: UserSignInType) => {
  try {
    const response = await axios.post('/user/signin', {
      email,
      password,
    })
    console.log(response.data)
    return response
  } catch (error: any) {
    throw error.response?.data || error.message
  }
}
