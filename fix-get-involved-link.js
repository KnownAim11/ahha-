#!/usr/bin/env node
/**
 * Скрипт для исправления ссылки кнопки "Get Involved" на всех страницах honorees
 * Меняет /contact/index.html на /contact-us/index.html
 */

const fs = require('fs');
const path = require('path');

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

// Функция для исправления ссылки
function fixGetInvolvedLink(content) {
	let updated = false;
	
	// Паттерн для поиска кнопки "Get Involved" с неправильной ссылкой
	const oldLinkPattern = /href="\/contact\/index\.html">Get Involved/g;
	const newLink = 'href="/contact-us/index.html">Get Involved';
	
	if (oldLinkPattern.test(content)) {
		content = content.replace(oldLinkPattern, newLink);
		updated = true;
	}
	
	// Также проверим другие варианты
	const oldLinkPattern2 = /href="\/contact\/">Get Involved/g;
	if (oldLinkPattern2.test(content)) {
		content = content.replace(oldLinkPattern2, newLink);
		updated = true;
	}
	
	return { updated, content };
}

// Функция для обновления одного файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		
		// Исправляем ссылку
		const result = fixGetInvolvedLink(content);
		
		if (result.updated) {
			fs.writeFileSync(filePath, result.content, 'utf8');
			console.log(`✅ Обновлено: ${filePath}`);
			return true;
		} else {
			// Проверяем, может быть уже правильная ссылка
			if (content.includes('href="/contact-us/index.html">Get Involved')) {
				console.log(`⏭️  Пропущено (уже правильная ссылка): ${filePath}`);
			} else if (!content.includes('Get Involved')) {
				console.log(`⚠️  Кнопка "Get Involved" не найдена: ${filePath}`);
			} else {
				console.log(`⚠️  Не удалось найти неправильную ссылку: ${filePath}`);
			}
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
	
	console.log('🚀 Исправление ссылки кнопки "Get Involved" на всех страницах honorees...\n');
	
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

