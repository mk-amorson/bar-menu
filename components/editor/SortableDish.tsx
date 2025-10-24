'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DishWithCategory } from '@/types/dishes'
import SortableDishItem from './SortableDishItem'

interface SortableDishProps {
  dishes: DishWithCategory[]
  onDataChange: () => void
  onUpdateDishes: (updater: (dishes: DishWithCategory[]) => DishWithCategory[]) => void
}

export default function SortableDish({ dishes, onDataChange, onUpdateDishes }: SortableDishProps) {
  const [editingDish, setEditingDish] = useState<DishWithCategory | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = dishes.findIndex(dish => `dish-${dish.id}` === active.id)
      const newIndex = dishes.findIndex(dish => `dish-${dish.id}` === over.id)
      
      console.log('Moving dish within category:', { oldIndex, newIndex })
      const newOrder = arrayMove(dishes, oldIndex, newIndex)
      
      // Обновляем локальное состояние для мгновенной анимации
      onUpdateDishes((prevDishes: DishWithCategory[]) => {
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

        Promise.all(
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


  const updateDish = async (dish: DishWithCategory) => {
    try {
      const response = await fetch('/api/dishes/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dish.id,
          category_id: dish.category_id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image_url: dish.image_url,
          is_new: dish.is_new,
          is_available: dish.is_available
        })
      })

      if (response.ok) {
        setEditingDish(null)
        onDataChange()
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
        onDataChange()
      }
    } catch (error) {
      console.error('Error deleting dish:', error)
    }
  }


  if (dishes.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-vintage-light-gray text-sm">Нет блюд в этой категории</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={dishes.map(d => `dish-${d.id}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {dishes.map((dish) => (
            <SortableDishItem
              key={dish.id}
              dish={dish}
              isEditing={editingDish?.id === dish.id}
              onEdit={() => setEditingDish(dish)}
              onSave={updateDish}
              onCancel={() => setEditingDish(null)}
              onDelete={deleteDish}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
