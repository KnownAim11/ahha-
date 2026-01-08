const fs = require('fs');
const path = require('path');

const footerContent = `<footer id="main-footer" class="premium-unified-footer">
				<div class="premium-footer-grid">
					<!-- Column 1: Mission -->
					<div class="footer-column-mission">
						<img src="/wp-content/uploads/2019/12/TAHHA_LOGO-2.png" alt="Annual Houston Humanitarian Awards" class="footer-logo" />
						<p class="footer-mission-text">Celebrating the unsung heroes of Houston. Dedicated to honoring individuals making a significant impact through action and philanthropy.</p>
					</div>
					
					<!-- Column 2: Navigation -->
					<div class="footer-column-nav">
						<h4 class="footer-column-title">Navigation</h4>
						<ul class="footer-nav-list">
							<li><a href="/index.html">Home</a></li>
							<li><a href="/about-ahha/index.html">About</a></li>
							<li><a href="/nomination-form/index.html">Nomination Form</a></li>
							<li><a href="/contact-us/index.html">Contact Us</a></li>
							<li><a href="/ahha-honorees/index.html">AHHA Honorees</a></li>
							<li><a href="/gallery/index.html">Gallery</a></li>
							<li><a href="/our-sponsors/index.html">Our Sponsors</a></li>
						</ul>
					</div>
					
					<!-- Column 3: Get Involved -->
					<div class="footer-column-connect">
						<h4 class="footer-column-title">Get Involved</h4>
						<a href="/nomination-form/index.html" class="footer-cta-link">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
								<path d="M12 5v14M5 12h14"/>
							</svg>
							Nominate Someone
						</a>
						<div class="footer-social-icons">
							<a href="https://www.facebook.com/AnnualHoustonHumanitarianAwards" target="_blank" rel="noopener" class="footer-social-icon" aria-label="Facebook">
								<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: currentColor;">
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
								</svg>
							</a>
							<a href="https://www.instagram.com/annualhha" target="_blank" rel="noopener" class="footer-social-icon" aria-label="Instagram">
								<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2;">
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
	<script src="/wp-content/themes/unified-footer.js"></script>`;

const footerCssLink = '<link rel="stylesheet" href="/wp-content/themes/unified-footer.css" type="text/css" media="all" />';

// List of all index.html files
const files = [
	'annualhha.com/index.html',
	'annualhha.com/about-ahha/index.html',
	'annualhha.com/nomination-form/index.html',
	'annualhha.com/contact-us/index.html',
	'annualhha.com/contact/index.html',
	'annualhha.com/ahha-honorees/index.html',
	'annualhha.com/gallery/index.html',
	'annualhha.com/our-sponsors/index.html',
	'annualhha.com/2020-honorees/index.html',
	'annualhha.com/2021-honorees/index.html',
	'annualhha.com/2022-honorees/index.html',
	'annualhha.com/2015-honorees/index.html',
	'annualhha.com/2016-ahha-honorees/index.html',
	'annualhha.com/2017-honorees/index.html',
	'annualhha.com/2018-honorees/index.html',
	'annualhha.com/2019-honorees/index.html',
	'annualhha.com/2015-gallery/index.html',
	'annualhha.com/2016-gallery/index.html',
	'annualhha.com/2017-gallery/index.html',
	'annualhha.com/2018-gallery/index.html',
	'annualhha.com/2019-gallery/index.html',
	'annualhha.com/2020-ahha-gallery/index.html',
	'annualhha.com/feed/index.html',
	'annualhha.com/comments/feed/index.html'
];

let updated = 0;
let skipped = [];
let errors = [];

files.forEach(file => {
	const filePath = path.join(__dirname, file);
	
	if (!fs.existsSync(filePath)) {
		skipped.push(`${file} (not found)`);
		return;
	}
	
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let modified = false;
		
		// 1. Check and add footer CSS link in <head>
		if (!content.includes('unified-footer.css')) {
			// Find </head> or <body> and insert before
			const headMatch = content.match(/<\/head>/i);
			if (headMatch) {
				const insertPos = headMatch.index;
				content = content.slice(0, insertPos) + '\n\t' + footerCssLink + '\n' + content.slice(insertPos);
				modified = true;
			}
		}
		
		// 2. Remove existing footer blocks (any variation)
		const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/gi;
		const oldContentForFooter = content;
		content = content.replace(footerRegex, '');
		if (content !== oldContentForFooter) {
			modified = true;
		}
		
		// 3. Remove unified-footer.js script lines
		const scriptRegex = /<script[^>]*unified-footer\.js[^>]*><\/script>/gi;
		const oldContent = content;
		content = content.replace(scriptRegex, '');
		if (content !== oldContent) {
			modified = true;
		}
		
		// 4. Fix broken paths: /..wp-content/ or /../../../../../wp-content/ -> /wp-content/
		const brokenPathRegex = /\/\.+\/wp-content\//g;
		const oldContent2 = content;
		content = content.replace(brokenPathRegex, '/wp-content/');
		if (content !== oldContent2) {
			modified = true;
		}
		
		// 5. Insert standardized footer before </body>
		const bodyCloseMatch = content.match(/<\/body>/i);
		if (bodyCloseMatch) {
			const insertPos = bodyCloseMatch.index;
			content = content.slice(0, insertPos) + '\n\t' + footerContent + '\n' + content.slice(insertPos);
			modified = true;
		} else {
			// If no </body> tag, append at the end
			content += '\n\t' + footerContent + '\n';
			modified = true;
		}
		
		if (modified) {
			fs.writeFileSync(filePath, content, 'utf8');
			updated++;
			console.log(`✓ Updated: ${file}`);
		} else {
			console.log(`- No changes: ${file}`);
		}
		
	} catch (error) {
		errors.push(`${file}: ${error.message}`);
		console.error(`✗ Error processing ${file}: ${error.message}`);
	}
});

console.log('\n=== Summary ===');
console.log(`Files updated: ${updated}`);
console.log(`Files skipped: ${skipped.length}`);
if (skipped.length > 0) {
	console.log('Skipped files:');
	skipped.forEach(f => console.log(`  - ${f}`));
}
if (errors.length > 0) {
	console.log(`Errors: ${errors.length}`);
	errors.forEach(e => console.log(`  - ${e}`));
}

