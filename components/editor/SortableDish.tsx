'use client'

import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DishWithCategory } from '@/types/dishes'
import SortableDishItem from './SortableDishItem'

interface SortableDishProps {
  dishes: DishWithCategory[]
  onDataChange: () => void
}

export default function SortableDish({ dishes, onDataChange }: SortableDishProps) {
  const [editingDish, setEditingDish] = useState<DishWithCategory | null>(null)


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
  )
}
