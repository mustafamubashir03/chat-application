import { getMessagesByChannelId } from '@/apis/channel'
import { useAuth } from '@/hooks/context/useAuth'
import { useQuery } from '@tanstack/react-query'

export const useGetMessagesByChannelId = ({ channelId }: { channelId: string }) => {
  const { auth } = useAuth()
  const {
    data: messagesByChannelId,
    isFetching,
    isSuccess,
    error,
  } = useQuery({
    queryFn: () => getMessagesByChannelId({ channelId, token: auth.token || '' }),
    queryKey: [`getMessagesByChannelId-${channelId}`],
    staleTime: 30000,  
  })
  console.log('messages', messagesByChannelId)
  return {
    messagesByChannelId,
    isFetching,
    isSuccess,
    error,
  }
}
