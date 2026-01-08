// Скрипт для автоматического добавления unified-navigation.css и unified-nav.js на все страницы
// Запустите этот скрипт через Node.js: node update-all-pages-nav.js

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const pagesDir = path.join(baseDir, 'annualhha.com');

// Функция для определения относительного пути к wp-content/themes
function getThemePath(filePath) {
	const depth = filePath.split('/').length - 2; // Минус annualhha.com и имя файла
	if (depth === 0) {
		return 'wp-content/themes';
	} else {
		return '../'.repeat(depth) + 'wp-content/themes';
	}
}

// Функция для добавления CSS и JS на страницу
function addUnifiedNavToPage(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		const themePath = getThemePath(filePath);
		
		// Проверяем, есть ли уже unified-navigation.css
		if (content.includes('unified-navigation.css')) {
			console.log(`✓ ${filePath} - уже содержит unified-navigation.css`);
		} else {
			// Добавляем CSS после modern-enhancements.css
			if (content.includes('modern-enhancements.css')) {
				content = content.replace(
					/(<link[^>]*modern-enhancements\.css[^>]*>)/,
					`$1\n\t<link rel="stylesheet" href="${themePath}/unified-navigation.css" type="text/css" media="all" />`
				);
				console.log(`✓ ${filePath} - добавлен unified-navigation.css`);
			}
		}
		
		// Проверяем, есть ли уже unified-nav.js
		if (content.includes('unified-nav.js')) {
			console.log(`✓ ${filePath} - уже содержит unified-nav.js`);
		} else {
			// Добавляем JS перед </body>
			if (content.includes('</body>')) {
				content = content.replace(
					/(<\/body>)/,
					`\t<script src="${themePath}/unified-nav.js"></script>\n$1`
				);
				console.log(`✓ ${filePath} - добавлен unified-nav.js`);
			}
		}
		
		fs.writeFileSync(filePath, content, 'utf8');
	} catch (error) {
		console.error(`✗ Ошибка при обработке ${filePath}:`, error.message);
	}
}

// Находим все index.html файлы
function findIndexFiles(dir) {
	const files = [];
	
	function walkDir(currentDir) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true });
		
		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name);
			
			if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'wp-content' && entry.name !== 'wp-includes' && entry.name !== 'wp-json') {
				walkDir(fullPath);
			} else if (entry.isFile() && entry.name === 'index.html') {
				files.push(fullPath);
			}
		}
	}
	
	walkDir(dir);
	return files;
}

// Обрабатываем все страницы
const indexFiles = findIndexFiles(pagesDir);
console.log(`Найдено ${indexFiles.length} страниц для обработки...\n`);

indexFiles.forEach(file => {
	addUnifiedNavToPage(file);
});

console.log(`\n✓ Готово! Обработано ${indexFiles.length} страниц.`);

