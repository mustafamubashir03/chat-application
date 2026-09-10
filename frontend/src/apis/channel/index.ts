import axios from '@/config/axiosConfig'

const getErrorData = (error: unknown) =>
  error &&
  typeof error === 'object' &&
  'response' in error &&
  error.response &&
  typeof error.response === 'object' &&
  'data' in error.response
    ? (error.response as { data?: unknown }).data
    : undefined

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

    return response?.data
  } catch (error: unknown) {
    throw getErrorData(error)
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
  } catch (error: unknown) {
    throw getErrorData(error)
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
        limit: limit || '60',
        page: page || '1',
      },
      headers: {
        token,
      },
    })
    return response?.data
  } catch (error: unknown) {
    throw getErrorData(error)
  }
}
