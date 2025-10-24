# Пошаговая настройка Supabase Storage

## 🚨 Ошибка 400 (Bad Request) - Решение

Если вы получаете ошибку `400 (Bad Request)` при загрузке файлов, выполните следующие шаги:

## Шаг 1: Проверка существующих buckets

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в **SQL Editor**
3. Выполните скрипт из файла `database/check-storage.sql`:

```sql
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
```

## Шаг 2: Создание bucket через Dashboard

Если bucket `dish-images` не существует:

1. Перейдите в раздел **Storage** в Supabase Dashboard
2. Нажмите **"New bucket"**
3. Заполните форму:
   - **Name**: `dish-images`
   - **Public bucket**: ✅ **Включено** (ОБЯЗАТЕЛЬНО!)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`
4. Нажмите **"Create bucket"**

## Шаг 3: Настройка политик безопасности

1. В разделе **Storage** найдите bucket `dish-images`
2. Перейдите на вкладку **"Policies"**
3. Нажмите **"New Policy"**

### Создайте 4 политики:

**Политика 1 - Публичное чтение:**
- **Policy name**: `Public read access`
- **Operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'dish-images'`

**Политика 2 - Загрузка файлов:**
- **Policy name**: `Public upload access`
- **Operation**: `INSERT`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'dish-images'`

**Политика 3 - Обновление файлов:**
- **Policy name**: `Public update access`
- **Operation**: `UPDATE`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'dish-images'`

**Политика 4 - Удаление файлов:**
- **Policy name**: `Public delete access`
- **Operation**: `DELETE`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'dish-images'`

## Шаг 4: Проверка настроек

После создания bucket и политик:

1. Выполните скрипт проверки снова
2. Убедитесь, что bucket `dish-images` существует и публичный
3. Проверьте, что созданы все 4 политики

## Шаг 5: Тестирование

1. Перезапустите приложение
2. Попробуйте загрузить изображение в редакторе
3. Проверьте консоль браузера на ошибки

## 🔧 Альтернативное решение

Если проблемы продолжаются, попробуйте создать bucket с другим именем:

1. Создайте bucket с именем `images` вместо `dish-images`
2. Обновите код в `lib/storage.ts`:

```typescript
// Измените строку:
.from('dish-images')
// На:
.from('images')
```

## 📋 Чек-лист

- [ ] Bucket `dish-images` создан
- [ ] Bucket публичный (public = true)
- [ ] Созданы 4 политики безопасности
- [ ] Все политики применяются к роли `public`
- [ ] Лимит файла: 5MB
- [ ] Разрешенные типы: JPEG, PNG, WebP
