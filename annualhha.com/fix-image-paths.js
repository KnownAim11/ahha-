#!/usr/bin/env node
/**
 * Скрипт для исправления путей к изображениям в honorees и gallery страницах
 * Заменяет абсолютные пути /wp-content/uploads/ на относительные ../wp-content/uploads/
 */

const fs = require('fs');
const path = require('path');

// Список всех страниц honorees и gallery, начиная с 2015 года
const pagesToFix = [
  // Honorees
  '2015-honorees/index.html',
  '2016-ahha-honorees/index.html',
  '2017-honorees/index.html',
  '2018-honorees/index.html',
  '2019-honorees/index.html',
  '2020-honorees/index.html',
  '2021-honorees/index.html',
  '2022-honorees/index.html',
  // Galleries
  '2015-gallery/index.html',
  '2016-gallery/index.html',
  '2017-gallery/index.html',
  '2018-gallery/index.html',
  '2019-gallery/index.html',
  '2020-ahha-gallery/index.html',
];

const baseDir = __dirname;

function fixImagePaths(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Файл не найден: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Сначала исправляем уже испорченные пути (множественные точки)
  content = content.replace(/\.{3,}\/wp-content\/uploads\//g, '../wp-content/uploads/');

  // Заменяем абсолютные пути на относительные
  // Используем более агрессивный подход - заменяем все абсолютные пути /wp-content/uploads/
  // на относительные ../wp-content/uploads/, но только если они не являются уже относительными
  
  // Заменяем все вхождения "/wp-content/uploads/" на "../wp-content/uploads/"
  // но только если перед ними нет "../" или "./"
  content = content.replace(/([^./"']|^)\/wp-content\/uploads\//g, (match, prefix) => {
    // Если это начало строки или не относительный путь, заменяем
    if (prefix === '' || (!prefix.endsWith('../') && !prefix.endsWith('./'))) {
      return prefix + '../wp-content/uploads/';
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Исправлено: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  Изменений не требуется: ${filePath}`);
    return false;
  }
}

// Запускаем исправление для всех страниц
console.log('🔧 Начинаем исправление путей к изображениям...\n');

let fixedCount = 0;
pagesToFix.forEach(page => {
  if (fixImagePaths(page)) {
    fixedCount++;
  }
});

console.log(`\n✨ Готово! Исправлено файлов: ${fixedCount} из ${pagesToFix.length}`);

