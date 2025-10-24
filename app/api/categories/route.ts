import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - получение всех категорий
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('dish_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch categories', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('GET categories error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - создание новой категории
export async function POST(request: NextRequest) {
  try {
    const { name, description, sort_order } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const { data: newCategory, error } = await supabase
      .from('dish_categories')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        sort_order: sort_order || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    return NextResponse.json({ category: newCategory })
  } catch (error) {
    console.error('POST category error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - обновление категории
export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, sort_order } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (sort_order !== undefined) updateData.sort_order = sort_order

    const { data: updatedCategory, error } = await supabase
      .from('dish_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    console.error('PUT category error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - удаление категории
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('dish_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE category error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
