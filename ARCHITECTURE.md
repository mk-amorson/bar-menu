# TAP22 Architecture

## 🏗 Общая архитектура

TAP22 построен на современном стеке Next.js 14 с App Router, используя TypeScript для типизации и Tailwind CSS для стилизации.

## 📁 Структура проекта

```
tap22/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/telegram/ # Telegram авторизация
│   │   └── chat/messages/ # Чат API
│   ├── chat/              # Страница чата
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Главный layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── chat/              # Компоненты чата
│   │   ├── MessageInput.tsx
│   │   └── MessageItem.tsx
│   ├── sidebar/           # Компоненты бокового меню
│   │   ├── ChatButton.tsx
│   │   ├── MenuButton.tsx
│   │   ├── TelegramWidget.tsx
│   │   └── UserProfile.tsx
│   ├── ui/                # Переиспользуемые UI компоненты
│   │   └── UserAvatar.tsx
│   ├── Navbar.tsx         # Навигационная панель
│   ├── PageTransition.tsx # Анимации переходов
│   ├── Sidebar.tsx        # Боковое меню
│   └── StatusDisplay.tsx  # Отображение статуса
├── hooks/                 # Custom React hooks
│   └── useChat.ts         # Логика чата
├── lib/                   # Утилиты и конфигурация
│   ├── navbar-context.tsx # Контекст навигации
│   ├── supabase.ts        # Supabase клиент
│   └── user-context.tsx   # Контекст пользователя
├── types/                 # TypeScript типы
│   └── chat.ts            # Типы чата
└── public/                # Статические файлы
    ├── tap_logo_icon.jpg
    ├── tap_logo_small.jpg
    └── tap_logo_website.jpg
```

## 🔄 Управление состоянием

### Context API
Проект использует React Context для глобального состояния:

#### NavbarContext
```typescript
interface NavbarContextType {
  navbarState: 'home' | 'chat'
  setNavbarState: (state: 'home' | 'chat') => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  isPageTransitioning: boolean
  setIsPageTransitioning: (transitioning: boolean) => void
  sidebarContentState: 'home' | 'chat'
  setSidebarContentState: (state: 'home' | 'chat') => void
}
```

#### UserContext
```typescript
interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
}
```

## 🎨 Система компонентов

### Компонентная архитектура
- **Атомарные компоненты** - базовые UI элементы (UserAvatar)
- **Молекулярные компоненты** - составные элементы (MessageItem)
- **Организменные компоненты** - сложные блоки (Navbar, Sidebar)
- **Шаблонные компоненты** - страницы (page.tsx)

### Принципы компонентов
- **Единственная ответственность** - каждый компонент решает одну задачу
- **Переиспользуемость** - компоненты можно использовать в разных местах
- **Типизация** - все компоненты типизированы через TypeScript
- **Адаптивность** - компоненты работают на всех устройствах

## 🚀 Навигация и роутинг

### App Router (Next.js 14)
- **Файловая система** - роуты определяются структурой папок
- **Server Components** - рендеринг на сервере по умолчанию
- **Client Components** - интерактивные компоненты с 'use client'

### Навигационная логика
- **Программная навигация** - через router.push()
- **Контекстная навигация** - состояние навбара синхронизируется с роутом
- **Анимированные переходы** - плавные переходы между страницами

## 🎭 Система анимаций

### PageTransition
Центральный компонент для анимаций переходов:
```typescript
interface PageTransitionProps {
  children: React.ReactNode
}
```

### Анимационная логика
1. **Fade-out** текущего контента (300ms)
2. **Переход** на новую страницу
3. **Fade-in** нового контента (300ms)

### Синхронизация анимаций
- **Sidebar закрытие** - 500ms
- **Page transition** - 300ms
- **Navbar title** - синхронно с transition

## 🔐 Аутентификация

### Telegram Widget
- **Встроенный виджет** - официальный Telegram виджет
- **Авторизация** - через Telegram Bot API
- **Персистентность** - сохранение сессии в localStorage

### Supabase Integration
- **База данных** - PostgreSQL через Supabase
- **Real-time** - подписки на изменения сообщений
- **Типизация** - TypeScript типы для данных

## 📱 Адаптивный дизайн

### Mobile-First подход
- **Breakpoints** - sm, md, lg, xl
- **Flexbox** - основная система компоновки
- **Grid** - для сложных макетов

### Адаптивные компоненты
- **Navbar** - адаптивные отступы
- **Sidebar** - полная ширина на мобильных
- **Chat** - ограниченная ширина на десктопе

## 🎯 Производительность

### Оптимизации
- **Code splitting** - автоматическое разделение кода
- **Image optimization** - оптимизация изображений Next.js
- **CSS optimization** - Tailwind CSS purging

### Ленивая загрузка
- **Dynamic imports** - для тяжелых компонентов
- **Suspense** - для асинхронных компонентов

## 🔧 Разработка

### TypeScript
- **Строгая типизация** - все компоненты типизированы
- **Интерфейсы** - четкие контракты между компонентами
- **Утилиты** - типы для Supabase и API

### Стилизация
- **Tailwind CSS** - utility-first подход
- **CSS Variables** - для кастомных цветов
- **Responsive design** - мобильная адаптация

### Тестирование
- **TypeScript** - статическая проверка типов
- **ESLint** - проверка качества кода
- **Prettier** - форматирование кода

## 🚀 Деплой

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- **NEXT_PUBLIC_SUPABASE_URL** - URL Supabase проекта
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - анонимный ключ Supabase
- **NEXT_PUBLIC_TELEGRAM_BOT_USERNAME** - имя Telegram бота

### Оптимизации продакшена
- **Minification** - минификация JS и CSS
- **Tree shaking** - удаление неиспользуемого кода
- **Compression** - сжатие ресурсов