import axios from '@/config/axiosConfig'

export const getChannelWithWorkspaceDetails = async ({
  channelId,
  token,
}: {
  channelId: string
  token: string
}) => {
  try {
    const response = await axios.get(`/channel/${channelId}/workspaceDetails`, {
      headers: {
        token,
      },
    })
    console.log('axios api', response?.data)
    return response?.data
  } catch (error: any) {
    console.log('Error in getting channel details')
    throw error.response?.data
  }
}
export const getChannelById = async ({
  channelId,
  token,
}: {
  channelId: string
  token: string
}) => {
  try {
    const response = await axios.get(`/channel/${channelId}`, {
      headers: {
        token,
      },
    })
    return response?.data
  } catch (error: any) {
    console.log('Error in getting channel by id')
    throw error.response?.data
  }
}

export const getMessagesByChannelId = async ({
  channelId,
  token,
  limit,
  page,
}: {
  channelId: string
  token: string
  limit?: string
  page?: string
}) => {
  try {
    const response = await axios.get(`/messages/${channelId}`, {
      params: {
        limit: limit || 60,
        page: page || 0,
      },
      headers: {
        token,
      },
    })
    return response?.data
  } catch (error: any) {
    console.log('Error in getting messages by id')
    throw error.response?.data
  }
}
