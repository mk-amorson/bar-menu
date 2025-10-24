-- Упрощенный скрипт для настройки Supabase Storage
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

-- 2. Проверка настроек bucket
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types 
FROM storage.buckets 
WHERE id = 'dish-images';

-- 3. Проверка существующих политик
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
