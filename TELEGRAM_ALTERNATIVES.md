# АЛЬТЕРНАТИВНЫЕ РЕШЕНИЯ ДЛЯ TELEGRAM WIDGET

## Проблема
CSP блокирует iframe на `127.0.0.1` и `localhost.local`:
```
Refused to frame 'https://oauth.telegram.org/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors http://127.0.0.1".
```

## Решения (по приоритету)

### 1. Использовать localhost вместо 127.0.0.1
- **Настроить бота на домен:** `http://localhost:3000`
- **Открыть сайт:** `http://localhost:3000` (вместо 127.0.0.1:3000)
- **Статус:** ✅ Реализовано в коде

### 2. Альтернативная кнопка авторизации
- **Что делает:** Открывает Telegram авторизацию в новом окне
- **Преимущества:** Обходит CSP ограничения
- **Статус:** ✅ Добавлена в код

### 3. Бесплатные альтернативы ngrok
- **Cloudflare Tunnel:** `cloudflared tunnel --url http://localhost:3000`
- **LocalTunnel:** `npx localtunnel --port 3000`
- **Serveo:** `ssh -R 80:localhost:3000 serveo.net`

### 4. Настроить файл hosts (требует админ права)
```powershell
# Запустить PowerShell от имени администратора
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "127.0.0.1 localhost.local"
```
Затем настроить бота на `http://localhost.local:3000`

### 5. Использовать другой порт
- Попробовать порты: 8080, 3001, 5000
- Настроить бота на новый порт

## Рекомендации
1. **Сначала попробуйте:** `http://localhost:3000`
2. **Если не работает:** Используйте альтернативную кнопку
3. **Для продакшена:** Используйте Cloudflare Tunnel или подобный сервис

