import axios from '@/config/axiosConfig'

export const getWorkspace = async ({ token }: { token: string }) => {
  try {
    console.log('token', token)
    const response = await axios.get('/workspace', {
      headers: {
        token: token,
      },
    })
    console.log('Data from axios', response?.data)
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
          token: token,
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

export const getWorkspaceDetails = async ({
  workspaceId,
  token,
}: {
  workspaceId: string
  token: string
}) => {
  try {
    const response = await axios.get(`/workspace/${workspaceId}`, {
      headers: {
        token: token,
      },
    })
    return response?.data
  } catch (error: any) {
    console.log('Error in getting Workspace details')
    throw error.response?.data
  }
}
