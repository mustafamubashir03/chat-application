import axios from '@/config/axiosConfig'

export const getWorkspace = async ({ token }: { token: string }) => {
  try {

    const response = await axios.get('/workspace', {
      headers: {
        token,
      },
    })
    return response?.data
  } catch (error: any) {
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
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
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
        token,
      },
    })
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const deleteWorkspace = async ({
  workspaceId,
  token,
}: {
  workspaceId: string
  token: string
}) => {
  try {
    const response = await axios.delete(`/workspace/${workspaceId}`, {
      headers: {
        token,
      },
    })
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const updateWorkspaceDetails = async ({
  workspaceId,
  name,
  token,
}: {
  workspaceId: string
  name: string
  token: string
}) => {
  try {
    const response = await axios.put(
      `/workspace/${workspaceId}`,
      {
        name,
      },
      {
        headers: {
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const addChannelToWorkspace = async ({
  workspaceId,
  channelName,
  token,
}: {
  workspaceId: string
  channelName: string
  token: string
}) => {
  try {
    const response = await axios.post(
      `/workspace/${workspaceId}/channels`,
      {
        channelName,
      },
      {
        headers: {
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const addMemberToWorkspace = async ({
  workspaceId,
  memberId,
  role,
  token,
}: {
  workspaceId: string
  memberId: string
  role: string
  token: string
}) => {
  try {
    const response = await axios.post(
      `/workspace/${workspaceId}/members`,
      {
        memberId,
        role,
      },
      {
        headers: {
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}
export const joinWorkspace = async ({
  workspaceId,
  joinCode,
  token,
}: {
  workspaceId: string
  joinCode: string
  token: string
}) => {
  try {
    const response = await axios.post(
      `/workspace/${workspaceId}/join`,
      {
        joinCode,
      },
      {
        headers: {
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const resetJoinCode = async ({
  token,
  workspaceId,
}: {
  token: string
  workspaceId: string
}) => {
  try {
    const response = await axios.put(
      `/workspace/${workspaceId}/joinCode/reset`,
      {},
      {
        headers: {
          token,
        },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}
