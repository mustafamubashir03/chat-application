import axios from 'axios'

export const getWorkspace = async ({ token }: { token: string }) => {
  try {
    const response = await axios.get('/workspace', {
      headers: {
        'x-access-token': token,
      },
    })
    console.log(response.data)
    return response?.data
  } catch (error: any) {
    console.log('Error in getting workspace')
    throw error.response?.data
  }
}

export const createWorkspace = async ({ name, description, token }: any) => {
  try {
    const response = await axios.post(
      '/workspace',
      {
        name,
        description,
      },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )
    console.log(response.data)
    return response?.data
  } catch (error: any) {
    console.log('Error in creating workspace')
    throw error.response?.data
  }
}
