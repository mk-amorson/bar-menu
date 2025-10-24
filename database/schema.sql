-- Создание таблицы категорий блюд
CREATE TABLE IF NOT EXISTS dish_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы блюд
CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES dish_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  is_new BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_dishes_category_id ON dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_dishes_is_available ON dishes(is_available);
CREATE INDEX IF NOT EXISTS idx_dishes_is_new ON dishes(is_new);
CREATE INDEX IF NOT EXISTS idx_dishes_sort_order ON dishes(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON dish_categories(sort_order);

-- Вставка тестовых данных
INSERT INTO dish_categories (name, description, sort_order) VALUES
('Основные блюда', 'Горячие блюда и гарниры', 1),
('Напитки', 'Холодные и горячие напитки', 2),
('Десерты', 'Сладкие блюда и выпечка', 3)
ON CONFLICT DO NOTHING;

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_dish_categories_updated_at BEFORE UPDATE ON dish_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
