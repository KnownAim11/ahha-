# Инструкция по деплою на Vercel

## Важно: Настройки в панели Vercel

При создании проекта в Vercel обязательно укажите:

1. **Root Directory**: `annualhha.com`
   - Это самая важная настройка!
   - В панели Vercel: Settings → General → Root Directory
   - Укажите: `annualhha.com`

2. **Framework Preset**: `Other` (или оставьте пустым)

3. **Build Command**: Оставьте пустым

4. **Output Directory**: Оставьте пустым (или `annualhha.com` если требуется)

## Структура проекта

Все файлы сайта находятся в папке `annualhha.com/`:
- `annualhha.com/index.html` - главная страница
- `annualhha.com/contact-us/index.html` - страница контактов
- И т.д.

## Файл vercel.json

В корне репозитория создан файл `vercel.json` с настройками:
- `cleanUrls: true` - чистые URL без .html
- `trailingSlash: false` - без слеша в конце
- `outputDirectory: "annualhha.com"` - указывает на папку с файлами

## После деплоя

После успешного деплоя ваш сайт будет доступен по адресу:
`https://your-project.vercel.app`

Все страницы будут работать:
- `/` - главная
- `/contact-us/` - контакты
- `/about-ahha/` - о нас
- И т.д.

