-- Настройка Supabase Storage для загрузки изображений
-- Выполните этот скрипт в SQL Editor Supabase Dashboard

-- 1. Создание bucket (если еще не создан)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dish-images',
  'dish-images', 
  true,
  5242880, -- 5MB лимит
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Включение RLS для storage.objects (если еще не включен)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Удаление существующих политик (если есть)
DROP POLICY IF EXISTS "Public read access for dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete dish images" ON storage.objects;

-- 4. Создание новых политик
-- Политика для публичного чтения изображений
CREATE POLICY "Public read access for dish images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'dish-images');

-- Политика для загрузки изображений (для всех пользователей)
CREATE POLICY "Anyone can upload dish images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'dish-images');

-- Политика для обновления изображений (для всех пользователей)
CREATE POLICY "Anyone can update dish images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'dish-images');

-- Политика для удаления изображений (для всех пользователей)
CREATE POLICY "Anyone can delete dish images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'dish-images');

-- 5. Проверка настроек
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types 
FROM storage.buckets 
WHERE id = 'dish-images';
