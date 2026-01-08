# Инструкция по деплою на Vercel

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Настройки в панели Vercel

### Шаг 1: Настройка Root Directory

1. Откройте ваш проект в Vercel Dashboard
2. Перейдите в **Settings** → **General**
3. Найдите раздел **Root Directory**
4. Укажите: `annualhha.com`
5. **Сохраните изменения**

### Шаг 2: Настройки Build

1. **Framework Preset**: `Other` (или оставьте пустым)
2. **Build Command**: Оставьте **ПУСТЫМ**
3. **Output Directory**: Оставьте **ПУСТЫМ**
4. **Install Command**: Оставьте **ПУСТЫМ**

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

