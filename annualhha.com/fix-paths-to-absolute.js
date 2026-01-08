#!/usr/bin/env node
/**
 * Скрипт для замены относительных путей на абсолютные с доменом
 * Это нужно для правильной работы на Vercel
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const domain = 'https://annualhha.com';

// Все страницы, которые нужно исправить
const pagesToFix = [
  '2015-honorees/index.html',
  '2016-ahha-honorees/index.html',
  '2017-honorees/index.html',
  '2018-honorees/index.html',
  '2019-honorees/index.html',
  '2020-honorees/index.html',
  '2021-honorees/index.html',
  '2022-honorees/index.html',
  '2015-gallery/index.html',
  '2016-gallery/index.html',
  '2017-gallery/index.html',
  '2018-gallery/index.html',
  '2019-gallery/index.html',
  '2020-ahha-gallery/index.html',
  'about-ahha/index.html',
  'ahha-honorees/index.html',
  'contact/index.html',
  'contact-us/index.html',
  'gallery/index.html',
  'nomination-form/index.html',
  'our-sponsors/index.html',
];

function fixPathsToAbsolute(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Файл не найден: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Заменяем относительные пути на абсолютные с доменом
  // Сначала заменяем в обычном тексте (для background-image и т.д.)
  content = content.replace(/\.\.\/wp-content\//g, `${domain}/wp-content/`);
  content = content.replace(/\.\.\/wp-includes\//g, `${domain}/wp-includes/`);
  content = content.replace(/\.\.\/wp-json\//g, `${domain}/wp-json/`);
  
  // Затем исправляем пути в srcset (чтобы не затронуть уже исправленные)
  content = content.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    const fixed = srcsetValue.replace(/\.\.\/wp-content\//g, `${domain}/wp-content/`);
    if (fixed !== srcsetValue) {
      return `srcset="${fixed}"`;
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

// Запускаем исправление
console.log('🔧 Начинаем замену относительных путей на абсолютные...\n');

let fixedCount = 0;
pagesToFix.forEach(page => {
  if (fixPathsToAbsolute(page)) {
    fixedCount++;
  }
});

console.log(`\n✨ Готово! Исправлено файлов: ${fixedCount} из ${pagesToFix.length}`);

