import { getWorkspace } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useQuery } from '@tanstack/react-query'

const useGetWorkspace = () => {
  const { auth } = useAuth()
  const { isFetching, isSuccess, data } = useQuery({
    queryFn: () => getWorkspace({ token: auth?.token || '' }),
    queryKey: ['getWorkspace'],
    staleTime: 30000,
  })
  return {
    isFetching,
    isSuccess,
    data,
  }
}

export default useGetWorkspace
