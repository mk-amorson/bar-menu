'use client'

import { useState, useRef } from 'react'
import { uploadImage, validateImageFile } from '@/lib/storage'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (url: string) => void
  onError?: (error: string) => void
}

export default function ImageUpload({ currentImageUrl, onImageChange, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Валидация файла
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      onError?.(validation.error || 'Ошибка валидации файла')
      return
    }

    setIsUploading(true)

    try {
      // Создаем превью
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Загружаем файл
      const uploadedUrl = await uploadImage(file)
      
      if (uploadedUrl) {
        onImageChange(uploadedUrl)
      } else {
        onError?.('Ошибка загрузки файла')
        setPreviewUrl(currentImageUrl || null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      onError?.('Ошибка загрузки файла')
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-white text-xs sm:text-sm font-medium">
        Изображение блюда
      </label>
      
      {/* Превью изображения */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Превью"
            className="w-full h-24 object-cover rounded border border-vintage-medium-gray"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            disabled={isUploading}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Кнопка загрузки */}
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-vintage-green hover:bg-vintage-green/80 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors text-xs sm:text-sm flex items-center space-x-2"
        >
          {isUploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Загрузка...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{previewUrl ? 'Изменить' : 'Загрузить'}</span>
            </>
          )}
        </button>

        {/* Поле для ввода URL вручную */}
        <div className="flex-1">
          <input
            type="url"
            placeholder="Или введите URL изображения"
            value={currentImageUrl || ''}
            onChange={(e) => {
              setPreviewUrl(e.target.value || null)
              onImageChange(e.target.value)
            }}
            className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  )
}
