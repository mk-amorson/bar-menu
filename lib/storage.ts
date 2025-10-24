import { supabase } from './supabase'

// Функция для загрузки изображения в Supabase Storage
export async function uploadImage(file: File): Promise<string | null> {
  try {
    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    console.log('Uploading file:', fileName, 'to bucket: dish-images')
    
    // Загружаем файл в bucket 'dish-images'
    const { data, error } = await supabase.storage
      .from('dish-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      })
      return null
    }

    console.log('Upload successful:', data)

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('dish-images')
      .getPublicUrl(fileName)

    console.log('Public URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

// Функция для удаления изображения из Storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Извлекаем имя файла из URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    
    const { error } = await supabase.storage
      .from('dish-images')
      .remove([fileName])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

// Функция для проверки валидности изображения
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Проверяем тип файла
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Поддерживаются только файлы: JPEG, PNG, WebP' }
  }

  // Проверяем размер файла (максимум 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'Размер файла не должен превышать 5MB' }
  }

  return { isValid: true }
}
