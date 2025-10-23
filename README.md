# TAP22

Веб-приложение с авторизацией через Telegram виджет, построенное на Next.js 14 и Supabase.

## Особенности

- ✅ Авторизация через Telegram виджет
- ✅ Сохранение данных пользователей в Supabase
- ✅ Защищенная страница дашборда
- ✅ Минималистичный интерфейс с фирменной иконкой TAP22
- ✅ Функциональность выхода

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Supabase** - база данных и аутентификация
- **Telegram Login Widget** - авторизация

## Структура проекта

```
├── app/
│   ├── api/auth/telegram/route.ts  # API для авторизации
│   ├── dashboard/page.tsx          # Защищенная страница
│   ├── globals.css                 # Глобальные стили
│   ├── layout.tsx                  # Корневой layout
│   └── page.tsx                    # Главная страница
├── lib/
│   └── supabase.ts                 # Клиент Supabase
├── package.json
└── README.md
```

## Настройка

1. **Клонируйте репозиторий**
2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения в `.env.local`:**
   ```bash
   # Supabase настройки
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Telegram бот
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
   ```
   
   **Важно:** Переменная `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` должна содержать имя вашего бота без символа `@` (например, `tap22login_bot`).

4. **Настройте базу данных в Supabase:**
   - Создайте таблицы `users` и `sessions`
   - Настройте политики безопасности

5. **Настройте Telegram бота:**
   - Создайте бота через @BotFather
   - Установите домен для виджета

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Использование

1. Откройте главную страницу
2. Нажмите на кнопку Telegram в правом верхнем углу
3. Авторизуйтесь через Telegram
4. После авторизации кнопка заменится на аватарку пользователя
5. Перейдите в дашборд для просмотра информации

## API

### POST /api/auth/telegram

Обрабатывает данные авторизации от Telegram виджета.

**Параметры:**
- `id` - ID пользователя Telegram
- `first_name` - имя
- `last_name` - фамилия (опционально)
- `username` - username (опционально)
- `photo_url` - URL аватарки (опционально)
- `auth_date` - дата авторизации
- `hash` - подпись для проверки

**Ответ:**
- `user` - данные пользователя
- `session` - данные сессии
- `success` - статус операции