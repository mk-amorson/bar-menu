'use client'

import { useState, useEffect } from 'react'
import { DishCategory } from '@/types/dishes'

interface CategoryManagerProps {
  onCategoryChange: () => void
}

export default function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.name.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          sort_order: categories.length
        })
      })

      if (response.ok) {
        setNewCategory({ name: '', description: '' })
        setIsAdding(false)
        loadCategories()
        onCategoryChange()
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Удалить категорию? Все блюда в этой категории также будут удалены.')) return

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadCategories()
        onCategoryChange()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="bg-vintage-dark-gray rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Категории</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-vintage-green hover:bg-vintage-green/80 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Добавить категорию
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-green mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between bg-vintage-charcoal p-3 rounded-lg">
              <div>
                <h3 className="text-white font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-vintage-light-gray text-sm">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Удалить
              </button>
            </div>
          ))}

          {isAdding && (
            <div className="bg-vintage-charcoal p-4 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Название категории"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Описание (необязательно)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addCategory}
                    className="bg-vintage-green hover:bg-vintage-green/80 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false)
                      setNewCategory({ name: '', description: '' })
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
