#!/usr/bin/env node
/**
 * Скрипт для удаления дублирующихся имен на страницах honorees
 * Скрывает et_pb_toggle_title, так как имя уже отображается в honoree-name
 */

const fs = require('fs');
const path = require('path');

// CSS для скрытия дублирующихся имен
const hideDuplicateNamesCSS = `
		/* Скрываем дублирующиеся имена в toggle заголовках */
		.honorees-page .et_pb_toggle .et_pb_toggle_title,
		.honorees-page .et_pb_module.et_pb_toggle .et_pb_toggle_title {
			display: none !important;
			visibility: hidden !important;
			height: 0 !important;
			overflow: hidden !important;
			margin: 0 !important;
			padding: 0 !important;
		}`;

// Список страниц honorees
const honoreesPages = [
	'annualhha.com/2015-honorees/index.html',
	'annualhha.com/2016-ahha-honorees/index.html',
	'annualhha.com/2017-honorees/index.html',
	'annualhha.com/2018-honorees/index.html',
	'annualhha.com/2019-honorees/index.html',
	'annualhha.com/2020-honorees/index.html',
	'annualhha.com/2021-honorees/index.html',
	'annualhha.com/2022-honorees/index.html'
];

// Функция для добавления CSS стилей
function addHideDuplicateNamesCSS(content) {
	// Проверяем, есть ли уже эти стили
	if (content.includes('/* Скрываем дублирующиеся имена в toggle заголовках */')) {
		return { updated: false, content, alreadyHasCSS: true };
	}
	
	// Ищем место для вставки CSS (перед закрывающим </style> в блоке стилей)
	const styleEndPattern = /(\s*<\/style>)/;
	const styleMatch = content.match(styleEndPattern);
	
	if (styleMatch) {
		// Вставляем CSS перед последним закрывающим </style> в блоке <style>
		const lastStyleIndex = content.lastIndexOf('</style>');
		if (lastStyleIndex !== -1) {
			content = content.substring(0, lastStyleIndex) + hideDuplicateNamesCSS + '\n\t' + content.substring(lastStyleIndex);
			return { updated: true, content };
		}
	}
	
	return { updated: false, content };
}

// Функция для обновления одного файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let cssUpdated = false;
		
		// Добавляем CSS стили
		const cssResult = addHideDuplicateNamesCSS(content);
		if (cssResult.updated) {
			content = cssResult.content;
			cssUpdated = true;
		} else if (cssResult.alreadyHasCSS) {
			console.log(`⏭️  CSS уже добавлен: ${filePath}`);
		}
		
		if (cssUpdated) {
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

// Главная функция
function main() {
	const baseDir = __dirname;
	
	console.log('🚀 Удаление дублирующихся имен на страницах honorees...\n');
	
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
}

main();

