-- Исправление политик для анонимных пользователей
-- Выполните этот скрипт в SQL Editor Supabase

-- Удаляем старые политики, которые требуют аутентификации
DROP POLICY IF EXISTS "Authenticated users can upload dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete dish images" ON storage.objects;

-- Создаем новые политики для анонимных пользователей
CREATE POLICY "Anonymous users can upload dish images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Anonymous users can update dish images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'dish-images');

CREATE POLICY "Anonymous users can delete dish images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'dish-images');

-- Проверяем результат
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
AND policyname LIKE '%dish images%'
ORDER BY cmd;
