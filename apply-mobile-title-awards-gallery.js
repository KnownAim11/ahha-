#!/usr/bin/env node
/**
 * Скрипт для применения мобильного заголовка (две строки) ко всем страницам галерей
 * На мобильной версии: Award, Gallery (каждое слово на отдельной строке)
 * На десктопе: остается в одну строку "Awards Gallery"
 */

const fs = require('fs');
const path = require('path');

// HTML заголовка с переносами
const newTitleHTML = '<h1 class="luxury-title premium-main-title"><span class="title-line">Awards</span><br><span class="title-line">Gallery</span></h1>';

// CSS стили для мобильной версии
const mobileTitleCSS = `
		/* На десктопе - скрываем переносы, показываем в одну строку */
		@media (min-width: 769px) {
			.premium-honorees-header .premium-main-title br,
			.premium-honorees-header .luxury-title.premium-main-title br,
			.premium-honorees-header h1.luxury-title br {
				display: none !important;
			}
			
			.premium-honorees-header .premium-main-title .title-line,
			.premium-honorees-header .luxury-title.premium-main-title .title-line,
			.premium-honorees-header h1.luxury-title .title-line {
				display: inline !important;
			}
			
			.premium-honorees-header .premium-main-title .title-line:not(:last-child)::after,
			.premium-honorees-header .luxury-title.premium-main-title .title-line:not(:last-child)::after,
			.premium-honorees-header h1.luxury-title .title-line:not(:last-child)::after {
				content: ' ' !important;
			}
		}
		
		/* Исправление заголовка для мобильной версии - каждое слово на отдельной строке */
		@media (max-width: 768px) {
			.premium-honorees-header .premium-main-title,
			.premium-honorees-header .luxury-title.premium-main-title,
			.premium-honorees-header h1.luxury-title,
			.luxury-header-block.premium-honorees-header h1 {
				font-size: clamp(1.8rem, 7vw, 2.5rem) !important;
				line-height: 1.3 !important;
				letter-spacing: 0.05em !important;
				padding: 0 10px !important;
				text-align: center !important;
				display: block !important;
			}
			
			.premium-honorees-header .premium-main-title br,
			.premium-honorees-header .luxury-title.premium-main-title br,
			.premium-honorees-header h1.luxury-title br {
				display: block !important;
			}
			
			.premium-honorees-header .premium-main-title .title-line,
			.premium-honorees-header .luxury-title.premium-main-title .title-line,
			.premium-honorees-header h1.luxury-title .title-line {
				display: block !important;
				line-height: 1.2 !important;
			}
		}
		
		/* Для очень маленьких экранов */
		@media (max-width: 480px) {
			.premium-honorees-header .premium-main-title,
			.premium-honorees-header .luxury-title.premium-main-title,
			.premium-honorees-header h1.luxury-title,
			.luxury-header-block.premium-honorees-header h1 {
				font-size: clamp(1.5rem, 6vw, 2rem) !important;
				line-height: 1.25 !important;
				letter-spacing: 0.04em !important;
			}
		}`;

// Функция для обновления HTML заголовка
function updateTitleHTML(content) {
	// Паттерн для поиска старого заголовка "Awards Gallery"
	const oldTitlePattern = /<h1 class="luxury-title premium-main-title">Awards Gallery<\/h1>/g;
	
	if (oldTitlePattern.test(content)) {
		content = content.replace(oldTitlePattern, newTitleHTML);
		return { updated: true, content };
	}
	
	// Проверяем, может быть уже обновлен
	if (content.includes('title-line') && content.includes('Awards') && content.includes('Gallery')) {
		return { updated: false, content, alreadyUpdated: true };
	}
	
	return { updated: false, content };
}

// Функция для добавления CSS стилей (проверяем, нет ли уже таких стилей)
function addMobileTitleCSS(content) {
	// Проверяем, есть ли уже эти стили (проверяем по уникальной строке)
	if (content.includes('/* На десктопе - скрываем переносы, показываем в одну строку */')) {
		// Проверяем, есть ли стили для Awards Gallery
		if (content.includes('Awards') && content.includes('Gallery') && content.includes('title-line')) {
			return { updated: false, content, alreadyHasCSS: true };
		}
	}
	
	// Ищем место для вставки CSS (перед закрывающим </style> в блоке стилей)
	const styleEndPattern = /(\s*<\/style>)/;
	const styleMatch = content.match(styleEndPattern);
	
	if (styleMatch) {
		// Вставляем CSS перед последним закрывающим </style> в блоке <style>
		const styleBlocks = content.split('</style>');
		if (styleBlocks.length > 1) {
			// Берем последний блок стилей (обычно это наш кастомный блок)
			const lastStyleIndex = content.lastIndexOf('</style>');
			if (lastStyleIndex !== -1) {
				content = content.substring(0, lastStyleIndex) + mobileTitleCSS + '\n\t' + content.substring(lastStyleIndex);
				return { updated: true, content };
			}
		}
	}
	
	return { updated: false, content };
}

// Функция для обновления одного файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let titleUpdated = false;
		let cssUpdated = false;
		
		// Обновляем HTML заголовка
		const titleResult = updateTitleHTML(content);
		if (titleResult.updated) {
			content = titleResult.content;
			titleUpdated = true;
		} else if (titleResult.alreadyUpdated) {
			console.log(`⏭️  Заголовок уже обновлен: ${filePath}`);
		}
		
		// Добавляем CSS стили (только если заголовок был обновлен или уже обновлен)
		if (titleUpdated || titleResult.alreadyUpdated) {
			const cssResult = addMobileTitleCSS(content);
			if (cssResult.updated) {
				content = cssResult.content;
				cssUpdated = true;
			} else if (cssResult.alreadyHasCSS) {
				// CSS уже есть, это нормально
			}
		}
		
		if (titleUpdated || cssUpdated) {
			fs.writeFileSync(filePath, content, 'utf8');
			console.log(`✅ Обновлено: ${filePath}`);
			return true;
		}
		
		return false;
	} catch (error) {
		console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

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

// Главная функция
function main() {
	const baseDir = __dirname;
	
	console.log('🚀 Применение мобильного заголовка (две строки) ко всем страницам галерей...\n');
	
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

