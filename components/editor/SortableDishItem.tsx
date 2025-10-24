'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DishWithCategory } from '@/types/dishes'
import { uploadImage, validateImageFile } from '@/lib/storage'

interface SortableDishItemProps {
  dish: DishWithCategory
  isEditing: boolean
  onEdit: () => void
  onSave: (dish: DishWithCategory) => void
  onCancel: () => void
  onDelete: (id: number) => void
}

export default function SortableDishItem({ 
  dish, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete
}: SortableDishItemProps) {
  const [editData, setEditData] = useState({
    name: dish.name,
    description: dish.description || '',
    price: dish.price.toString(),
    image_url: dish.image_url || '',
    is_new: dish.is_new,
    is_available: dish.is_available
  })
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(dish.image_url || null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `dish-${dish.id}`
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const handleSave = () => {
    const updatedDish = {
      ...dish,
      name: editData.name,
      description: editData.description,
      price: parseFloat(editData.price),
      image_url: editData.image_url,
      is_new: editData.is_new,
      is_available: editData.is_available
    }
    onSave(updatedDish)
  }

  const handleFileUpload = async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      alert(validation.error || 'Ошибка валидации файла')
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
        setEditData({ ...editData, image_url: uploadedUrl })
        setPreviewUrl(uploadedUrl)
      } else {
        alert('Ошибка загрузки файла')
        setPreviewUrl(editData.image_url || null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Ошибка загрузки файла')
      setPreviewUrl(editData.image_url || null)
    } finally {
      setIsUploading(false)
    }
  }

  const borderColor = dish.is_available ? 'border-green-500' : 'border-red-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-vintage-dark-gray rounded-lg border-2 ${borderColor} p-2 sm:p-3 transition-all hover:shadow-lg`}
    >
      {isEditing ? (
        // Режим редактирования
        <div className="space-y-2 sm:space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
          />
          
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none h-16 sm:h-20 resize-none text-xs sm:text-sm"
          />

          <div className="grid grid-cols-1 gap-2">
            <input
              type="number"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              className="bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
              placeholder="Цена"
            />
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
                    onClick={() => {
                      setPreviewUrl(null)
                      setEditData({ ...editData, image_url: '' })
                    }}
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
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file)
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
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
                      <span>Загрузить фото</span>
                    </>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="Или введите URL изображения"
                    value={editData.image_url}
                    onChange={(e) => {
                      setEditData({ ...editData, image_url: e.target.value })
                      setPreviewUrl(e.target.value || null)
                    }}
                    className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <label className="flex items-center space-x-1 sm:space-x-2">
              <input
                type="checkbox"
                checked={editData.is_new}
                onChange={(e) => setEditData({ ...editData, is_new: e.target.checked })}
                className="rounded"
              />
              <span className="text-white text-xs sm:text-sm">NEW</span>
            </label>

            <label className="flex items-center space-x-1 sm:space-x-2">
              <input
                type="checkbox"
                checked={editData.is_available}
                onChange={(e) => setEditData({ ...editData, is_available: e.target.checked })}
                className="rounded"
              />
              <span className="text-white text-xs sm:text-sm">В наличии</span>
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-vintage-green hover:bg-vintage-green/80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded transition-colors text-xs sm:text-sm"
            >
              Сохранить
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded transition-colors text-xs sm:text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        // Режим просмотра
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Полоски для перетаскивания */}
            <div 
              className="flex flex-col space-y-1 cursor-grab active:cursor-grabbing select-none"
              {...attributes}
              {...listeners}
            >
              <div className="w-1 h-1 bg-vintage-light-gray rounded-full"></div>
              <div className="w-1 h-1 bg-vintage-light-gray rounded-full"></div>
              <div className="w-1 h-1 bg-vintage-light-gray rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-2">
                <h4 
                  className="text-white font-medium text-sm sm:text-base truncate cursor-help" 
                  title={dish.name.length > 30 ? dish.name : undefined}
                >
                  {dish.name}
                </h4>
                {dish.is_new && (
                  <span className="bg-vintage-green text-white text-[8px] sm:text-[9px] px-1 pt-0.5 rounded-full whitespace-nowrap -mt-0.5 sm:-mt-0.5">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-vintage-light-gray text-xs sm:text-sm truncate">
                {dish.price.toLocaleString('ru-RU')} ₽
              </p>
              {dish.description && (
                <p 
                  className="text-vintage-light-gray text-xs truncate cursor-help" 
                  title={dish.description.length > 25 ? dish.description : undefined}
                >
                  {dish.description.length > 25 ? `${dish.description.substring(0, 25)}...` : dish.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
            <button
              onClick={onEdit}
              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
              title="Редактировать"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={() => onDelete(dish.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1"
              title="Удалить"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
