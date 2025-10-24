import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - получение блюд с категориями
export async function GET() {
  try {
    // Получаем все доступные блюда с категориями
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select(`
        *,
        category:category_id (
          id,
          name,
          description,
          sort_order
        )
      `)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch dishes', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    // Группируем блюда по категориям
    const dishesByCategory = dishes?.reduce((acc, dish) => {
      const categoryName = dish.category?.name || 'Без категории'
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: dish.category,
          dishes: []
        }
      }
      acc[categoryName].dishes.push(dish)
      return acc
    }, {} as Record<string, { category: any, dishes: any[] }>)

    // Добавляем категорию NEW если есть новые блюда
    const newDishes = dishes?.filter(dish => dish.is_new) || []
    if (newDishes.length > 0) {
      dishesByCategory!['NEW'] = {
        category: { id: 'new', name: 'NEW', description: 'Новые блюда' },
        dishes: newDishes
      }
    }

    return NextResponse.json({ dishesByCategory })
  } catch (error) {
    console.error('GET dishes error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
