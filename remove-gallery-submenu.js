#!/usr/bin/env node
/**
 * Скрипт для удаления подменю Gallery на всех страницах
 * Оставляет только главную ссылку Gallery, как на главной странице
 */

const fs = require('fs');
const path = require('path');

// Паттерн для поиска и замены - более гибкий, обрабатывает все варианты классов
const gallerySubmenuPattern = /<li id="menu-item-371" class="([^"]*menu-item-has-children[^"]*)"><a href="\/gallery\/index\.html"([^>]*)>Gallery<\/a>\s*<ul class="sub-menu">[\s\S]*?<\/ul>\s*<\/li>/g;

// Функция для создания простой ссылки с сохранением нужных классов
function createSimpleLink(originalClasses, linkAttributes) {
	// Убираем menu-item-has-children из классов
	const classes = originalClasses
		.replace(/\s*menu-item-has-children\s*/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	
	// Сохраняем aria-current если есть
	const attrs = linkAttributes || '';
	
	return `<li id="menu-item-371" class="${classes}"><a href="/gallery/index.html"${attrs}>Gallery</a></li>`;
}

// Функция для обновления одного HTML файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let modified = false;
		
		// Проверяем, есть ли подменю Gallery
		const match = content.match(gallerySubmenuPattern);
		if (match) {
			// Извлекаем классы и атрибуты из первого совпадения
			const fullMatch = match[0];
			const classMatch = fullMatch.match(/class="([^"]*)"/);
			const linkMatch = fullMatch.match(/<a href="\/gallery\/index\.html"([^>]*)>/);
			
			if (classMatch && linkMatch) {
				const originalClasses = classMatch[1];
				const linkAttributes = linkMatch[1];
				const simpleLink = createSimpleLink(originalClasses, linkAttributes);
				
				// Заменяем подменю на простую ссылку
				content = content.replace(gallerySubmenuPattern, simpleLink);
				fs.writeFileSync(filePath, content, 'utf8');
				console.log(`✅ Обновлено: ${filePath}`);
				modified = true;
			}
		} else {
			// Проверяем, есть ли уже простая ссылка (без подменю)
			if (content.includes('menu-item-371') && !content.includes('menu-item-has-children menu-item-371')) {
				console.log(`⏭️  Пропущено (уже без подменю): ${filePath}`);
			} else if (!content.includes('menu-item-371')) {
				console.log(`⚠️  Gallery не найдено: ${filePath}`);
			}
		}
		
		return modified;
	} catch (error) {
		console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

// Список файлов для обновления (из результатов grep)
const filesToUpdate = [
	'annualhha.com/2020-honorees/index.html',
	'annualhha.com/2022-honorees/index.html',
	'annualhha.com/about-ahha/index.html',
	'annualhha.com/our-sponsors/index.html',
	'annualhha.com/nomination-form/index.html',
	'annualhha.com/gallery/index.html',
	'annualhha.com/contact-us/index.html',
	'annualhha.com/contact/index.html',
	'annualhha.com/ahha-honorees/index.html',
	'annualhha.com/2021-honorees/index.html',
	'annualhha.com/2020-ahha-gallery/index.html',
	'annualhha.com/2019-honorees/index.html',
	'annualhha.com/2019-gallery/index.html',
	'annualhha.com/2018-honorees/index.html',
	'annualhha.com/2018-gallery/index.html',
	'annualhha.com/2017-honorees/index.html',
	'annualhha.com/2017-gallery/index.html',
	'annualhha.com/2016-gallery/index.html',
	'annualhha.com/2016-ahha-honorees/index.html',
	'annualhha.com/2015-honorees/index.html',
	'annualhha.com/2015-gallery/index.html'
];

// Главная функция
function main() {
	const baseDir = __dirname;
	
	console.log('🚀 Удаление подменю Gallery на всех страницах...\n');
	
	let updated = 0;
	let skipped = 0;
	let errors = 0;
	
	filesToUpdate.forEach(file => {
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
	console.log(`   Всего файлов: ${filesToUpdate.length}`);
}

main();

