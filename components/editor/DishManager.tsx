'use client'

import { useState, useEffect } from 'react'
import { DishWithCategory, DishCategory } from '@/types/dishes'

interface DishManagerProps {
  onDishChange: () => void
}

export default function DishManager({ onDishChange }: DishManagerProps) {
  const [dishes, setDishes] = useState<DishWithCategory[]>([])
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingDish, setEditingDish] = useState<DishWithCategory | null>(null)
  const [newDish, setNewDish] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_new: false,
    is_available: true
  })

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [dishesRes, categoriesRes] = await Promise.all([
        fetch('/api/dishes/admin'),
        fetch('/api/categories')
      ])

      if (dishesRes.ok) {
        const dishesData = await dishesRes.json()
        setDishes(dishesData.dishes || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addDish = async () => {
    if (!newDish.category_id || !newDish.name || !newDish.price) return

    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDish,
          price: parseFloat(newDish.price),
          category_id: parseInt(newDish.category_id)
        })
      })

      if (response.ok) {
        setNewDish({
          category_id: '',
          name: '',
          description: '',
          price: '',
          image_url: '',
          is_new: false,
          is_available: true
        })
        setIsAdding(false)
        loadData()
        onDishChange()
      }
    } catch (error) {
      console.error('Error adding dish:', error)
    }
  }

  const updateDish = async () => {
    if (!editingDish) return

    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDish.id,
          category_id: editingDish.category_id,
          name: editingDish.name,
          description: editingDish.description,
          price: editingDish.price,
          image_url: editingDish.image_url,
          is_new: editingDish.is_new,
          is_available: editingDish.is_available
        })
      })

      if (response.ok) {
        setEditingDish(null)
        loadData()
        onDishChange()
      }
    } catch (error) {
      console.error('Error updating dish:', error)
    }
  }

  const deleteDish = async (id: number) => {
    if (!confirm('Удалить блюдо?')) return

    try {
      const response = await fetch(`/api/dishes/admin?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadData()
        onDishChange()
      }
    } catch (error) {
      console.error('Error deleting dish:', error)
    }
  }

  const toggleDishStatus = async (dish: DishWithCategory, field: 'is_new' | 'is_available') => {
    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dish.id,
          [field]: !dish[field]
        })
      })

      if (response.ok) {
        loadData()
        onDishChange()
      }
    } catch (error) {
      console.error('Error updating dish status:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="bg-vintage-dark-gray rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Блюда</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-vintage-green hover:bg-vintage-green/80 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Добавить блюдо
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-green mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {dishes.map((dish) => (
            <div key={dish.id} className="bg-vintage-charcoal p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-medium">{dish.name}</h3>
                    {dish.is_new && (
                      <span className="bg-vintage-green text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {!dish.is_available && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        НЕТ В НАЛИЧИИ
                      </span>
                    )}
                  </div>
                  <p className="text-vintage-light-gray text-sm mb-1">
                    {dish.category?.name} • {dish.price.toLocaleString('ru-RU')} ₽
                  </p>
                  {dish.description && (
                    <p className="text-vintage-light-gray text-sm">{dish.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleDishStatus(dish, 'is_new')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      dish.is_new 
                        ? 'bg-vintage-green text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    NEW
                  </button>
                  <button
                    onClick={() => toggleDishStatus(dish, 'is_available')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      dish.is_available 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {dish.is_available ? 'В наличии' : 'Нет в наличии'}
                  </button>
                  <button
                    onClick={() => setEditingDish(dish)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => deleteDish(dish.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Форма добавления блюда */}
          {(isAdding || editingDish) && (
            <div className="bg-vintage-charcoal p-4 rounded-lg">
              <div className="space-y-3">
                <select
                  value={editingDish ? editingDish.category_id : newDish.category_id}
                  onChange={(e) => {
                    if (editingDish) {
                      setEditingDish({ ...editingDish, category_id: parseInt(e.target.value) })
                    } else {
                      setNewDish({ ...newDish, category_id: e.target.value })
                    }
                  }}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Название блюда"
                  value={editingDish ? editingDish.name : newDish.name}
                  onChange={(e) => {
                    if (editingDish) {
                      setEditingDish({ ...editingDish, name: e.target.value })
                    } else {
                      setNewDish({ ...newDish, name: e.target.value })
                    }
                  }}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                />

                <textarea
                  placeholder="Описание блюда"
                  value={editingDish ? editingDish.description || '' : newDish.description}
                  onChange={(e) => {
                    if (editingDish) {
                      setEditingDish({ ...editingDish, description: e.target.value })
                    } else {
                      setNewDish({ ...newDish, description: e.target.value })
                    }
                  }}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none h-20 resize-none"
                />

                <input
                  type="number"
                  placeholder="Цена"
                  value={editingDish ? editingDish.price : newDish.price}
                  onChange={(e) => {
                    if (editingDish) {
                      setEditingDish({ ...editingDish, price: parseFloat(e.target.value) })
                    } else {
                      setNewDish({ ...newDish, price: e.target.value })
                    }
                  }}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                />

                <input
                  type="url"
                  placeholder="URL фотографии (необязательно)"
                  value={editingDish ? editingDish.image_url || '' : newDish.image_url}
                  onChange={(e) => {
                    if (editingDish) {
                      setEditingDish({ ...editingDish, image_url: e.target.value })
                    } else {
                      setNewDish({ ...newDish, image_url: e.target.value })
                    }
                  }}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                />

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingDish ? editingDish.is_new : newDish.is_new}
                      onChange={(e) => {
                        if (editingDish) {
                          setEditingDish({ ...editingDish, is_new: e.target.checked })
                        } else {
                          setNewDish({ ...newDish, is_new: e.target.checked })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-white text-sm">Новое блюдо</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingDish ? editingDish.is_available : newDish.is_available}
                      onChange={(e) => {
                        if (editingDish) {
                          setEditingDish({ ...editingDish, is_available: e.target.checked })
                        } else {
                          setNewDish({ ...newDish, is_available: e.target.checked })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-white text-sm">В наличии</span>
                  </label>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={editingDish ? updateDish : addDish}
                    className="bg-vintage-green hover:bg-vintage-green/80 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {editingDish ? 'Сохранить' : 'Добавить'}
                  </button>
                  <button
                    onClick={() => {
                      if (editingDish) {
                        setEditingDish(null)
                      } else {
                        setIsAdding(false)
                        setNewDish({
                          category_id: '',
                          name: '',
                          description: '',
                          price: '',
                          image_url: '',
                          is_new: false,
                          is_available: true
                        })
                      }
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
