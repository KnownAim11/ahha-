#!/bin/bash

# Скрипт для очистки структуры сайта
# Удаляет дублирующие файлы с параметрами WordPress

cd "$(dirname "$0")"

echo "🧹 Очистка структуры сайта..."
echo ""

# Удаляем файлы с параметрами WordPress
echo "Удаление файлов index.html?p=*.html..."
rm -f "index.html?p="*.html
rm -f "index.html?page_id="*.html

echo "✅ Удалено файлов с параметрами WordPress"
echo ""

# Показываем оставшуюся структуру
echo "📁 Текущая структура папок:"
echo ""
find . -maxdepth 1 -type d ! -name "." ! -name "wp-*" ! -name "comments" ! -name "feed" | sort | sed 's|^\./||' | while read dir; do
    if [ -f "$dir/index.html" ]; then
        echo "  ✓ $dir/"
    fi
done

echo ""
echo "✨ Очистка завершена!"
echo ""
echo "📋 Оставшиеся основные страницы:"
echo "  - index.html (главная)"
echo "  - about-ahha/"
echo "  - contact/"
echo "  - nomination-form/"
echo "  - our-sponsors/"
echo "  - gallery/"
echo "  - ahha-honorees/"
echo "  - 2022-honorees/, 2021-honorees/, и т.д."
echo "  - 2020-ahha-gallery/, 2019-gallery/, и т.д."


