// ============================================
// UNIFIED PREMIUM FOOTER - DYNAMIC INJECTION
// Annual Houston Humanitarian Awards
// ============================================

(function() {
	'use strict';
	
	// Detect if we're in root or subfolder
	// Works with both local (index.html) and Vercel (cleanUrls) paths
	const pathname = window.location.pathname || '';
	const href = window.location.href || '';
	
	// Normalize pathname - remove trailing slash and index.html
	let normalizedPath = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
	if (!normalizedPath) normalizedPath = '/';
	
	// Check if we're in a subfolder (not root)
	// Root is either '/' or empty string
	const isRoot = normalizedPath === '/' || normalizedPath === '';
	
	// Also check for known subfolders (works with both /contact-us and /contact-us/)
	const knownSubfolders = [
		'/contact-us', '/about-ahha', '/nomination-form', '/our-sponsors',
		'/gallery', '/honorees', '/ahha-honorees', '/contact',
		'/2015-gallery', '/2015-honorees', '/2016-ahha-honorees', '/2016-gallery',
		'/2017-gallery', '/2017-honorees', '/2018-gallery', '/2018-honorees',
		'/2019-gallery', '/2019-honorees', '/2020-ahha-gallery', '/2020-honorees',
		'/2021-honorees', '/2022-honorees'
	];
	
	const isKnownSubfolder = knownSubfolders.some(folder => 
		normalizedPath.startsWith(folder)
	);
	
	// Check if path has more than one segment (e.g., /contact-us vs /)
	const pathSegments = normalizedPath.split('/').filter(p => p);
	const isSubfolder = !isRoot && (isKnownSubfolder || pathSegments.length > 0);
	
	// Path prefix for assets and links
	const pathPrefix = isSubfolder ? '../' : '';
	
	// Footer HTML template
	const footerHTML = `
	<footer class="premium-unified-footer">
		<div class="premium-footer-grid">
			<!-- Column 1: Mission -->
			<div class="footer-column-mission">
				<img src="${pathPrefix}wp-content/uploads/2019/12/TAHHA_LOGO-2.png" alt="Annual Houston Humanitarian Awards" class="footer-logo" />
				<p class="footer-mission-text">Celebrating the unsung heroes of Houston. Dedicated to honoring individuals making a significant impact through action and philanthropy.</p>
			</div>
			
			<!-- Column 2: Navigation -->
			<div class="footer-column-nav">
				<h4 class="footer-column-title">Navigation</h4>
				<ul class="footer-nav-list">
					<li><a href="${pathPrefix}index.html">Home</a></li>
					<li><a href="${pathPrefix}about-ahha/index.html">About</a></li>
					<li><a href="${pathPrefix}nomination-form/index.html">Nomination Form</a></li>
					<li><a href="${pathPrefix}contact-us/index.html">Contact Us</a></li>
					<li><a href="${pathPrefix}ahha-honorees/index.html">AHHA Honorees</a></li>
					<li><a href="${pathPrefix}gallery/index.html">Gallery</a></li>
					<li><a href="${pathPrefix}our-sponsors/index.html">Our Sponsors</a></li>
				</ul>
			</div>
			
			<!-- Column 3: Get Involved -->
			<div class="footer-column-connect">
				<h4 class="footer-column-title">Get Involved</h4>
				<a href="${pathPrefix}nomination-form/index.html" class="footer-cta-link">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 5v14M5 12h14"/>
					</svg>
					Nominate Someone
				</a>
				<div class="footer-social-icons">
					<a href="https://www.facebook.com/AnnualHoustonHumanitarianAwards" target="_blank" rel="noopener" class="footer-social-icon" aria-label="Facebook">
						<svg viewBox="0 0 24 24">
							<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
						</svg>
					</a>
					<a href="https://www.instagram.com/annualhha" target="_blank" rel="noopener" class="footer-social-icon" aria-label="Instagram">
						<svg viewBox="0 0 24 24">
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
						</svg>
					</a>
				</div>
			</div>
		</div>
		
		<!-- Copyright Row -->
		<div class="footer-copyright-row">
			<p class="footer-copyright-text">© 2026 Annual Houston Humanitarian Awards. All rights reserved.</p>
		</div>
	</footer>
	`;
	
	function injectFooter() {
		try {
			// Debug: log path detection (remove in production if needed)
			console.log('[Footer] Path detection:', {
				pathname: window.location.pathname,
				normalizedPath: normalizedPath,
				isSubfolder: isSubfolder,
				pathPrefix: pathPrefix
			});
			
			// Check if footer already injected to avoid duplicates
			const existingPremiumFooter = document.querySelector('.premium-unified-footer');
			if (existingPremiumFooter) {
				console.log('[Footer] Footer already exists, skipping injection');
				return; // Footer already exists, don't inject again
			}
			
			// Find existing footer elements to replace - be very specific
			const existingFooters = document.querySelectorAll(
				'footer#main-footer, body > footer#main-footer, #main-footer'
			);
			
			// Find the best insertion point
			const pageContainer = document.getElementById('page-container');
			const etMainArea = document.getElementById('et-main-area');
			const mainContent = document.getElementById('main-content');
			const body = document.body;
			
			if (existingFooters.length > 0) {
				// Insert new footer before first existing footer
				existingFooters[0].insertAdjacentHTML('beforebegin', footerHTML);
				// Hide old footer
				existingFooters.forEach(footer => {
					footer.style.display = 'none';
				});
			} else if (etMainArea) {
				// Insert at end of main area
				etMainArea.insertAdjacentHTML('beforeend', footerHTML);
			} else if (pageContainer) {
				// Insert at end of page container
				pageContainer.insertAdjacentHTML('beforeend', footerHTML);
			} else if (mainContent) {
				// Insert after main content
				mainContent.insertAdjacentHTML('afterend', footerHTML);
			} else {
				// Last resort: append to body
				body.insertAdjacentHTML('beforeend', footerHTML);
			}
			
			// Also hide any Divi footer elements that might be styled differently
			// Be very specific to avoid hiding main content
			const diviFooterElements = document.querySelectorAll(
				'#et-footer-nav, #footer-bottom'
			);
			diviFooterElements.forEach(el => {
				if (el && (el.tagName === 'FOOTER' || el.id === 'et-footer-nav' || el.id === 'footer-bottom')) {
					el.style.display = 'none';
				}
			});
			
			console.log('[Footer] Footer injected successfully');
		} catch (error) {
			console.error('[Footer] Error injecting footer:', error);
			// Don't break the page if footer injection fails
		}
	}
	
	// Run when DOM is ready - multiple strategies for maximum compatibility
	function initFooter() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', injectFooter);
		} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
			// DOM already loaded or loading
			injectFooter();
		} else {
			// Fallback: wait a bit and try again
			setTimeout(injectFooter, 100);
		}
	}
	
	// Try immediately
	initFooter();
	
	// Also try after window load (in case DOMContentLoaded already fired)
	window.addEventListener('load', function() {
		setTimeout(injectFooter, 50);
	});
	
	// Fallback: try one more time after a short delay
	setTimeout(injectFooter, 500);
	
})();

