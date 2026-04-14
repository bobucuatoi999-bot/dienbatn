export const uploadToCloudinary = async (file: File): Promise<string> => { 
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME 
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET 
 
  const formData = new FormData() 
  formData.append('file', file) 
  formData.append('upload_preset', uploadPreset) 
  formData.append('folder', 'hong-bang-dich') 
 
  const response = await fetch( 
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
    { method: 'POST', body: formData } 
  ) 
 
  if (!response.ok) { 
    throw new Error('Tải ảnh lên Cloudinary thất bại') 
  } 
 
  const data = await response.json() 
  return data.secure_url // this is the permanent public image URL 
} 
