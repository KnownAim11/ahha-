#!/usr/bin/env node
/**
 * Скрипт для добавления мобильного меню на все страницы сайта
 */

const fs = require('fs');
const path = require('path');

// Скрипт мобильного меню
const mobileMenuScript = `
<!-- Простой и надежный обработчик мобильного меню -->
<script>
(function() {
	'use strict';
	
	// Функция для инициализации мобильного меню
	function initMobileMenu() {
		// Находим элементы
		const mobileNavContainer = document.querySelector('#et_mobile_nav_menu');
		const mobileNav = document.querySelector('#et_mobile_nav_menu .mobile_nav');
		const toggle = document.querySelector('#et_mobile_nav_menu .mobile_menu_bar_toggle, #et_mobile_nav_menu .mobile_menu_bar');
		const topMenuNav = document.querySelector('#top-menu-nav');
		const topMenu = document.querySelector('#top-menu');
		
		// Проверяем наличие элементов
		if (!mobileNavContainer || !mobileNav || !toggle) {
			return;
		}
		
		// Функция для открытия меню
		function openMenu() {
			mobileNav.classList.remove('closed');
			mobileNav.classList.add('opened', 'open');
			mobileNav.setAttribute('data-open', 'true');
			mobileNav.setAttribute('aria-expanded', 'true');
			
			if (topMenuNav) {
				topMenuNav.style.display = 'block';
				topMenuNav.style.position = 'fixed';
				topMenuNav.style.top = '80px';
				topMenuNav.style.left = '0';
				topMenuNav.style.right = '0';
				topMenuNav.style.width = '100%';
				topMenuNav.style.maxWidth = '100%';
				topMenuNav.style.background = '#000000';
				topMenuNav.style.backgroundColor = '#000000';
				topMenuNav.style.borderTop = '1px solid #C5A059';
				topMenuNav.style.zIndex = '999999';
				topMenuNav.style.padding = '20px';
				topMenuNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
				topMenuNav.style.maxHeight = 'calc(100vh - 80px)';
				topMenuNav.style.overflowY = 'auto';
				topMenuNav.style.visibility = 'visible';
				topMenuNav.style.opacity = '1';
				topMenuNav.style.pointerEvents = 'auto';
			}
			
			if (topMenu) {
				topMenu.style.display = 'block';
				topMenu.style.visibility = 'visible';
				topMenu.style.opacity = '1';
				topMenu.style.position = 'relative';
				topMenu.style.background = 'transparent';
				topMenu.style.backgroundColor = 'transparent';
				topMenu.style.flexDirection = 'column';
				topMenu.style.alignItems = 'flex-start';
			}
		}
		
		// Функция для закрытия меню
		function closeMenu() {
			mobileNav.classList.remove('opened', 'open');
			mobileNav.classList.add('closed');
			mobileNav.setAttribute('data-open', 'false');
			mobileNav.setAttribute('aria-expanded', 'false');
			
			if (topMenuNav) {
				topMenuNav.style.display = 'none';
				topMenuNav.style.visibility = 'hidden';
				topMenuNav.style.opacity = '0';
			}
			
			if (topMenu) {
				topMenu.style.display = 'none';
				topMenu.style.visibility = 'hidden';
				topMenu.style.opacity = '0';
			}
		}
		
		// Функция для переключения меню
		function toggleMenu(e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
			
			const isOpen = mobileNav.classList.contains('opened') || 
			               mobileNav.classList.contains('open') ||
			               mobileNav.getAttribute('data-open') === 'true';
			
			if (isOpen) {
				closeMenu();
			} else {
				openMenu();
			}
			
			return false;
		}
		
		// Удаляем старые обработчики (если есть)
		const newToggle = toggle.cloneNode(true);
		toggle.parentNode.replaceChild(newToggle, toggle);
		
		// Добавляем обработчики на новый элемент
		newToggle.addEventListener('click', toggleMenu, { capture: true, passive: false });
		newToggle.addEventListener('touchstart', toggleMenu, { capture: true, passive: false });
		
		// Также добавляем обработчик на контейнер для большей надежности
		mobileNavContainer.addEventListener('click', function(e) {
			if (e.target === newToggle || 
			    e.target === mobileNav || 
			    newToggle.contains(e.target) ||
			    mobileNav.contains(e.target)) {
				toggleMenu(e);
			}
		}, { capture: true, passive: false });
		
		mobileNavContainer.addEventListener('touchstart', function(e) {
			if (e.target === newToggle || 
			    e.target === mobileNav || 
			    newToggle.contains(e.target) ||
			    mobileNav.contains(e.target)) {
				toggleMenu(e);
			}
		}, { capture: true, passive: false });
		
		// Закрываем меню при клике вне его
		document.addEventListener('click', function(e) {
			const header = document.querySelector('#main-header');
			if (header && !header.contains(e.target)) {
				if (mobileNav.classList.contains('opened') || mobileNav.classList.contains('open')) {
					closeMenu();
				}
			}
		}, true);
		
		// Закрываем меню при клике на ссылку
		if (topMenu) {
			const links = topMenu.querySelectorAll('a');
			links.forEach(function(link) {
				link.addEventListener('click', function() {
					setTimeout(closeMenu, 100);
				});
			});
		}
	}
	
	// Инициализируем при загрузке DOM
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			setTimeout(initMobileMenu, 100);
		});
	} else {
		setTimeout(initMobileMenu, 100);
	}
	
	// Также инициализируем после полной загрузки страницы
	window.addEventListener('load', function() {
		setTimeout(initMobileMenu, 200);
	});
	
	// Переинициализируем при изменении размера окна
	let resizeTimeout;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function() {
			if (window.innerWidth <= 980) {
				initMobileMenu();
			}
		}, 150);
	});
})();
</script>`;

// Функция для обновления одного HTML файла
function updateHTMLFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		
		// Проверяем, есть ли уже скрипт мобильного меню
		if (content.includes('Простой и надежный обработчик мобильного меню')) {
			console.log(`⏭️  Пропущено (уже есть): ${filePath}`);
			return false;
		}
		
		// Ищем место для вставки (перед </body>)
		const bodyEndPattern = /<script src="\/wp-content\/themes\/mobile-nav-fix\.js"[^>]*><\/script>\s*<\/body>/;
		
		if (bodyEndPattern.test(content)) {
			// Заменяем
			content = content.replace(
				/(<script src="\/wp-content\/themes\/mobile-nav-fix\.js"[^>]*><\/script>)\s*(<\/body>)/,
				`$1${mobileMenuScript}\n$2`
			);
			
			fs.writeFileSync(filePath, content, 'utf8');
			console.log(`✅ Обновлено: ${filePath}`);
			return true;
		} else {
			// Пробуем другой паттерн
			const altPattern = /<\/body>/;
			if (altPattern.test(content)) {
				content = content.replace('</body>', `${mobileMenuScript}\n</body>`);
				fs.writeFileSync(filePath, content, 'utf8');
				console.log(`✅ Обновлено (альтернативный паттерн): ${filePath}`);
				return true;
			} else {
				console.log(`⚠️  Не найдено место для вставки: ${filePath}`);
				return false;
			}
		}
	} catch (error) {
		console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

// Функция для рекурсивного поиска всех HTML файлов
function findHTMLFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);
	
	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		
		if (stat.isDirectory() && !filePath.includes('wp-content') && !filePath.includes('wp-includes') && !filePath.includes('wp-json') && !filePath.includes('node_modules')) {
			findHTMLFiles(filePath, fileList);
		} else if (file === 'index.html' && stat.isFile()) {
			fileList.push(filePath);
		}
	});
	
	return fileList;
}

// Главная функция
function main() {
	const siteDir = path.join(__dirname, 'annualhha.com');
	
	if (!fs.existsSync(siteDir)) {
		console.error(`❌ Папка ${siteDir} не найдена!`);
		process.exit(1);
	}
	
	console.log('🚀 Добавление мобильного меню на все страницы...\n');
	
	const htmlFiles = findHTMLFiles(siteDir);
	let updated = 0;
	let skipped = 0;
	
	htmlFiles.forEach(file => {
		const result = updateHTMLFile(file);
		if (result) {
			updated++;
		} else {
			skipped++;
		}
	});
	
	console.log(`\n✨ Готово!`);
	console.log(`   Обновлено: ${updated}`);
	console.log(`   Пропущено: ${skipped}`);
	console.log(`   Всего файлов: ${htmlFiles.length}`);
}

main();

