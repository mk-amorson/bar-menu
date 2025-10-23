# TAP22 - Telegram Auth Platform

Современное веб-приложение с авторизацией через Telegram и системой чатов.

## 🚀 Особенности

- **Telegram авторизация** - быстрый вход через Telegram виджет
- **Адаптивный дизайн** - работает на всех устройствах
- **Плавные анимации** - профессиональные переходы между страницами
- **Система ролей** - поддержка администраторов и модераторов
- **Реальное время** - мгновенные сообщения в чате

## 🛠 Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **Supabase** - база данных и аутентификация
- **Telegram Bot API** - авторизация через Telegram

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd tap22
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env.local
```

4. Запустите проект:
```bash
npm run dev
```

## 🔧 Переменные окружения

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

## 📁 Структура проекта

```
tap22/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── chat/              # Страница чата
│   ├── layout.tsx         # Главный layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── chat/              # Компоненты чата
│   ├── sidebar/           # Компоненты бокового меню
│   ├── ui/                # UI компоненты
│   ├── Navbar.tsx         # Навигационная панель
│   └── Sidebar.tsx        # Боковое меню
├── hooks/                 # Custom React hooks
├── lib/                   # Утилиты и конфигурация
├── types/                 # TypeScript типы
└── public/                # Статические файлы
```

## 🎨 Дизайн-система

Проект использует современную дизайн-систему с:
- **Vintage цветовая палитра** - темная тема с акцентами
- **Плавные анимации** - 300ms переходы
- **Адаптивная сетка** - flexbox и grid
- **Иконки** - SVG иконки с поворотами

Подробнее в [DESIGN.md](./DESIGN.md)

## 🏗 Архитектура

Подробное описание архитектуры в [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Деплой

```bash
npm run build
npm start
```

## 📝 Лицензия

MIT License