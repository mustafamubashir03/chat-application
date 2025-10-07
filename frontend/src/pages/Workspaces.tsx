import useGetWorkspace from '@/hooks/apis/workspace/useGetWorkspace'
import { useEffect } from 'react'

const Workspaces = () => {
  const { isFetching, workspaces } = useGetWorkspace()
  useEffect(() => {
    if (isFetching) {
      return
    }
    if (workspaces.length === 0 || !workspaces) {
      console.log('No workspaces found')
    }
  }, [workspaces, isFetching])
}

export default Workspaces
