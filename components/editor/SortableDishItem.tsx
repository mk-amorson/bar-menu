'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DishWithCategory } from '@/types/dishes'

interface SortableDishItemProps {
  dish: DishWithCategory
  isEditing: boolean
  onEdit: () => void
  onSave: (dish: DishWithCategory) => void
  onCancel: () => void
  onDelete: (id: number) => void
  onToggleStatus: (dish: DishWithCategory, field: 'is_new' | 'is_available') => void
}

export default function SortableDishItem({ 
  dish, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onToggleStatus 
}: SortableDishItemProps) {
  const [editData, setEditData] = useState({
    name: dish.name,
    description: dish.description || '',
    price: dish.price.toString(),
    image_url: dish.image_url || '',
    is_new: dish.is_new,
    is_available: dish.is_available
  })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dish.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  const borderColor = dish.is_available ? 'border-green-500' : 'border-red-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-vintage-dark-gray rounded-lg border-2 ${borderColor} p-2 sm:p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg`}
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

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              className="bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
            />
            <input
              type="url"
              value={editData.image_url}
              onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
              className="bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
            />
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-white font-medium text-sm sm:text-base truncate">{dish.name}</h4>
              {dish.is_new && (
                <span className="bg-vintage-green text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                  NEW
                </span>
              )}
            </div>
            <p className="text-vintage-light-gray text-xs sm:text-sm truncate">
              {dish.price.toLocaleString('ru-RU')} ₽
            </p>
            {dish.description && (
              <p className="text-vintage-light-gray text-xs truncate">{dish.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
            <button
              onClick={() => onToggleStatus(dish, 'is_new')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                dish.is_new 
                  ? 'bg-vintage-green text-white' 
                  : 'bg-gray-600 text-gray-300'
              }`}
              title="Переключить NEW"
            >
              NEW
            </button>
            
            <button
              onClick={() => onToggleStatus(dish, 'is_available')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                dish.is_available 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}
              title="Переключить наличие"
            >
              {dish.is_available ? 'В наличии' : 'Нет'}
            </button>
            
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
