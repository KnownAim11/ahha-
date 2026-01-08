const fs = require('fs');
const path = require('path');

// Footer HTML to insert
const footerHTML = `<footer id="main-footer" class="premium-unified-footer">
  <div class="premium-footer-grid">
    <div class="footer-column-mission">
      <img src="/wp-content/uploads/2019/12/TAHHA_LOGO-2.png" alt="Annual Houston Humanitarian Awards" class="footer-logo" />
      <p class="footer-mission-text">Celebrating the unsung heroes of Houston. Dedicated to honoring individuals making a significant impact through action and philanthropy.</p>
    </div>

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

  <div class="footer-copyright-row">
    <p class="footer-copyright-text">© 2026 Annual Houston Humanitarian Awards. All rights reserved.</p>
  </div>
</footer>`;

const footerScript = `<script src="/wp-content/themes/unified-footer.js"></script>`;

// Find all index.html files
function findIndexFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findIndexFiles(filePath, fileList);
    } else if (file === 'index.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Process a single HTML file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. Remove all existing footer blocks (anywhere in the file)
  const footerRegex = /<footer[^>]*id=["']main-footer["'][^>]*>[\s\S]*?<\/footer>/gi;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, '');
    modified = true;
  }
  
  // 2. Remove unified-footer.js script tags (we'll add it back later)
  const scriptRegex = /<script[^>]*src=["'][^"']*unified-footer\.js[^"']*["'][^>]*><\/script>/gi;
  if (scriptRegex.test(content)) {
    content = content.replace(scriptRegex, '');
    modified = true;
  }
  
  // 3. Find where to insert footer: after closing #et-main-area and before closing #page-container
  // Look for closing #et-main-area tag
  const etMainAreaCloseRegex = /<\/div>\s*<!--\s*#et-main-area\s*-->/i;
  const etMainAreaMatch = content.match(etMainAreaCloseRegex);
  
  if (etMainAreaMatch) {
    const etMainAreaCloseIndex = content.indexOf(etMainAreaMatch[0]) + etMainAreaMatch[0].length;
    
    // Find the next #page-container closing tag
    const pageContainerCloseRegex = /<\/div>\s*<!--\s*#page-container\s*-->/i;
    const pageContainerMatch = content.substring(etMainAreaCloseIndex).match(pageContainerCloseRegex);
    
    if (pageContainerMatch) {
      // Insert footer right after #et-main-area closes and before #page-container closes
      const insertPosition = etMainAreaCloseIndex;
      content = content.slice(0, insertPosition) + '\n\n\t' + footerHTML + '\n\n\t' + content.slice(insertPosition);
      modified = true;
    } else {
      // If #page-container doesn't exist, try to find </div> <!-- #page-container --> without comment
      const pageContainerCloseAltRegex = /<\/div>\s*(?:\r?\n\s*)?<\/div>\s*(?:\r?\n\s*)?<\/div>/;
      // Or look for closing #page-container div directly after et-main-area
      const afterEtMainArea = content.substring(etMainAreaCloseIndex);
      const nextCloseDiv = afterEtMainArea.match(/<\/div>/);
      
      if (nextCloseDiv) {
        const insertPosition = etMainAreaCloseIndex + nextCloseDiv.index;
        content = content.slice(0, insertPosition) + '\n\n\t' + footerHTML + '\n\n\t' + content.slice(insertPosition);
        modified = true;
      }
    }
  } else {
    // If #et-main-area doesn't exist, try to find #page-container closing tag directly
    const pageContainerCloseRegex = /<\/div>\s*<!--\s*#page-container\s*-->/i;
    const pageContainerMatch = content.match(pageContainerCloseRegex);
    
    if (pageContainerMatch) {
      const insertPosition = content.indexOf(pageContainerMatch[0]);
      content = content.slice(0, insertPosition) + '\n\n\t' + footerHTML + '\n\n\t' + content.slice(insertPosition);
      modified = true;
    }
  }
  
  // 4. Ensure unified-footer.js is before </body> (and not duplicated)
  const bodyEndIndex = content.lastIndexOf('</body>');
  if (bodyEndIndex !== -1 && !content.substring(bodyEndIndex - 200, bodyEndIndex).includes('unified-footer.js')) {
    content = content.slice(0, bodyEndIndex) + '\n' + footerScript + '\n' + content.slice(bodyEndIndex);
    modified = true;
  }
  
  // 5. Ensure #main-content is closed before #et-main-area
  // Check if #main-content closing tag exists before #et-main-area closing
  const mainContentCloseRegex = /<\/div>\s*<!--\s*#main-content\s*-->/i;
  const mainContentMatch = content.match(mainContentCloseRegex);
  const etMainAreaCloseRegex2 = /<\/div>\s*<!--\s*#et-main-area\s*-->/i;
  const etMainAreaMatch2 = content.match(etMainAreaCloseRegex2);
  
  if (etMainAreaMatch2 && (!mainContentMatch || content.indexOf(mainContentMatch[0]) > content.indexOf(etMainAreaMatch2[0]))) {
    // #main-content is not closed or is closed after #et-main-area - we need to close it
    // Find the last </div> before #et-main-area closes and add #main-content close before #et-main-area close
    const etMainAreaClosePos = content.indexOf(etMainAreaMatch2[0]);
    const beforeEtMainAreaClose = content.substring(0, etMainAreaClosePos);
    
    // Look for opening #main-content tag
    const mainContentOpenRegex = /<div[^>]*id=["']main-content["'][^>]*>/i;
    const mainContentOpenMatch = beforeEtMainAreaClose.match(mainContentOpenRegex);
    
    if (mainContentOpenMatch && !mainContentMatch) {
      // #main-content was opened but never closed - close it before #et-main-area
      content = content.slice(0, etMainAreaClosePos) + '\n\t</div> <!-- #main-content -->\n' + content.slice(etMainAreaClosePos);
      modified = true;
    }
  }
  
  return { content, modified };
}

// Main execution
const baseDir = path.join(__dirname, 'annualhha.com');
const htmlFiles = findIndexFiles(baseDir);

console.log(`Found ${htmlFiles.length} index.html files to process...\n`);

let updatedCount = 0;
let skippedCount = 0;
const updatedFiles = [];
const skippedFiles = [];
const errors = [];

htmlFiles.forEach(filePath => {
  try {
    const { content, modified } = processFile(filePath);
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      const relativePath = path.relative(baseDir, filePath);
      updatedFiles.push(relativePath);
      console.log(`✓ Updated: ${relativePath}`);
    } else {
      skippedCount++;
      const relativePath = path.relative(baseDir, filePath);
      skippedFiles.push(relativePath);
      console.log(`- Skipped (no changes needed): ${relativePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    errors.push({ file: path.relative(baseDir, filePath), error: error.message });
    skippedCount++;
  }
});

// Report
console.log('\n' + '='.repeat(60));
console.log('FOOTER STRUCTURE FIX REPORT');
console.log('='.repeat(60));
console.log(`Total files found: ${htmlFiles.length}`);
console.log(`Files updated: ${updatedCount}`);
console.log(`Files skipped: ${skippedCount}`);
if (errors.length > 0) {
  console.log(`Files with errors: ${errors.length}`);
}

if (updatedFiles.length > 0) {
  console.log('\nUpdated files:');
  updatedFiles.forEach(f => console.log(`  - ${f}`));
}

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}

if (skippedFiles.length > 0 && skippedFiles.length < 10) {
  console.log('\nSkipped files:');
  skippedFiles.forEach(f => console.log(`  - ${f}`));
}

console.log('='.repeat(60));

