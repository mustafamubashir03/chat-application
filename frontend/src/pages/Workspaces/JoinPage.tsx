import { Button } from '@/components/ui/button'
import { useJoinWorkspace } from '@/hooks/apis/workspace/useJoinWorkspace'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VerificationInput from 'react-verification-input'

const JoinPage = () => {
  const { workspaceId } = useParams()
  const [joinCode, setJoinCode] = useState('')
  const navigate = useNavigate()
  const { joinWorkspaceMutation } = useJoinWorkspace({ workspaceId: workspaceId || '', joinCode })
  const handleChange = (value: string) => {
    setJoinCode(value)
  }
  const handleAddMemberToWorkspace = async () => {
    try {
      const response = await joinWorkspaceMutation()
      console.log(response)
      console.log('Member added')
      navigate(`/workspace/${response._id}`)
    } catch (e) {
      console.log('Error occured in workspace mutation')
    }
  }

  return (
    <div className="h-[100vh] flex flex-col gap-y-8 items-center justify-center p-8 rounded-lg shadow-sm">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-slate-300 text-3xl">Join Workspace</h1>
          <p className="text-slate-400 text-xl">
            Enter the code you recieved to join the workspace
          </p>
        </div>
        <VerificationInput
          onComplete={handleAddMemberToWorkspace}
          length={6}
          value={joinCode}
          onChange={handleChange}
          classNames={{
            container: 'flex gap-2',
            character:
              'h-auto rounded-md border border-slate-400 flex items-center justify-center text-lg font-medium focus:outline-nonde focus:border-blue-400 focus:ring-1 focus:ring-blue-400',
            characterInactive: 'bg-muted',
            characterFilled: 'bg-gray-600 text-blue-200',
            characterSelected: 'bg-black text-slate-300',
          }}
          autoFocus={true}
        />
      </div>

      <div className="flex gap-x-4">
        <Button
          className="outline-blue-300 outline-2 text-blue-300"
          variant={'outline'}
          size={'lg'}
        >
          <Link to={`/workspace/${workspaceId}`}>Back to the workspace</Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinPage
