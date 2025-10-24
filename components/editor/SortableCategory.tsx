'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DishCategory, DishWithCategory } from '@/types/dishes'
import SortableDish from './SortableDish'

interface SortableCategoryProps {
  category: DishCategory
  dishes: DishWithCategory[]
  onDelete: (id: number) => void
  onDataChange: () => void
  onUpdateDishes: (updater: (dishes: DishWithCategory[]) => DishWithCategory[]) => void
}

export default function SortableCategory({ category, dishes, onDelete, onDataChange, onUpdateDishes }: SortableCategoryProps) {
  const [isAddingDish, setIsAddingDish] = useState(false)
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_new: false,
    is_available: true
  })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `category-${category.id}`
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const addDish = async () => {
    if (!newDish.name.trim() || !newDish.price.trim()) return

    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: category.id,
          name: newDish.name,
          description: newDish.description,
          price: parseFloat(newDish.price),
          image_url: newDish.image_url,
          is_new: newDish.is_new,
          is_available: newDish.is_available,
          sort_order: dishes.length
        })
      })

      if (response.ok) {
        setNewDish({
          name: '',
          description: '',
          price: '',
          image_url: '',
          is_new: false,
          is_available: true
        })
        setIsAddingDish(false)
        onDataChange()
      }
    } catch (error) {
      console.error('Error adding dish:', error)
    }
  }


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-vintage-charcoal rounded-lg border border-vintage-medium-gray hover:border-vintage-green transition-colors"
    >
      {/* Заголовок категории */}
      <div className="p-3 sm:p-4 border-b border-vintage-medium-gray">
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
            
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm sm:text-base">{category.name}</h3>
              {category.description && (
                <p className="text-vintage-light-gray text-xs sm:text-sm mt-1">{category.description}</p>
              )}
              <p className="text-vintage-light-gray text-xs mt-1">
                Блюд: {dishes.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddingDish(true)}
              className="bg-vintage-green hover:bg-vintage-green/80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
            >
              +
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1"
              title="Удалить категорию"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Список блюд */}
      <div className="p-3 sm:p-4">
        <SortableDish
          dishes={dishes}
          onDataChange={onDataChange}
        />

        {/* Форма добавления блюда */}
        {isAddingDish && (
          <div className="mt-3 p-3 bg-vintage-dark-gray rounded-lg">
            <div className="space-y-2 sm:space-y-3">
              <input
                type="text"
                placeholder="Название блюда"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
              />
              
              <textarea
                placeholder="Описание блюда"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                className="w-full bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none h-16 sm:h-20 resize-none text-xs sm:text-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Цена"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  className="bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
                />
                <input
                  type="url"
                  placeholder="URL фото"
                  value={newDish.image_url}
                  onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })}
                  className="bg-vintage-black text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <label className="flex items-center space-x-1 sm:space-x-2">
                  <input
                    type="checkbox"
                    checked={newDish.is_new}
                    onChange={(e) => setNewDish({ ...newDish, is_new: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-white text-xs sm:text-sm">NEW</span>
                </label>

                <label className="flex items-center space-x-1 sm:space-x-2">
                  <input
                    type="checkbox"
                    checked={newDish.is_available}
                    onChange={(e) => setNewDish({ ...newDish, is_available: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-white text-xs sm:text-sm">В наличии</span>
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={addDish}
                  className="bg-vintage-green hover:bg-vintage-green/80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded transition-colors text-xs sm:text-sm"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setIsAddingDish(false)
                    setNewDish({
                      name: '',
                      description: '',
                      price: '',
                      image_url: '',
                      is_new: false,
                      is_available: true
                    })
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded transition-colors text-xs sm:text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
