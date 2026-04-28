import { uploadImageToCloudinary } from '@/apis/cloudinary'

export const quillImageHandler = (quill: any) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImageToCloudinary(file)

      const range = quill.getSelection(true)
      quill.insertEmbed(range.index, 'image', imageUrl)
      quill.setSelection(range.index + 1)
    } catch (err) {
      console.error('Image upload failed', err)
    }
  }
}
