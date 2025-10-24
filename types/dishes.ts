export interface DishCategory {
  id: number
  name: string
  description?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Dish {
  id: number
  category_id: number
  name: string
  description?: string
  price: number
  image_url?: string
  is_new: boolean
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: DishCategory
}

export interface DishWithCategory extends Dish {
  category: DishCategory
}

export interface CreateDishData {
  category_id: number
  name: string
  description?: string
  price: number
  image_url?: string
  is_new?: boolean
  is_available?: boolean
}

export interface UpdateDishData {
  category_id?: number
  name?: string
  description?: string
  price?: number
  image_url?: string
  is_new?: boolean
  is_available?: boolean
  sort_order?: number
}

export interface CreateCategoryData {
  name: string
  description?: string
  sort_order?: number
}

export interface UpdateCategoryData {
  name?: string
  description?: string
  sort_order?: number
}
