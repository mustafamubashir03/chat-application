import UserIcon from '@/atoms/userIcon/UserIcon'
import useGetWorkspace from '@/hooks/apis/workspace/useGetWorkspace'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { isFetching, workspaces } = useGetWorkspace()
  const navigate = useNavigate()
  useEffect(() => {
    if (isFetching) {
      return
    }
    if (workspaces?.length === 0 || !workspaces) {
      console.log('No workspaces found')
    } else {
      navigate(`/workspace/${workspaces[0]._id}`)
    }
  }, [workspaces, isFetching, navigate])
  return (
    <div>
      <UserIcon />
    </div>
  )
}

export default Home
