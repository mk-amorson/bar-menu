import { DishWithCategory } from '@/types/dishes'
import DishCard from '@/components/DishCard'

interface CategorySectionProps {
  categoryName: string
  category: any
  dishes: DishWithCategory[]
}

export default function CategorySection({ categoryName, category, dishes }: CategorySectionProps) {
  if (!dishes || dishes.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {/* Заголовок категории */}
      <div className="mb-4">
        <h2 className="text-white text-2xl font-bold mb-1">{categoryName}</h2>
        {category?.description && (
          <p className="text-vintage-light-gray text-sm">{category.description}</p>
        )}
      </div>

      {/* Сетка блюд */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  )
}
