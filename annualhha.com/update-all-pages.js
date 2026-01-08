#!/usr/bin/env node
/**
 * Скрипт для автоматического обновления всех HTML страниц сайта
 * Добавляет современные мета-теги и подключает общий CSS файл
 */

const fs = require('fs');
const path = require('path');

// Функция для обновления одного HTML файла
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Определяем относительный путь к CSS файлу
        const depth = filePath.split('/').length - 2; // Глубина вложенности
        const cssPath = depth > 0 ? '../'.repeat(depth) + 'wp-content/themes/modern-enhancements.css' : 'wp-content/themes/modern-enhancements.css';
        
        // 1. Обновляем viewport мета-тег
        if (content.includes('maximum-scale=1.0, user-scalable=0')) {
            content = content.replace(
                /maximum-scale=1\.0, user-scalable=0/g,
                'maximum-scale=5.0, user-scalable=yes'
            );
            modified = true;
        }
        
        // 2. Добавляем theme-color и color-scheme мета-теги после viewport
        if (!content.includes('theme-color')) {
            content = content.replace(
                /(<meta name="viewport"[^>]*>)/,
                '$1\n<meta name="theme-color" content="#1a1a1a" />\n<meta name="color-scheme" content="dark" />'
            );
            modified = true;
        }
        
        // 3. Улучшаем custom-background стили
        if (content.includes('body.custom-background { background-color: #000000; }')) {
            content = content.replace(
                /body\.custom-background \{ background-color: #000000; \}/g,
                `body.custom-background { 
	background-color: #000000; 
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}`
            );
            modified = true;
        }
        
        // 4. Добавляем ссылку на modern-enhancements.css перед закрывающим </head>
        if (!content.includes('modern-enhancements.css')) {
            // Ищем последний link или style перед </head>
            const headCloseMatch = content.match(/(<link[^>]*>[\s\n]*<style[^>]*>[\s\S]*?<\/style>[\s\n]*)*<\/head>/);
            if (headCloseMatch) {
                content = content.replace(
                    /(<\/head>)/,
                    `<link rel="stylesheet" href="${cssPath}" type="text/css" media="all" />\n$1`
                );
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Обновлен: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`✗ Ошибка при обновлении ${filePath}:`, error.message);
        return false;
    }
}

// Функция для рекурсивного поиска всех HTML файлов
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('wp-content') && !filePath.includes('wp-includes') && !filePath.includes('wp-json')) {
            findHTMLFiles(filePath, fileList);
        } else if (file === 'index.html' && stat.isFile()) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Главная функция
function main() {
    const siteDir = __dirname;
    console.log('Начинаю обновление всех страниц сайта...\n');
    
    const htmlFiles = findHTMLFiles(siteDir);
    console.log(`Найдено ${htmlFiles.length} HTML файлов\n`);
    
    let updated = 0;
    htmlFiles.forEach(file => {
        if (updateHTMLFile(file)) {
            updated++;
        }
    });
    
    console.log(`\n✓ Обновлено файлов: ${updated} из ${htmlFiles.length}`);
    console.log('Модернизация завершена!');
}

main();


