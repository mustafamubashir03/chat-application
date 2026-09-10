import axios from 'axios'

const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME)
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData,
    )
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data
    }
    throw error
  }
}

export const uploadImageToCloudinary = async (image: File) => {
  const data = await uploadToCloudinary(image, 'image')
  return data.secure_url
}

export const uploadAudioToCloudinary = async (audio: File) => {
  const data = await uploadToCloudinary(audio, 'video')
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}