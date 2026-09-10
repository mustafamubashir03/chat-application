import axios from '@/config/axiosConfig'

export const createMeetingInvite = async ({
  workspaceId,
  token,
}: {
  workspaceId: string
  token: string
}) => {
  try {
    const response = await axios.post(
      '/meetings/invite',
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

export const getMeetingInviteByToken = async ({
  meetingToken,
  token,
}: {
  meetingToken: string
  token: string
}) => {
  try {
    const response = await axios.get(`/meetings/${meetingToken}`, {
      headers: { token },
    })
    return response?.data
  } catch (error: any) {
    throw error.response?.data
  }
}