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
	// Robust fallback toggle - works even if Divi JS fails
	// ============================================
	
	function initMobileMenu() {
		// Find mobile menu toggle button and container
		const mobileNavContainer = document.querySelector('#et_mobile_nav_menu .mobile_nav');
		
		if (!mobileNavContainer) {
			return; // Mobile menu not found, skip initialization
		}
		
		// Ensure initial state is closed
		if (!mobileNavContainer.hasAttribute('data-open')) {
			mobileNavContainer.setAttribute('data-open', 'false');
			mobileNavContainer.classList.add('closed');
			mobileNavContainer.classList.remove('opened');
		}
		
		// Remove any existing handlers to prevent duplicates
		if (window.unifiedMobileMenuHandler) {
			document.removeEventListener('click', window.unifiedMobileMenuHandler, true);
		}
		
		// Find all possible hamburger button selectors
		const hamburgerSelectors = [
			'#et_mobile_nav_menu .mobile_menu_bar_toggle',
			'#et_mobile_nav_menu .mobile_menu_bar',
			'#et_mobile_nav_menu .mobile_nav',
			'#et_mobile_nav_menu .select_page'
		];
		
		// Robust click handler using event delegation
		window.unifiedMobileMenuHandler = function(e) {
			// Only handle on mobile screens
			if (window.innerWidth > 980) {
				return;
			}
			
			// Check if click is on hamburger button or its parent container
			const target = e.target;
			let isHamburgerClick = false;
			
			// Check if target or its parent matches hamburger selectors
			for (let selector of hamburgerSelectors) {
				if (target.matches && target.matches(selector)) {
					isHamburgerClick = true;
					break;
				}
				if (target.closest && target.closest(selector)) {
					isHamburgerClick = true;
					break;
				}
			}
			
			// Also check by class names
			if (!isHamburgerClick) {
				const classes = ['mobile_menu_bar_toggle', 'mobile_menu_bar', 'mobile_nav', 'select_page'];
				for (let className of classes) {
					if (target.classList && target.classList.contains(className)) {
						isHamburgerClick = true;
						break;
					}
				}
			}
			
			// Check if click is within the mobile nav menu container
			if (!isHamburgerClick && target.closest && target.closest('#et_mobile_nav_menu')) {
				isHamburgerClick = true;
			}
			
			if (!isHamburgerClick) {
				return; // Not a hamburger click, ignore
			}
			
			// Prevent default and stop propagation
			e.preventDefault();
			e.stopPropagation();
			
			// Find mobile nav container (re-query in case DOM changed)
			const mobileNav = document.querySelector('#et_mobile_nav_menu .mobile_nav');
			if (!mobileNav) {
				return;
			}
			
			// Get current state
			const isCurrentlyOpen = mobileNav.getAttribute('data-open') === 'true' || 
			                         mobileNav.classList.contains('opened') ||
			                         mobileNav.classList.contains('open');
			
			// Toggle menu state
			if (isCurrentlyOpen) {
				// Close menu
				mobileNav.setAttribute('data-open', 'false');
				mobileNav.classList.remove('opened', 'open');
				mobileNav.classList.add('closed');
				
				// Hide the menu
				const topMenu = document.querySelector('#top-menu, #top-menu-nav');
				if (topMenu) {
					topMenu.style.display = 'none';
				}
			} else {
				// Open menu
				mobileNav.setAttribute('data-open', 'true');
				mobileNav.classList.remove('closed');
				mobileNav.classList.add('opened', 'open');
				
				// Show the menu
				const topMenu = document.querySelector('#top-menu, #top-menu-nav');
				if (topMenu) {
					topMenu.style.display = 'block';
				}
			}
		};
		
		// Add event listener with capture phase for early interception
		document.addEventListener('click', window.unifiedMobileMenuHandler, true);
		
		// Also add direct event listeners to hamburger elements for extra reliability
		hamburgerSelectors.forEach(function(selector) {
			const elements = document.querySelectorAll(selector);
			elements.forEach(function(el) {
				el.addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					// Trigger the main handler
					const clickEvent = new MouseEvent('click', {
						bubbles: true,
						cancelable: true,
						view: window
					});
					window.unifiedMobileMenuHandler.call(document, clickEvent);
				}, true);
			});
		});
	}
	
	// Initialize on DOMContentLoaded
	function runMobileMenuInit() {
		initMobileMenu();
	}
	
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', runMobileMenuInit);
	} else {
		runMobileMenuInit();
	}
	
	// Re-initialize after page load to catch dynamically loaded content
	window.addEventListener('load', function() {
		setTimeout(runMobileMenuInit, 100);
		setTimeout(runMobileMenuInit, 500);
	});
	
	// Re-initialize on resize (mobile/desktop switch)
	let resizeTimeout;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function() {
			// Re-initialize when switching between mobile and desktop
			if (window.innerWidth <= 980) {
				runMobileMenuInit();
			} else {
				// Close menu on desktop
				const mobileNav = document.querySelector('#et_mobile_nav_menu .mobile_nav');
				if (mobileNav) {
					mobileNav.setAttribute('data-open', 'false');
					mobileNav.classList.remove('opened', 'open');
					mobileNav.classList.add('closed');
				}
			}
		}, 150);
	});
	
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

