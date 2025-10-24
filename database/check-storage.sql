-- Проверка существования bucket dish-images
-- Выполните этот скрипт в SQL Editor Supabase

-- Проверяем существующие buckets
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
ORDER BY created_at DESC;

-- Проверяем политики для storage.objects
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
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
