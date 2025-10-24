'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DishCategory, DishWithCategory } from '@/types/dishes'
import SortableCategory from './SortableCategory'

interface CategoryManagerProps {
  onDataChange: () => void
}

export default function CategoryManager({ onDataChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [dishes, setDishes] = useState<DishWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [activeId, setActiveId] = useState<string | number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [categoriesRes, dishesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/dishes/admin')
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }

      if (dishesRes.ok) {
        const dishesData = await dishesRes.json()
        setDishes(dishesData.dishes || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
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
        loadData()
        onDataChange()
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
        loadData()
        onDataChange()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const updateCategoryOrder = async (newOrder: DishCategory[]) => {
    // Сначала обновляем локальное состояние для мгновенной анимации
    setCategories(newOrder)
    
    try {
      const updates = newOrder.map((category, index) => ({
        id: category.id,
        sort_order: index
      }))

      await Promise.all(
        updates.map(update =>
          fetch('/api/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
          })
        )
      )
    } catch (error) {
      console.error('Error updating category order:', error)
    }
  }

  const handleDragStart = (event: any) => {
    console.log('Drag start:', event.active.id)
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    console.log('Drag end:', { active: active.id, over: over?.id })
    
    setActiveId(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Если перетаскиваем категорию
    if (activeId.toString().startsWith('category-') && overId.toString().startsWith('category-')) {
      const activeCategoryId = parseInt(activeId.toString().replace('category-', ''))
      const overCategoryId = parseInt(overId.toString().replace('category-', ''))
      
      const oldIndex = categories.findIndex(category => category.id === activeCategoryId)
      const newIndex = categories.findIndex(category => category.id === overCategoryId)
      
      if (oldIndex !== newIndex) {
        console.log('Moving category:', { oldIndex, newIndex })
        const newOrder = arrayMove(categories, oldIndex, newIndex)
        updateCategoryOrder(newOrder)
      }
    }
    
    // Если перетаскиваем блюдо на категорию
    if (activeId.toString().startsWith('dish-') && overId.toString().startsWith('category-')) {
      const dishId = parseInt(activeId.toString().replace('dish-', ''))
      const categoryId = parseInt(overId.toString().replace('category-', ''))
      
      const dish = dishes.find(d => d.id === dishId)
      if (dish && dish.category_id !== categoryId) {
        console.log('Moving dish to category:', { dishId, categoryId })
        updateDishCategory(dishId, categoryId)
      }
    }
    
    // Если перетаскиваем блюдо на другое блюдо (внутри категории)
    if (activeId.toString().startsWith('dish-') && overId.toString().startsWith('dish-')) {
      const activeDishId = parseInt(activeId.toString().replace('dish-', ''))
      const overDishId = parseInt(overId.toString().replace('dish-', ''))
      
      const activeDish = dishes.find(d => d.id === activeDishId)
      const overDish = dishes.find(d => d.id === overDishId)
      
      if (activeDish && overDish && activeDish.category_id === overDish.category_id) {
        console.log('Moving dish within category:', { activeDishId, overDishId })
        updateDishOrderWithinCategory(activeDish.category_id, activeDishId, overDishId)
      }
    }
  }

  const updateDishCategory = async (dishId: number, categoryId: number) => {
    // Сначала обновляем локальное состояние для мгновенной анимации
    setDishes(prevDishes => 
      prevDishes.map(dish => 
        dish.id === dishId ? { ...dish, category_id: categoryId } : dish
      )
    )
    
    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dishId,
          category_id: categoryId
        })
      })

      if (response.ok) {
        // Не вызываем onDataChange() чтобы избежать перезагрузки
      }
    } catch (error) {
      console.error('Error updating dish category:', error)
    }
  }

  const updateDishOrderWithinCategory = async (categoryId: number, activeDishId: number, overDishId: number) => {
    // Получаем все блюда этой категории с правильной сортировкой
    const categoryDishes = dishes
      .filter(dish => dish.category_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order)
    
    // Находим индексы
    const activeIndex = categoryDishes.findIndex(dish => dish.id === activeDishId)
    const overIndex = categoryDishes.findIndex(dish => dish.id === overDishId)
    
    if (activeIndex !== overIndex) {
      // Создаем новый порядок
      const newOrder = arrayMove(categoryDishes, activeIndex, overIndex)
      
      // Обновляем локальное состояние для мгновенной анимации
      setDishes(prevDishes => {
        const updatedDishes = [...prevDishes]
        newOrder.forEach((dish, index) => {
          const dishIndex = updatedDishes.findIndex(d => d.id === dish.id)
          if (dishIndex !== -1) {
            updatedDishes[dishIndex] = { ...updatedDishes[dishIndex], sort_order: index }
          }
        })
        return updatedDishes
      })
      
      // Сохраняем в базе данных
      try {
        const updates = newOrder.map((dish, index) => ({
          id: dish.id,
          sort_order: index
        }))

        await Promise.all(
          updates.map(update =>
            fetch('/api/dishes/admin', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update)
            })
          )
        )
      } catch (error) {
        console.error('Error updating dish order:', error)
      }
    }
  }

  const getDishesForCategory = (categoryId: number) => {
    return dishes
      .filter(dish => dish.category_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="bg-vintage-dark-gray rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-white text-lg sm:text-xl font-bold">Категории</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-vintage-green hover:bg-vintage-green/80 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          Добавить категорию
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-green mx-auto"></div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={[...categories.map(c => `category-${c.id}`), ...dishes.map(d => `dish-${d.id}`)]} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {categories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  dishes={getDishesForCategory(category.id)}
                  onDelete={deleteCategory}
                  onDataChange={onDataChange}
                  onUpdateDishes={setDishes}
                />
              ))}

              {isAdding && (
                <div className="bg-vintage-charcoal p-3 sm:p-4 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Название категории"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Описание (необязательно)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full bg-vintage-dark-gray text-white px-3 py-2 rounded-lg border border-vintage-medium-gray focus:border-vintage-green focus:outline-none text-sm sm:text-base"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={addCategory}
                        className="bg-vintage-green hover:bg-vintage-green/80 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => {
                          setIsAdding(false)
                          setNewCategory({ name: '', description: '' })
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}