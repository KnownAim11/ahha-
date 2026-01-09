#!/usr/bin/env node
/**
 * Скрипт для удаления дублирующегося первого изображения на страницах honorees (2019-2022)
 * Удаляет et_pb_image_0, так как оно дублирует et_pb_image_1
 */

const fs = require('fs');
const path = require('path');

// Список страниц для обновления
const honoreesPages = [
	'annualhha.com/2019-honorees/index.html',
	'annualhha.com/2020-honorees/index.html',
	'annualhha.com/2021-honorees/index.html',
	'annualhha.com/2022-honorees/index.html'
];

// Функция для удаления дублирующегося первого изображения
function removeDuplicateFirstImage(content) {
	let updated = false;
	
	// Паттерн для поиска первого изображения (et_pb_image_0) и следующего за ним (et_pb_image_1)
	// Ищем блок от начала et_pb_image_0 до начала et_pb_image_1
	const pattern = /<div class="et_pb_module et_pb_image et_pb_image_0 et_animated et-waypoint">\s*<div class="box-shadow-overlay"><\/div><img[^>]*\/><\/span>\s*<\/div><div class="et_pb_module et_pb_image et_pb_image_1/gs;
	
	// Более точный паттерн - ищем весь блок et_pb_image_0 до закрывающего </div>
	const pattern2 = /<div class="et_pb_module et_pb_image et_pb_image_0 et_animated et-waypoint">[\s\S]*?<\/div>(?=<div class="et_pb_module et_pb_image et_pb_image_1)/g;
	
	if (pattern2.test(content)) {
		content = content.replace(pattern2, '');
		updated = true;
	}
	
	return { updated, content };
}

// Функция для обновления одного файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		
		// Проверяем, есть ли дублирующееся изображение
		const hasImage0 = content.includes('et_pb_image_0');
		const hasImage1 = content.includes('et_pb_image_1');
		
		if (!hasImage0 || !hasImage1) {
			console.log(`⏭️  Пропущено (нет дублирующихся изображений): ${filePath}`);
			return false;
		}
		
		// Удаляем дублирующееся изображение
		const result = removeDuplicateFirstImage(content);
		
		if (result.updated) {
			fs.writeFileSync(filePath, result.content, 'utf8');
			console.log(`✅ Обновлено: ${filePath}`);
			return true;
		} else {
			// Попробуем более простой подход - найдем и удалим весь блок et_pb_image_0
			const image0Pattern = /<div class="et_pb_module et_pb_image et_pb_image_0[\s\S]*?<\/div>\s*(?=<div class="et_pb_module et_pb_image et_pb_image_1)/g;
			if (image0Pattern.test(content)) {
				content = content.replace(image0Pattern, '');
				fs.writeFileSync(filePath, content, 'utf8');
				console.log(`✅ Обновлено (альтернативный метод): ${filePath}`);
				return true;
			}
			
			console.log(`⚠️  Не удалось найти дублирующееся изображение: ${filePath}`);
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
	
	console.log('🚀 Удаление дублирующегося первого изображения на страницах honorees (2019-2022)...\n');
	
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

