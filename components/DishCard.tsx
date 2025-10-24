import { DishWithCategory } from '@/types/dishes'

interface DishCardProps {
  dish: DishWithCategory
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <div className="bg-vintage-dark-gray rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-vintage-medium-gray hover:border-vintage-green">
      {/* Фото блюда */}
      {dish.image_url ? (
        <div className="aspect-w-16 aspect-h-12 bg-gray-700">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-48 object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-vintage-medium-gray to-vintage-dark-gray flex items-center justify-center">
          <svg className="w-16 h-16 text-vintage-light-gray" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      )}

      {/* Контент карточки */}
      <div className="p-4">
        {/* Заголовок с значком NEW */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg leading-tight">{dish.name}</h3>
          {dish.is_new && (
            <span className="bg-vintage-green text-white text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
              NEW
            </span>
          )}
        </div>

        {/* Описание */}
        {dish.description && (
          <p className="text-vintage-light-gray text-sm mb-3 line-clamp-3">
            {dish.description}
          </p>
        )}

        {/* Цена */}
        <div className="flex items-center justify-between">
          <span className="text-vintage-green font-bold text-xl">
            {dish.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </div>
  )
}
