import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - получение всех блюд с категориями
export async function GET() {
  try {
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
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch dishes', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ dishes })
  } catch (error) {
    console.error('GET dishes error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - создание нового блюда
export async function POST(request: NextRequest) {
  try {
    const { category_id, name, description, price, image_url, is_new, is_available, sort_order } = await request.json()

    if (!category_id || !name || !price) {
      return NextResponse.json({ error: 'Category ID, name and price are required' }, { status: 400 })
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
    }

    const { data: newDish, error } = await supabase
      .from('dishes')
      .insert({
        category_id: parseInt(category_id),
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        image_url: image_url?.trim() || null,
        is_new: Boolean(is_new),
        is_available: Boolean(is_available !== false), // по умолчанию true
        sort_order: sort_order || 0
      })
      .select(`
        *,
        category:category_id (
          id,
          name,
          description,
          sort_order
        )
      `)
      .single()

    if (error) {
      console.error('Error creating dish:', error)
      return NextResponse.json({ error: 'Failed to create dish' }, { status: 500 })
    }

    return NextResponse.json({ dish: newDish })
  } catch (error) {
    console.error('POST dish error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - обновление блюда
export async function PUT(request: NextRequest) {
  try {
    const { id, category_id, name, description, price, image_url, is_new, is_available, sort_order } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Dish ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (category_id !== undefined) updateData.category_id = parseInt(category_id)
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (price !== undefined) updateData.price = parseFloat(price)
    if (image_url !== undefined) updateData.image_url = image_url?.trim() || null
    if (is_new !== undefined) updateData.is_new = Boolean(is_new)
    if (is_available !== undefined) updateData.is_available = Boolean(is_available)
    if (sort_order !== undefined) updateData.sort_order = sort_order

    const { data: updatedDish, error } = await supabase
      .from('dishes')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:category_id (
          id,
          name,
          description,
          sort_order
        )
      `)
      .single()

    if (error) {
      console.error('Error updating dish:', error)
      return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 })
    }

    return NextResponse.json({ dish: updatedDish })
  } catch (error) {
    console.error('PUT dish error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - удаление блюда
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Dish ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting dish:', error)
      return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE dish error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
