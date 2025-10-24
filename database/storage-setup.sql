-- Создание bucket для изображений блюд в Supabase Storage
-- Этот скрипт нужно выполнить в Supabase Dashboard -> Storage

-- Создание bucket 'dish-images' с публичным доступом
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dish-images',
  'dish-images', 
  true,
  5242880, -- 5MB лимит
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Политика для публичного чтения изображений
CREATE POLICY "Public read access for dish images" ON storage.objects
FOR SELECT USING (bucket_id = 'dish-images');

-- Политика для загрузки изображений (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can upload dish images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'dish-images' 
  AND auth.role() = 'authenticated'
);

-- Политика для обновления изображений (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can update dish images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'dish-images' 
  AND auth.role() = 'authenticated'
);

-- Политика для удаления изображений (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can delete dish images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'dish-images' 
  AND auth.role() = 'authenticated'
);
