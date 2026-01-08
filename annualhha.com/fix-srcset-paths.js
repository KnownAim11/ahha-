#!/usr/bin/env node
/**
 * Скрипт для исправления множественных точек в srcset атрибутах
 * Заменяет ..../ или ..... на ../ в srcset
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// Все страницы, которые нужно проверить
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

let fixedCount = 0;

pagesToFix.forEach(file => {
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Файл не найден: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Исправляем множественные точки в srcset
  // Заменяем ..../ или ..... на ../ в srcset атрибутах
  content = content.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    const fixed = srcsetValue.replace(/\.{3,}\//g, '../');
    if (fixed !== srcsetValue) {
      return `srcset="${fixed}"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Исправлено: ${file}`);
    fixedCount++;
  }
});

console.log(`\n✨ Готово! Исправлено файлов: ${fixedCount} из ${pagesToFix.length}`);

