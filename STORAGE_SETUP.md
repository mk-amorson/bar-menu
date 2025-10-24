# Настройка Supabase Storage для загрузки изображений

## ⚠️ ВАЖНО: Исправление ошибки RLS

Если вы получаете ошибку `new row violates row-level security policy`, выполните SQL скрипт из файла `database/fix-storage-rls.sql` в SQL Editor Supabase.

## Шаги настройки:

### 1. Создание Bucket в Supabase Dashboard

1. Откройте ваш проект в [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в раздел **Storage**
3. Нажмите **"New bucket"**
4. Заполните форму:
   - **Name**: `dish-images`
   - **Public bucket**: ✅ Включено
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

### 2. Исправление политик безопасности (ОБЯЗАТЕЛЬНО!)

Выполните SQL скрипт из файла `database/fix-storage-rls.sql` в SQL Editor Supabase:

```sql
-- Создание bucket (если еще не создан)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dish-images',
  'dish-images', 
  true,
  5242880, -- 5MB лимит
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Включение RLS для storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Удаление существующих политик
DROP POLICY IF EXISTS "Public read access for dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update dish images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete dish images" ON storage.objects;

-- Создание новых политик
CREATE POLICY "Public read access for dish images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'dish-images');

CREATE POLICY "Anyone can upload dish images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Anyone can update dish images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'dish-images');

CREATE POLICY "Anyone can delete dish images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'dish-images');
```

### 3. Проверка работы

После настройки вы сможете:

- ✅ Загружать изображения файлами в редакторе блюд
- ✅ Видеть превью загруженных изображений
- ✅ Удалять изображения
- ✅ Вводить URL изображений вручную
- ✅ Автоматически получать публичные ссылки на загруженные файлы

### 4. Особенности реализации

- **Валидация файлов**: Проверка типа (JPEG, PNG, WebP) и размера (максимум 5MB)
- **Уникальные имена**: Автоматическая генерация уникальных имен файлов
- **Превью**: Мгновенное отображение превью перед загрузкой
- **Обработка ошибок**: Информативные сообщения об ошибках
- **Прогресс загрузки**: Индикатор процесса загрузки

### 5. Структура файлов

```
lib/
  storage.ts              # Утилиты для работы с Supabase Storage
components/editor/
  ImageUpload.tsx         # Компонент загрузки изображений
  SortableDishItem.tsx   # Обновленный компонент с интеграцией загрузки
database/
  fix-storage-rls.sql     # SQL скрипт для исправления RLS
  storage-setup.sql       # Первоначальный SQL скрипт для настройки Storage
```

## 🔧 Устранение неполадок

### Ошибка "new row violates row-level security policy"
- Выполните SQL скрипт `database/fix-storage-rls.sql`
- Убедитесь, что bucket `dish-images` создан и настроен правильно

### Ошибка "Failed to load resource: 400"
- Проверьте, что bucket существует в Supabase Storage
- Убедитесь, что политики безопасности настроены правильно
- Проверьте, что файл соответствует ограничениям (тип и размер)
