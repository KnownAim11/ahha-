const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, 'partials', 'footer.html');
const footerContent = fs.readFileSync(footerPath, 'utf8');

const cssLink = '<link rel="stylesheet" href="/wp-content/themes/unified-footer.css" type="text/css" media="all" />';

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
  
  // 1. Add footer CSS link in head if missing
  if (!content.includes('unified-footer.css')) {
    // Find </head> and insert before it
    const headEndIndex = content.indexOf('</head>');
    if (headEndIndex !== -1) {
      content = content.slice(0, headEndIndex) + '\n\t' + cssLink + '\n' + content.slice(headEndIndex);
      modified = true;
    }
  }
  
  // 2. Remove existing footer blocks (any variation)
  // Match footer tags with any attributes and content
  const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/gi;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, '');
    modified = true;
  }
  
  // 3. Remove existing unified-footer.js script tags
  const scriptRegex = /<script[^>]*src=["'][^"']*unified-footer\.js[^"']*["'][^>]*><\/script>/gi;
  if (scriptRegex.test(content)) {
    content = content.replace(scriptRegex, '');
    modified = true;
  }
  
  // 4. Normalize broken relative paths to root-based
  // Replace /../wp-content/... or /../../../../../wp-content/... with /wp-content/...
  content = content.replace(/\/\.\.\/+wp-content\//g, '/wp-content/');
  content = content.replace(/\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/wp-content\//g, '/wp-content/');
  
  // 5. Insert footer before </body>
  const bodyEndIndex = content.lastIndexOf('</body>');
  if (bodyEndIndex !== -1) {
    content = content.slice(0, bodyEndIndex) + '\n' + footerContent + '\n' + content.slice(bodyEndIndex);
    modified = true;
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
    skippedCount++;
    skippedFiles.push(path.relative(baseDir, filePath));
  }
});

// Report
console.log('\n' + '='.repeat(60));
console.log('FOOTER FIX REPORT');
console.log('='.repeat(60));
console.log(`Total files found: ${htmlFiles.length}`);
console.log(`Files updated: ${updatedCount}`);
console.log(`Files skipped: ${skippedCount}`);
console.log('\nUpdated files:');
updatedFiles.forEach(f => console.log(`  - ${f}`));
if (skippedFiles.length > 0) {
  console.log('\nSkipped files:');
  skippedFiles.forEach(f => console.log(`  - ${f}`));
}
console.log('='.repeat(60));

