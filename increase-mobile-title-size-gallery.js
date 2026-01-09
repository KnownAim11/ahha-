#!/usr/bin/env node
/**
 * Скрипт для увеличения размера шрифта заголовка "Awards Gallery" на мобильной версии
 */

const fs = require('fs');
const path = require('path');

// Список страниц галерей
const galleryPages = [
	'annualhha.com/gallery/index.html',
	'annualhha.com/2015-gallery/index.html',
	'annualhha.com/2016-gallery/index.html',
	'annualhha.com/2017-gallery/index.html',
	'annualhha.com/2018-gallery/index.html',
	'annualhha.com/2019-gallery/index.html',
	'annualhha.com/2020-ahha-gallery/index.html'
];

// Функция для обновления размера шрифта
function updateFontSize(content) {
	let updated = false;
	
	// Увеличиваем размер для экранов до 768px
	const oldSize768 = /font-size:\s*clamp\(1\.8rem,\s*7vw,\s*2\.5rem\)/g;
	if (oldSize768.test(content)) {
		content = content.replace(oldSize768, 'font-size: clamp(2.5rem, 8vw, 3.5rem)');
		updated = true;
	}
	
	// Увеличиваем размер для экранов до 480px
	const oldSize480 = /font-size:\s*clamp\(1\.5rem,\s*6vw,\s*2rem\)/g;
	if (oldSize480.test(content)) {
		content = content.replace(oldSize480, 'font-size: clamp(2rem, 7vw, 3rem)');
		updated = true;
	}
	
	return { updated, content };
}

// Функция для обновления одного файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		
		// Обновляем размер шрифта
		const result = updateFontSize(content);
		if (result.updated) {
			fs.writeFileSync(filePath, result.content, 'utf8');
			console.log(`✅ Обновлено: ${filePath}`);
			return true;
		} else {
			console.log(`⏭️  Пропущено (уже обновлено или нет нужных стилей): ${filePath}`);
			return false;
		}
	} catch (error) {
		console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

// Главная функция
function main() {
	const baseDir = __dirname;
	
	console.log('🚀 Увеличение размера шрифта заголовка на мобильной версии...\n');
	
	let updated = 0;
	let skipped = 0;
	let errors = 0;
	
	galleryPages.forEach(file => {
		const filePath = path.join(baseDir, file);
		
		if (!fs.existsSync(filePath)) {
			console.log(`⚠️  Файл не найден: ${filePath}`);
			errors++;
			return;
		}
		
		const result = updateHTMLFile(filePath);
		if (result) {
			updated++;
		} else {
			skipped++;
		}
	});
	
	console.log(`\n✨ Готово!`);
	console.log(`   Обновлено: ${updated}`);
	console.log(`   Пропущено: ${skipped}`);
	console.log(`   Ошибок: ${errors}`);
	console.log(`   Всего файлов: ${galleryPages.length}`);
}

main();

