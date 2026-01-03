import axios from "axios"

export const uploadImageToCloudinary = async (image: File) => {
    try{
        const formData = new FormData()
        formData.append('file',image)
        formData.append('upload_preset','chat-application')
        const res = await axios.post('https://api.cloudinary.com/v1_1/djfyqwzs9/image/upload',formData)
        return res.data.secure_url

    }catch(error:any){
        throw error.response?.data
    }
    
} 