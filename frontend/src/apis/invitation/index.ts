import axios from '@/config/axiosConfig'

export const createInvitation = async ({
  workspaceId,
  token,
}: {
  workspaceId: string
  token: string
}) => {
  try {
    const response = await axios.post(
      '/invitations',
      { workspaceId },
      {
        headers: { token },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const getInvitationByToken = async ({
  inviteToken,
  token,
}: {
  inviteToken: string
  token: string
}) => {
  try {
    const response = await axios.get(`/invitations/${inviteToken}`, {
      headers: { token },
    })
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const acceptInvitation = async ({
  inviteToken,
  token,
}: {
  inviteToken: string
  token: string
}) => {
  try {
    const response = await axios.post(
      `/invitations/${inviteToken}/accept`,
      {},
      {
        headers: { token },
      },
    )
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}
