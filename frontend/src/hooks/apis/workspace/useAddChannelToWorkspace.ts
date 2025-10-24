import { addChannelToWorkspace } from "@/apis/workspace"
import { useAuth } from "@/hooks/context/useAuth"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAddChannelToWorkspace = ({workspaceId,channelName}:{workspaceId:string,channelName:string})=>{
    const {auth} = useAuth()
    const {mutateAsync:addChannelToWorkspaceMutation,isPending,error,isSuccess} = useMutation({
        mutationFn:()=>addChannelToWorkspace({workspaceId,channelName,token:auth?.token||""}),
        onError:(error)=>{
            toast.error("Error creating the Channel. Please try again later")
            console.log("error has occured",error)
        },
        onSuccess:(data)=>{
            toast.success("Channel has been added to the workspace")
            console.log(data)
        }
    })
    return(
        {
            addChannelToWorkspaceMutation,
            isPending,
            error,
            isSuccess
        }
    )

}