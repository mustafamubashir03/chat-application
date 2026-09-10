import { getMessagesByChannelId } from '@/apis/channel'
import { useAuth } from '@/hooks/context/useAuth'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useGetMessagesByChannelId = ({
  channelId,
  page = 1,
}: {
  channelId: string
  page?: number
}) => {
  const { auth } = useAuth()
  const {
    data: messagesByChannelId,
    isFetching,
    isSuccess,
    error,
  } = useQuery({
    queryFn: () =>
      getMessagesByChannelId({ channelId, token: auth.token || '', page: String(page) }),
    queryKey: [`getMessagesByChannelId-${channelId}-${page}`],
    staleTime: 30000,
    placeholderData: keepPreviousData,
    enabled: !!channelId && !!auth?.token,
  })
  return {
    messagesByChannelId,
    isFetching,
    isSuccess,
    error,
  }
}