import { getWorkspaceDetails } from '@/apis/workspace'
import { useAuth } from '@/hooks/context/useAuth'
import { useQuery } from '@tanstack/react-query'

export const useGetWorkspaceById = ({ workspaceId }: { workspaceId: string }) => {
  const { auth } = useAuth()
  const { isPending, isSuccess, error, data } = useQuery({
    queryFn: () => getWorkspaceDetails({ workspaceId, token: auth?.token || '' }),
    queryKey: [`getWorkspaceDetails-${workspaceId}`],
    staleTime: 15000,
  })
  return {
    isPending,
    error,
    isSuccess,
    workspaceDetails: data,
  }
}
