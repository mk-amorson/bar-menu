# РЕШЕНИЕ ПРОБЛЕМЫ С TELEGRAM WIDGET НА 127.0.0.1

## Проблема
Telegram виджет не работает на `127.0.0.1:3000` из-за CSP ошибки:
```
Refused to frame 'https://oauth.telegram.org/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors http://127.0.0.1".
```

## Решение: Использовать localhost.local

### Шаг 1: Настроить файл hosts
Откройте PowerShell **от имени администратора** и выполните:
```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "127.0.0.1 localhost.local"
```

### Шаг 2: Настроить Telegram бота
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Выполните команду `/setdomain`
3. Введите домен: `http://localhost.local:3000`

### Шаг 3: Пересобрать и запустить приложение
```bash
npm run build
npm start
```

### Шаг 4: Открыть сайт по новому адресу
Вместо `http://127.0.0.1:3000` используйте:
**`http://localhost.local:3000`**

## Альтернативное решение: ngrok
Если не хотите менять hosts файл, используйте ngrok:
```bash
# Установить ngrok
# Запустить туннель
ngrok http 3000
# Использовать полученный URL в настройках бота
```

## Почему это работает?
- Telegram требует доменное имя (не IP адрес)
- `localhost.local` воспринимается как валидный домен
- CSP не блокирует домены, только IP адреса
- Бот получает правильный домен для авторизации
