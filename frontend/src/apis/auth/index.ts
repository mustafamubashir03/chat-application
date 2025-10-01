import axios from '@/config/axiosConfig'
import { type UserSignInType, type UserSignUpType } from '@itz____mmm/common'

export const signupRequest = async ({ email, password, username }: UserSignUpType) => {
  try {
    const response = await axios.post('/user/signup', {
      email,
      password,
      username,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}
export const signinRequest = async ({ email, password }: UserSignInType) => {
  try {
    const response = await axios.post('/user/signin', {
      email,
      password,
    })
    return response
  } catch (error: any) {
    throw error.response?.data || error.message

  }
}
