#!/usr/bin/env node
/**
 * Умный скрипт для исправления путей:
 * - Изображения: абсолютные URL с доменом (для работы на Vercel)
 * - CSS/JS: относительные пути (../wp-content/) для страниц в подпапках
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const domain = 'https://annualhha.com';

// Все страницы в подпапках
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

function fixPathsSmart(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Файл не найден: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Определяем глубину вложенности
  const depth = filePath.split('/').length - 1;
  const relativePrefix = depth > 0 ? '../'.repeat(depth) : '';

  // 1. ВОЗВРАЩАЕМ относительные пути для CSS и JS (они должны работать локально)
  // Заменяем абсолютные URL обратно на относительные для CSS/JS
  content = content.replace(/href=["']https:\/\/annualhha\.com\/wp-content\//g, `href="${relativePrefix}wp-content/`);
  content = content.replace(/href=["']https:\/\/annualhha\.com\/wp-includes\//g, `href="${relativePrefix}wp-includes/`);
  content = content.replace(/src=["']https:\/\/annualhha\.com\/wp-content\/(themes|plugins|core|et-cache)/g, `src="${relativePrefix}wp-content/$1`);
  content = content.replace(/src=["']https:\/\/annualhha\.com\/wp-includes\//g, `src="${relativePrefix}wp-includes/`);

  // 2. ОСТАВЛЯЕМ абсолютные URL только для изображений (uploads)
  // Это уже должно быть сделано, но проверим
  // Изображения должны оставаться с https://annualhha.com/wp-content/uploads/

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Исправлено: ${filePath} (глубина: ${depth})`);
    return true;
  } else {
    console.log(`ℹ️  Изменений не требуется: ${filePath}`);
    return false;
  }
}

// Запускаем исправление
console.log('🔧 Исправляем пути: относительные для CSS/JS, абсолютные для изображений...\n');

let fixedCount = 0;
pagesToFix.forEach(page => {
  if (fixPathsSmart(page)) {
    fixedCount++;
  }
});

console.log(`\n✨ Готово! Исправлено файлов: ${fixedCount} из ${pagesToFix.length}`);


