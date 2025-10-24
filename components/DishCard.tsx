import { DishWithCategory } from '@/types/dishes'

interface DishCardProps {
  dish: DishWithCategory
}

export default function DishCard({ dish }: DishCardProps) {
  const hasImage = !!dish.image_url
  
  return (
    <div className={`bg-vintage-dark-gray rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-vintage-medium-gray hover:border-vintage-green ${hasImage ? 'h-full' : 'h-auto'}`}>
      {/* Фото блюда - показываем только если есть изображение */}
      {dish.image_url && (
        <div className="aspect-w-16 aspect-h-12 bg-gray-700">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Контент карточки */}
      <div className={`p-4 ${hasImage ? '' : 'py-3'}`}>
        {/* Заголовок с значком NEW */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-white font-bold leading-tight ${hasImage ? 'text-lg' : 'text-base'}`}>{dish.name}</h3>
          {dish.is_new && (
            <span className="bg-vintage-green text-white text-[10px] font-bold px-1.5 pt-0.5 rounded-full ml-2 flex-shrink-0 -mt-0.5">
              NEW
            </span>
          )}
        </div>

        {/* Описание */}
        {dish.description && (
          <p className={`text-gray-300 mb-3 line-clamp-3 ${hasImage ? 'text-sm' : 'text-xs'}`}>
            {dish.description}
          </p>
        )}

        {/* Цена */}
        <div className="flex items-center justify-between">
          <span className={`text-green-400 font-bold ${hasImage ? 'text-xl' : 'text-lg'}`}>
            {dish.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </div>
  )
}
