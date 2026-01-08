#!/usr/bin/env node
/**
 * Скрипт для исправления ВСЕХ абсолютных путей на относительные
 * Исправляет пути к CSS, JS, изображениям и другим ресурсам
 * для страниц в подпапках (honorees, gallery и т.д.)
 */

const fs = require('fs');
const path = require('path');

// Все страницы, которые находятся в подпапках (не в корне)
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
  // Другие страницы в подпапках
  'about-ahha/index.html',
  'ahha-honorees/index.html',
  'contact/index.html',
  'contact-us/index.html',
  'gallery/index.html',
  'nomination-form/index.html',
  'our-sponsors/index.html',
];

const baseDir = __dirname;

function fixAllPaths(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Файл не найден: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Определяем глубину вложенности (сколько уровней вверх нужно)
  // Для "2022-honorees/index.html" -> глубина 1 (одна подпапка)
  // Для "about-ahha/index.html" -> глубина 1
  const pathParts = filePath.split('/');
  const depth = pathParts.length - 1; // Количество папок (минус index.html)
  const relativePrefix = depth > 0 ? '../'.repeat(depth) : '';

  // Список паттернов для замены абсолютных путей на относительные
  const pathPatterns = [
    // Пути к wp-content (uploads, themes, plugins, et-cache) - абсолютные
    { pattern: /(["'])\/wp-content\//g, replacement: `$1${relativePrefix}wp-content/` },
    // Пути к wp-content - уже относительные, но без префикса (исправляем)
    { pattern: /(["'])wp-content\//g, replacement: `$1${relativePrefix}wp-content/` },
    // Пути к wp-includes - абсолютные
    { pattern: /(["'])\/wp-includes\//g, replacement: `$1${relativePrefix}wp-includes/` },
    // Пути к wp-includes - уже относительные, но без префикса (исправляем)
    { pattern: /(["'])wp-includes\//g, replacement: `$1${relativePrefix}wp-includes/` },
    // Пути к wp-json
    { pattern: /(["'])\/wp-json\//g, replacement: `$1${relativePrefix}wp-json/` },
    // Пути к wp-admin (если есть)
    { pattern: /(["'])\/wp-admin\//g, replacement: `$1${relativePrefix}wp-admin/` },
  ];

  // Применяем все замены
  pathPatterns.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  // Исправляем пути в srcset атрибутах ПЕРЕД другими заменами
  content = content.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    let fixedSrcset = srcsetValue
      // Заменяем абсолютные пути
      .replace(/\/(wp-content|wp-includes|wp-json|wp-admin)\//g, `${relativePrefix}$1/`)
      // Заменяем относительные пути без префикса
      .replace(/([^./"']|^)(wp-content|wp-includes|wp-json|wp-admin)\//g, `$1${relativePrefix}$2/`);
    return `srcset="${fixedSrcset}"`;
  });

  // Исправляем уже испорченные пути (множественные точки) - В КОНЦЕ
  // Сначала исправляем в srcset специально
  content = content.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    // Заменяем множественные точки на правильный префикс
    const fixedSrcset = srcsetValue.replace(/\.{2,}\//g, '../');
    return `srcset="${fixedSrcset}"`;
  });
  
  // Затем исправляем везде остальное
  content = content.replace(/\.{3,}\//g, '../');
  
  // Исправляем пути в src атрибутах img тегов (которые могут быть без кавычек)
  content = content.replace(/<img([^>]*)\ssrc=([^>\s]+)/g, (match, attrs, src) => {
    // Если src начинается с /wp-content или wp-content без префикса
    if (src.match(/^["']\/wp-content\//) || src.match(/^["']wp-content\//)) {
      const fixedSrc = src
        .replace(/^(["'])\/wp-content\//, `$1${relativePrefix}wp-content/`)
        .replace(/^(["'])wp-content\//, `$1${relativePrefix}wp-content/`);
      return `<img${attrs} src=${fixedSrc}`;
    }
    return match;
  });

  // Исправляем пути в srcset атрибутах
  content = content.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    const fixedSrcset = srcsetValue.replace(/\/(wp-content|wp-includes|wp-json|wp-admin)\//g, `${relativePrefix}$1/`);
    return `srcset="${fixedSrcset}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Исправлено: ${filePath} (глубина: ${depth})`);
    return true;
  } else {
    console.log(`ℹ️  Изменений не требуется: ${filePath}`);
    return false;
  }
}

// Запускаем исправление для всех страниц
console.log('🔧 Начинаем исправление всех абсолютных путей...\n');

let fixedCount = 0;
pagesToFix.forEach(page => {
  if (fixAllPaths(page)) {
    fixedCount++;
  }
});

console.log(`\n✨ Готово! Исправлено файлов: ${fixedCount} из ${pagesToFix.length}`);

