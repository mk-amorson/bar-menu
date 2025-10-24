import { useState, useEffect } from 'react'
import { DishWithCategory } from '@/types/dishes'

interface DishesByCategory {
  [categoryName: string]: {
    category: any
    dishes: DishWithCategory[]
  }
}

export function useDishes() {
  const [dishesByCategory, setDishesByCategory] = useState<DishesByCategory>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDishes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/dishes')
      if (response.ok) {
        const data = await response.json()
        setDishesByCategory(data.dishesByCategory || {})
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load dishes')
      }
    } catch (error) {
      console.error('Error loading dishes:', error)
      setError('Failed to load dishes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDishes()
  }, [])

  return {
    dishesByCategory,
    isLoading,
    error,
    loadDishes
  }
}
