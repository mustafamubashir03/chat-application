import { getChannelWithWorkspaceDetails } from '@/apis/channel'
import { useAuth } from '@/hooks/context/useAuth'
import { useQuery } from '@tanstack/react-query'

const useGetChannelWithWorkspaceDetails = ({ channelId }: { channelId: string }) => {
  const { auth } = useAuth()
  const {
    data: channelWithWorkspaceDetails,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryFn: () => getChannelWithWorkspaceDetails({ channelId, token: auth.token || '' }),
    queryKey: [`getChannelWithWorkspaceDetails-${channelId}`],
    staleTime: 30000,
  })
  return {
    channelWithWorkspaceDetails,
    isFetching,
    isSuccess,
    isError,
  }
}

export default useGetChannelWithWorkspaceDetails
