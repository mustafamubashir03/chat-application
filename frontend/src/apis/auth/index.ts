import axios from '@/config/axiosConfig'
import { type UserSignInType, type UserSignUpType } from '@itz____mmm/common'

export const signupRequest = async ({ email, password, username }: UserSignUpType) => {
  try {
    const response = axios.post('/user/signup', {
      email,
      password,
      username,
    })
    return response
  } catch (error: any) {
    console.log(error)
    throw error.response.data
  }
}
export const signinRequest = async ({ email, password }: UserSignInType) => {
  try {
    const response = axios.post('/user/signin', {
      email,
      password,
    })
    return response
  } catch (error: any) {
    console.log(error)
    throw error.response.data
  }
}
