import axios from 'axios'

export const uploadImageToCloudinary = async (image: File) => {
  try {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME)
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    )
    return res.data.secure_url
  } catch (error: any) {
    throw error.response?.data
  }
}
