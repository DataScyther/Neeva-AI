import { supabase } from './client'

// Storage helper functions
export const uploadFile = async (file: File, bucket: string, path?: string) => {
  const filePath = path || `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)
    
  return { data, error }
}

export const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)
    
  return { data, error }
}

export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path])
    
  return { data, error }
}

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    
  return data.publicUrl
}