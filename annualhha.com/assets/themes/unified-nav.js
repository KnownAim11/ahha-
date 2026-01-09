// ============================================
// UNIFIED NAVIGATION STYLES - JavaScript
// Принудительно применяем единые стили навигации ко всем страницам
// ============================================

(function() {
	'use strict';
	
	// Функция для применения единых стилей навигации
	function applyUnifiedNavStyles() {
		// Находим все возможные элементы header
		const headerSelectors = [
			'#main-header',
			'.main-header',
			'header#main-header',
			'header.main-header',
			'header[id="main-header"]',
			'header[class="main-header"]',
			'header[class*="main-header"]',
			'header[id*="main-header"]'
		];
		
		headerSelectors.forEach(function(selector) {
			const headers = document.querySelectorAll(selector);
			headers.forEach(function(header) {
				if (header) {
					// Принудительно устанавливаем черный фон
					header.style.setProperty('background', '#000000', 'important');
					header.style.setProperty('background-color', '#000000', 'important');
					header.style.setProperty('backdrop-filter', 'none', 'important');
					header.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
					header.style.setProperty('border-bottom', '1px solid rgba(197, 160, 89, 0.2)', 'important');
					header.style.setProperty('box-shadow', 'none', 'important');
					header.style.setProperty('min-height', '80px', 'important');
					header.style.setProperty('height', 'auto', 'important');
					header.style.setProperty('overflow', 'visible', 'important');
					header.style.setProperty('position', 'relative', 'important');
				}
			});
		});
		
		// Находим все ссылки навигации
		const linkSelectors = [
			'#main-header #top-menu a',
			'#main-header .nav a',
			'#main-header nav ul li a',
			'#main-header #top-menu-nav a',
			'.main-header #top-menu a',
			'.main-header .nav a',
			'.main-header nav ul li a',
			'#top-menu a',
			'#top-menu-nav a',
			'nav#top-menu-nav a',
			'ul#top-menu a'
		];
		
		linkSelectors.forEach(function(selector) {
			const links = document.querySelectorAll(selector);
			links.forEach(function(link) {
				if (link) {
					// Проверяем, является ли ссылка активной
					const parent = link.parentElement;
					const isActive = (parent && (
						parent.classList.contains('current-menu-item') || 
						parent.classList.contains('current_page_item')
					)) || link.getAttribute('aria-current') === 'page';
					
				if (isActive) {
					// Активная страница - золотая с полной непрозрачностью
					link.style.setProperty('color', '#C5A059', 'important');
					link.style.setProperty('opacity', '1', 'important');
				} else {
					// Остальные - белые с прозрачностью
					link.style.setProperty('color', '#FFFFFF', 'important');
					link.style.setProperty('opacity', '0.8', 'important');
				}
					
					// Убираем все эффекты
					link.style.setProperty('border-bottom', 'none', 'important');
					link.style.setProperty('border', 'none', 'important');
					link.style.setProperty('background', 'transparent', 'important');
					
					// Устанавливаем профессиональный вид навигации
					link.style.setProperty('font-size', '14px', 'important');
					link.style.setProperty('text-transform', 'uppercase', 'important');
					link.style.setProperty('letter-spacing', '0.12em', 'important');
					link.style.setProperty('font-weight', '500', 'important');
					link.style.setProperty('padding', '10px 20px', 'important');
					link.style.setProperty('transition', 'all 0.3s ease', 'important');
					
					if (!isActive) {
						link.style.setProperty('opacity', '0.8', 'important');
					}
				}
			});
		});
		
		// Устанавливаем правильное выравнивание навигации
		const navLists = document.querySelectorAll('#top-menu, ul#top-menu, .nav, ul.nav, #main-header #top-menu, #main-header ul#top-menu, #et-top-navigation #top-menu, #et-top-navigation ul#top-menu, #top-menu-nav ul, nav#top-menu-nav ul');
		navLists.forEach(function(list) {
			if (list) {
				list.style.setProperty('display', 'flex', 'important');
				list.style.setProperty('align-items', 'center', 'important');
				list.style.setProperty('justify-content', 'flex-end', 'important');
				list.style.setProperty('gap', '0', 'important');
			}
		});
		
		// Устанавливаем правильный spacing для контейнера меню
		const menuContainers = document.querySelectorAll('.et_menu_container, .container.et_menu_container, #main-header .container, header#main-header .container');
		menuContainers.forEach(function(container) {
			if (container) {
				container.style.setProperty('display', 'flex', 'important');
				container.style.setProperty('align-items', 'center', 'important');
				container.style.setProperty('justify-content', 'space-between', 'important');
				container.style.setProperty('gap', '2rem', 'important');
				container.style.setProperty('flex-wrap', 'nowrap', 'important');
				container.style.setProperty('position', 'relative', 'important');
				container.style.setProperty('overflow', 'visible', 'important');
			}
		});
		
		// Устанавливаем ограничения для логотипа контейнера
		const logoContainers = document.querySelectorAll('.logo_container, #main-header .logo_container, header#main-header .logo_container, .main-header .logo_container');
		logoContainers.forEach(function(logoContainer) {
			if (logoContainer) {
				logoContainer.style.setProperty('flex-shrink', '0', 'important');
				logoContainer.style.setProperty('flex-grow', '0', 'important');
				logoContainer.style.setProperty('max-width', '250px', 'important');
				logoContainer.style.setProperty('width', 'auto', 'important');
				logoContainer.style.setProperty('margin-right', '2rem', 'important');
				logoContainer.style.setProperty('display', 'inline-flex', 'important');
				logoContainer.style.setProperty('align-items', 'center', 'important');
				logoContainer.style.setProperty('position', 'relative', 'important');
				logoContainer.style.setProperty('float', 'none', 'important');
				logoContainer.style.setProperty('clear', 'none', 'important');
				logoContainer.style.setProperty('vertical-align', 'middle', 'important');
				logoContainer.style.setProperty('order', '1', 'important');
				logoContainer.style.setProperty('margin-top', '0', 'important');
				logoContainer.style.setProperty('margin-bottom', '0', 'important');
				logoContainer.style.setProperty('padding-top', '0', 'important');
				logoContainer.style.setProperty('padding-bottom', '0', 'important');
				logoContainer.style.setProperty('max-height', '80px', 'important');
				logoContainer.style.setProperty('overflow', 'hidden', 'important');
			}
		});
		
		// Устанавливаем размер логотипа
		const logos = document.querySelectorAll('#logo, #main-header #logo, header#main-header #logo, .logo_container img, .logo_container #logo, .logo_container a img');
		logos.forEach(function(logo) {
			if (logo) {
				logo.style.setProperty('max-height', '65px', 'important');
				logo.style.setProperty('max-width', '100%', 'important');
				logo.style.setProperty('width', 'auto', 'important');
				logo.style.setProperty('height', 'auto', 'important');
			}
		});
		
		// Скрываем logo_helper, который может мешать layout
		const logoHelpers = document.querySelectorAll('.logo_helper, .logo_container .logo_helper, #main-header .logo_helper');
		logoHelpers.forEach(function(helper) {
			if (helper) {
				helper.style.setProperty('display', 'none', 'important');
			}
		});
		
		// Устанавливаем правильное выравнивание для контейнера навигации
		const navContainers = document.querySelectorAll('#et-top-navigation, #main-header #et-top-navigation, header#main-header #et-top-navigation, .main-header #et-top-navigation');
		navContainers.forEach(function(navContainer) {
			if (navContainer) {
				navContainer.style.setProperty('flex', '1 1 auto', 'important');
				navContainer.style.setProperty('flex-shrink', '1', 'important');
				navContainer.style.setProperty('min-width', '0', 'important');
				navContainer.style.setProperty('display', 'flex', 'important');
				navContainer.style.setProperty('align-items', 'center', 'important');
				navContainer.style.setProperty('justify-content', 'flex-end', 'important');
				navContainer.style.setProperty('position', 'relative', 'important');
				navContainer.style.setProperty('float', 'none', 'important');
				navContainer.style.setProperty('clear', 'none', 'important');
				navContainer.style.setProperty('order', '2', 'important');
			}
		});
		
		// Устанавливаем правильное выравнивание навигации
		const navLists = document.querySelectorAll('#top-menu, ul#top-menu, .nav, ul.nav, #main-header #top-menu, #main-header ul#top-menu, #et-top-navigation #top-menu, #et-top-navigation ul#top-menu, #top-menu-nav ul, nav#top-menu-nav ul');
		navLists.forEach(function(list) {
			if (list) {
				list.style.setProperty('display', 'flex', 'important');
				list.style.setProperty('align-items', 'center', 'important');
				list.style.setProperty('justify-content', 'flex-end', 'important');
				list.style.setProperty('gap', '0', 'important');
			}
		});
		
		
		// Убираем все псевдоэлементы ::after
		const style = document.createElement('style');
		style.textContent = `
			#main-header #top-menu a::after,
			#main-header .nav a::after,
			#main-header nav ul li a::after,
			.main-header #top-menu a::after,
			.main-header .nav a::after,
			.main-header nav ul li a::after,
			#top-menu a::after,
			nav ul li a::after {
				display: none !important;
				content: none !important;
				width: 0 !important;
				height: 0 !important;
			}
		`;
		if (!document.getElementById('unified-nav-override')) {
			style.id = 'unified-nav-override';
			document.head.appendChild(style);
		}
	}
	
	// Применяем стили сразу после загрузки DOM
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyUnifiedNavStyles);
	} else {
		applyUnifiedNavStyles();
	}
	
	// Применяем стили также после полной загрузки страницы
	window.addEventListener('load', applyUnifiedNavStyles);
	
	// Применяем стили при изменении размера окна
	window.addEventListener('resize', applyUnifiedNavStyles);
	
	// Применяем стили при скролле (на случай, если есть скрипты, меняющие стили)
	let scrollTimeout;
	window.addEventListener('scroll', function() {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(applyUnifiedNavStyles, 50);
	});
	
	// Применяем стили каждые 500ms для гарантии (на случай динамических изменений)
	setInterval(applyUnifiedNavStyles, 500);
	
	// ============================================
	// MOBILE MENU FUNCTIONALITY
	// Простое и надежное решение для мобильного меню
	// ============================================
	
	function initMobileMenu() {
		// Используем делегирование событий на уровне document для максимальной надежности
		// Удаляем старый обработчик, если он есть
		if (window.unifiedMobileMenuHandler) {
			document.removeEventListener('click', window.unifiedMobileMenuHandler, true);
		}
		
		window.unifiedMobileMenuHandler = function(e) {
			// Проверяем, был ли клик внутри мобильного меню или по его элементам
			const mobileNavContainer = e.target.closest('#et_mobile_nav_menu');
			const isMobileMenuClick = mobileNavContainer || 
				e.target.closest('.mobile_nav') || 
				e.target.closest('.mobile_menu_bar') ||
				e.target.closest('.mobile_menu_bar_toggle') ||
				e.target.classList.contains('mobile_menu_bar') ||
				e.target.classList.contains('mobile_menu_bar_toggle') ||
				e.target.classList.contains('mobile_nav') ||
				e.target.classList.contains('select_page');
			
			if (isMobileMenuClick && window.innerWidth <= 980) {
				e.preventDefault();
				e.stopPropagation();
				
				const mobileNav = document.querySelector('#et_mobile_nav_menu .mobile_nav');
				const topMenu = document.querySelector('#top-menu');
				const topMenuNav = document.querySelector('#top-menu-nav');
				
				if (mobileNav) {
					const isOpen = mobileNav.classList.contains('open');
					
					if (isOpen) {
						// Закрываем меню
						mobileNav.classList.remove('open');
						mobileNav.classList.add('closed');
						
						// Возвращаем хамбургер к обычному цвету (или оставляем золотым)
						const hamburger = document.querySelector('#et_mobile_nav_menu .mobile_menu_bar, #et_mobile_nav_menu .mobile_menu_bar_toggle');
						if (hamburger) {
							hamburger.style.color = '#C5A059';
						}
						
						if (topMenu) {
							topMenu.style.display = 'none';
							topMenu.style.visibility = 'hidden';
						}
						if (topMenuNav) {
							topMenuNav.style.display = 'none';
							topMenuNav.style.visibility = 'hidden';
						}
					} else {
						// Открываем меню
						mobileNav.classList.remove('closed');
						mobileNav.classList.add('open');
						
						// Делаем хамбургер золотым
						const hamburger = document.querySelector('#et_mobile_nav_menu .mobile_menu_bar, #et_mobile_nav_menu .mobile_menu_bar_toggle');
						if (hamburger) {
							hamburger.style.color = '#C5A059';
							// Если хамбургер использует псевдоэлементы
							const hamburgerStyle = document.createElement('style');
							hamburgerStyle.id = 'mobile-hamburger-gold';
							hamburgerStyle.textContent = `
								#et_mobile_nav_menu .mobile_menu_bar::before,
								#et_mobile_nav_menu .mobile_menu_bar::after,
								#et_mobile_nav_menu .mobile_menu_bar_toggle::before,
								#et_mobile_nav_menu .mobile_menu_bar_toggle::after {
									background-color: #C5A059 !important;
									border-color: #C5A059 !important;
								}
							`;
							if (!document.getElementById('mobile-hamburger-gold')) {
								document.head.appendChild(hamburgerStyle);
							}
						}
						
						// Получаем позицию header для правильного позиционирования меню
						const header = document.querySelector('#main-header, header#main-header');
						const headerHeight = header ? header.offsetHeight : 80;
						
						if (topMenu) {
							topMenu.style.setProperty('display', 'block', 'important');
							topMenu.style.setProperty('visibility', 'visible', 'important');
							topMenu.style.setProperty('position', 'fixed', 'important');
							topMenu.style.setProperty('top', headerHeight + 'px', 'important');
							topMenu.style.setProperty('left', '0', 'important');
							topMenu.style.setProperty('right', '0', 'important');
							topMenu.style.setProperty('width', '100%', 'important');
							topMenu.style.setProperty('max-width', '100%', 'important');
							topMenu.style.setProperty('background', '#000000', 'important');
							topMenu.style.setProperty('background-color', '#000000', 'important');
							topMenu.style.setProperty('background-image', 'none', 'important');
							topMenu.style.setProperty('border-top', '1px solid #C5A059', 'important');
							topMenu.style.setProperty('z-index', '10000', 'important');
							topMenu.style.setProperty('padding', '20px', 'important');
							topMenu.style.setProperty('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.5)', 'important');
							topMenu.style.setProperty('overflow-y', 'auto', 'important');
							topMenu.style.setProperty('max-height', 'calc(100vh - ' + headerHeight + 'px)', 'important');
							
							// Принудительно убираем все возможные белые фоны
							topMenu.setAttribute('style', topMenu.getAttribute('style') + '; background: #000000 !important; background-color: #000000 !important; background-image: none !important;');
							
							// Стили для ссылок в мобильном меню
							const menuLinks = topMenu.querySelectorAll('a');
							menuLinks.forEach(function(link) {
								link.style.color = '#FFFFFF';
								link.style.display = 'block';
								link.style.padding = '15px 20px';
								link.style.borderBottom = '1px solid rgba(197, 160, 89, 0.1)';
								link.style.textDecoration = 'none';
							});
							
							// Активная ссылка - золотая
							const activeLink = topMenu.querySelector('.current-menu-item > a, .current_page_item > a');
							if (activeLink) {
								activeLink.style.color = '#C5A059';
							}
							
							// Стили для элементов списка
							const menuItems = topMenu.querySelectorAll('li');
							menuItems.forEach(function(item) {
								item.style.display = 'block';
								item.style.margin = '0';
								item.style.padding = '0';
								item.style.borderBottom = '1px solid rgba(197, 160, 89, 0.1)';
							});
							
							// Стили для подменю
							const subMenus = topMenu.querySelectorAll('.sub-menu');
							subMenus.forEach(function(subMenu) {
								subMenu.style.position = 'static';
								subMenu.style.display = 'block';
								subMenu.style.background = 'transparent';
								subMenu.style.border = 'none';
								subMenu.style.boxShadow = 'none';
								subMenu.style.padding = '0';
								subMenu.style.margin = '0';
								subMenu.style.opacity = '1';
								subMenu.style.visibility = 'visible';
								subMenu.style.transform = 'none';
							});
							
							// Стили для ссылок в подменю
							const subMenuLinks = topMenu.querySelectorAll('.sub-menu a');
							subMenuLinks.forEach(function(link) {
								link.style.paddingLeft = '40px';
								link.style.color = 'rgba(255, 255, 255, 0.8)';
								link.style.fontSize = '13px';
							});
						}
						if (topMenuNav) {
							topMenuNav.style.setProperty('display', 'block', 'important');
							topMenuNav.style.setProperty('visibility', 'visible', 'important');
							topMenuNav.style.setProperty('position', 'fixed', 'important');
							topMenuNav.style.setProperty('top', headerHeight + 'px', 'important');
							topMenuNav.style.setProperty('left', '0', 'important');
							topMenuNav.style.setProperty('right', '0', 'important');
							topMenuNav.style.setProperty('width', '100%', 'important');
							topMenuNav.style.setProperty('max-width', '100%', 'important');
							topMenuNav.style.setProperty('background', '#000000', 'important');
							topMenuNav.style.setProperty('background-color', '#000000', 'important');
							topMenuNav.style.setProperty('background-image', 'none', 'important');
							topMenuNav.style.setProperty('border-top', '1px solid #C5A059', 'important');
							topMenuNav.style.setProperty('z-index', '10000', 'important');
							topMenuNav.style.setProperty('padding', '20px', 'important');
							topMenuNav.style.setProperty('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.5)', 'important');
							topMenuNav.style.setProperty('overflow-y', 'auto', 'important');
							topMenuNav.style.setProperty('max-height', 'calc(100vh - ' + headerHeight + 'px)', 'important');
							
							// Принудительно убираем все возможные белые фоны
							topMenuNav.setAttribute('style', topMenuNav.getAttribute('style') + '; background: #000000 !important; background-color: #000000 !important; background-image: none !important;');
							
							// Стили для ссылок в мобильном меню
							const menuNavLinks = topMenuNav.querySelectorAll('a');
							menuNavLinks.forEach(function(link) {
								link.style.color = '#FFFFFF';
								link.style.display = 'block';
								link.style.padding = '15px 20px';
								link.style.borderBottom = '1px solid rgba(197, 160, 89, 0.1)';
								link.style.textDecoration = 'none';
							});
							
							// Активная ссылка - золотая
							const activeNavLink = topMenuNav.querySelector('.current-menu-item > a, .current_page_item > a');
							if (activeNavLink) {
								activeNavLink.style.color = '#C5A059';
							}
							
							// Стили для элементов списка
							const menuNavItems = topMenuNav.querySelectorAll('li');
							menuNavItems.forEach(function(item) {
								item.style.display = 'block';
								item.style.margin = '0';
								item.style.padding = '0';
								item.style.borderBottom = '1px solid rgba(197, 160, 89, 0.1)';
							});
							
							// Стили для подменю
							const subNavMenus = topMenuNav.querySelectorAll('.sub-menu');
							subNavMenus.forEach(function(subMenu) {
								subMenu.style.position = 'static';
								subMenu.style.display = 'block';
								subMenu.style.background = 'transparent';
								subMenu.style.border = 'none';
								subMenu.style.boxShadow = 'none';
								subMenu.style.padding = '0';
								subMenu.style.margin = '0';
								subMenu.style.opacity = '1';
								subMenu.style.visibility = 'visible';
								subMenu.style.transform = 'none';
							});
							
							// Стили для ссылок в подменю
							const subNavMenuLinks = topMenuNav.querySelectorAll('.sub-menu a');
							subNavMenuLinks.forEach(function(link) {
								link.style.paddingLeft = '40px';
								link.style.color = 'rgba(255, 255, 255, 0.8)';
								link.style.fontSize = '13px';
							});
						}
					}
				}
			}
		};
		
		document.addEventListener('click', window.unifiedMobileMenuHandler, true); // Используем capture phase для раннего перехвата
		
		// Также инициализируем через jQuery, если доступен
		if (typeof jQuery !== 'undefined') {
			jQuery(document).ready(function($) {
				// Дополнительная инициализация через jQuery - делегирование событий
				$(document).on('click', '#et_mobile_nav_menu, #et_mobile_nav_menu *, #et_mobile_nav_menu .mobile_nav, #et_mobile_nav_menu .mobile_menu_bar, #et_mobile_nav_menu .mobile_menu_bar_toggle, #et_mobile_nav_menu .select_page', function(e) {
					if (window.innerWidth > 980) return; // Только для мобильных
					
					e.preventDefault();
					e.stopPropagation();
					
					const $mobileNav = $('#et_mobile_nav_menu .mobile_nav');
					const $topMenu = $('#top-menu');
					const $topMenuNav = $('#top-menu-nav');
					
					if ($mobileNav.hasClass('open')) {
						$mobileNav.removeClass('open').addClass('closed');
						$topMenu.hide();
						$topMenuNav.hide();
					} else {
						$mobileNav.removeClass('closed').addClass('open');
						
						const header = $('#main-header');
						const headerHeight = header.length ? header.outerHeight() : 80;
						
						if ($topMenu.length) {
							$topMenu.css({
								'display': 'block',
								'position': 'fixed',
								'top': headerHeight + 'px',
								'left': '0',
								'right': '0',
								'width': '100%',
								'max-width': '100%',
								'background': '#000000',
								'background-color': '#000000',
								'border-top': '1px solid #C5A059',
								'z-index': '10000',
								'padding': '20px',
								'box-shadow': '0 4px 20px rgba(0, 0, 0, 0.5)',
								'overflow-y': 'auto',
								'max-height': 'calc(100vh - ' + headerHeight + 'px)'
							}).show();
						}
						
						if ($topMenuNav.length) {
							$topMenuNav.css({
								'display': 'block',
								'position': 'fixed',
								'top': headerHeight + 'px',
								'left': '0',
								'right': '0',
								'width': '100%',
								'max-width': '100%',
								'background': '#000000',
								'background-color': '#000000',
								'border-top': '1px solid #C5A059',
								'z-index': '10000',
								'padding': '20px',
								'box-shadow': '0 4px 20px rgba(0, 0, 0, 0.5)',
								'overflow-y': 'auto',
								'max-height': 'calc(100vh - ' + headerHeight + 'px)'
							}).show();
						}
					}
				});
			});
		}
	}
	
	// Инициализируем мобильное меню несколько раз для надежности
	function runMobileMenuInit() {
		initMobileMenu();
	}
	
	// Запускаем при разных событиях для максимальной надежности
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', runMobileMenuInit);
	} else {
		runMobileMenuInit();
	}
	
	window.addEventListener('load', function() {
		setTimeout(runMobileMenuInit, 100);
	});
	
	// Дополнительная инициализация через небольшую задержку
	setTimeout(runMobileMenuInit, 500);
	
	// ============================================
	// MUTATION OBSERVER - отслеживание изменений стилей
	// Принудительно применяем темный фон при любых изменениях
	// ============================================
	
	function forceDarkMobileMenu() {
		const topMenu = document.querySelector('#top-menu');
		const topMenuNav = document.querySelector('#top-menu-nav');
		const mobileNav = document.querySelector('#et_mobile_nav_menu .mobile_nav');
		
		if (mobileNav && mobileNav.classList.contains('open')) {
			// Меню открыто - применяем темный фон
			if (topMenu && (topMenu.style.display === 'block' || window.getComputedStyle(topMenu).display === 'block')) {
				topMenu.style.setProperty('background', '#000000', 'important');
				topMenu.style.setProperty('background-color', '#000000', 'important');
				topMenu.style.setProperty('background-image', 'none', 'important');
				topMenu.style.setProperty('border-top', '1px solid #C5A059', 'important');
				
				// Применяем стили к ссылкам
				const links = topMenu.querySelectorAll('a');
				links.forEach(function(link) {
					link.style.setProperty('color', '#FFFFFF', 'important');
					link.style.setProperty('background', 'transparent', 'important');
					link.style.setProperty('background-color', 'transparent', 'important');
				});
				
				// Активная ссылка - золотая
				const activeLink = topMenu.querySelector('.current-menu-item > a, .current_page_item > a');
				if (activeLink) {
					activeLink.style.setProperty('color', '#C5A059', 'important');
				}
			}
			
			if (topMenuNav && (topMenuNav.style.display === 'block' || window.getComputedStyle(topMenuNav).display === 'block')) {
				topMenuNav.style.setProperty('background', '#000000', 'important');
				topMenuNav.style.setProperty('background-color', '#000000', 'important');
				topMenuNav.style.setProperty('background-image', 'none', 'important');
				topMenuNav.style.setProperty('border-top', '1px solid #C5A059', 'important');
				
				// Применяем стили к ссылкам
				const navLinks = topMenuNav.querySelectorAll('a');
				navLinks.forEach(function(link) {
					link.style.setProperty('color', '#FFFFFF', 'important');
					link.style.setProperty('background', 'transparent', 'important');
					link.style.setProperty('background-color', 'transparent', 'important');
				});
				
				// Активная ссылка - золотая
				const activeNavLink = topMenuNav.querySelector('.current-menu-item > a, .current_page_item > a');
				if (activeNavLink) {
					activeNavLink.style.setProperty('color', '#C5A059', 'important');
				}
			}
		}
	}
	
	// Применяем стили периодически для гарантии
	setInterval(forceDarkMobileMenu, 100);
	
	// Применяем стили после полной загрузки всех скриптов
	window.addEventListener('load', function() {
		setTimeout(forceDarkMobileMenu, 500);
		setTimeout(forceDarkMobileMenu, 1000);
		setTimeout(forceDarkMobileMenu, 2000);
	});
	
	// MutationObserver для отслеживания изменений
	if (typeof MutationObserver !== 'undefined') {
		const observer = new MutationObserver(function(mutations) {
			forceDarkMobileMenu();
		});
		
		// Наблюдаем за изменениями в меню
		const topMenu = document.querySelector('#top-menu');
		const topMenuNav = document.querySelector('#top-menu-nav');
		const mobileNav = document.querySelector('#et_mobile_nav_menu');
		
		if (topMenu) {
			observer.observe(topMenu, {
				attributes: true,
				attributeFilter: ['style', 'class'],
				childList: true,
				subtree: true
			});
		}
		
		if (topMenuNav) {
			observer.observe(topMenuNav, {
				attributes: true,
				attributeFilter: ['style', 'class'],
				childList: true,
				subtree: true
			});
		}
		
		if (mobileNav) {
			observer.observe(mobileNav, {
				attributes: true,
				attributeFilter: ['class'],
				childList: true,
				subtree: true
			});
		}
	}
	
	// ============================================
	// DROPDOWN MENU FUNCTIONALITY
	// Обработка открытия/закрытия dropdown меню по клику (для мобильных)
	// ============================================
	
	function initDropdownMenus() {
		const menuItemsWithChildren = document.querySelectorAll('#top-menu li.menu-item-has-children > a, #top-menu-nav li.menu-item-has-children > a');
		
		menuItemsWithChildren.forEach(function(menuLink) {
			// Удаляем старые обработчики
			const newLink = menuLink.cloneNode(true);
			menuLink.parentNode.replaceChild(newLink, menuLink);
			
			// Добавляем обработчик клика для мобильных устройств
			newLink.addEventListener('click', function(e) {
				// Проверяем, мобильное ли устройство
				if (window.innerWidth <= 980) {
					e.preventDefault();
					
					const parentLi = newLink.parentElement;
					const subMenu = parentLi.querySelector('.sub-menu');
					
					if (subMenu) {
						// Переключаем видимость подменю
						if (subMenu.style.display === 'none' || !subMenu.style.display) {
							// Закрываем все другие открытые подменю
							document.querySelectorAll('#top-menu .sub-menu, #top-menu-nav .sub-menu').forEach(function(menu) {
								if (menu !== subMenu) {
									menu.style.display = 'none';
								}
							});
							
							subMenu.style.display = 'block';
							subMenu.style.position = 'relative';
							subMenu.style.opacity = '1';
							subMenu.style.visibility = 'visible';
						} else {
							subMenu.style.display = 'none';
						}
					}
				}
			});
		});
	}
	
	// Инициализируем dropdown меню
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initDropdownMenus);
	} else {
		initDropdownMenus();
	}
	
	// Повторная инициализация после полной загрузки
	window.addEventListener('load', function() {
		setTimeout(initDropdownMenus, 100);
	});
	
	// Переинициализация при изменении размера окна
	window.addEventListener('resize', function() {
		setTimeout(initDropdownMenus, 100);
	});
})();

