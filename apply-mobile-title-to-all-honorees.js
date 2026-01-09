#!/usr/bin/env node
/**
 * Скрипт для применения мобильного заголовка (три строки) ко всем страницам honorees
 * На мобильной версии: Houston, Humanitarian, Honorees (каждое слово на отдельной строке)
 * На десктопе: остается в одну строку
 */

const fs = require('fs');
const path = require('path');

// HTML заголовка с переносами
const newTitleHTML = '<h1 class="luxury-title premium-main-title"><span class="title-line">Houston</span><br><span class="title-line">Humanitarian</span><br><span class="title-line">Honorees</span></h1>';

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
	// Паттерн для поиска старого заголовка
	const oldTitlePattern = /<h1 class="luxury-title premium-main-title">Houston Humanitarian Honorees<\/h1>/g;
	
	if (oldTitlePattern.test(content)) {
		content = content.replace(oldTitlePattern, newTitleHTML);
		return { updated: true, content };
	}
	
	// Проверяем, может быть уже обновлен
	if (content.includes('title-line')) {
		return { updated: false, content, alreadyUpdated: true };
	}
	
	return { updated: false, content };
}

// Функция для добавления CSS стилей
function addMobileTitleCSS(content) {
	// Проверяем, есть ли уже эти стили
	if (content.includes('/* На десктопе - скрываем переносы, показываем в одну строку */')) {
		return { updated: false, content, alreadyHasCSS: true };
	}
	
	// Ищем место для вставки CSS (перед закрывающим </style> в блоке стилей)
	const styleEndPattern = /(\s*<\/style>)/;
	const styleMatch = content.match(styleEndPattern);
	
	if (styleMatch) {
		// Вставляем CSS перед закрывающим </style>
		const insertPosition = content.lastIndexOf('</style>');
		if (insertPosition !== -1) {
			content = content.substring(0, insertPosition) + mobileTitleCSS + '\n\t' + content.substring(insertPosition);
			return { updated: true, content };
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
		
		// Добавляем CSS стили
		const cssResult = addMobileTitleCSS(content);
		if (cssResult.updated) {
			content = cssResult.content;
			cssUpdated = true;
		} else if (cssResult.alreadyHasCSS) {
			console.log(`⏭️  CSS уже добавлен: ${filePath}`);
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

// Список страниц honorees
const honoreesPages = [
	'annualhha.com/2015-honorees/index.html',
	'annualhha.com/2016-ahha-honorees/index.html',
	'annualhha.com/2017-honorees/index.html',
	'annualhha.com/2018-honorees/index.html',
	'annualhha.com/2019-honorees/index.html',
	'annualhha.com/2021-honorees/index.html',
	'annualhha.com/2022-honorees/index.html'
	// 2020-honorees уже обновлен
];

// Главная функция
function main() {
	const baseDir = __dirname;
	
	console.log('🚀 Применение мобильного заголовка ко всем страницам honorees...\n');
	
	let updated = 0;
	let skipped = 0;
	let errors = 0;
	
	honoreesPages.forEach(file => {
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
	console.log(`   Всего файлов: ${honoreesPages.length}`);
	console.log(`\n📝 Примечание: 2020-honorees уже был обновлен ранее`);
}

main();

