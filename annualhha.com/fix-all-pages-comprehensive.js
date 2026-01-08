const fs = require('fs');
const path = require('path');

// Dark theme CSS to inject
const darkThemeCSS = `
<style id="premium-dark-theme-forced">
html, body, #page-container, #et-main-area, #main-content, .et_pb_section {
    background-color: #050505 !important;
    background-image: none !important;
}
/* Remove Divi gray haze/overlays */
.et_pb_section_video_bg:before, .et_pb_section:before, .et_pb_section:after {
    display: none !important;
    opacity: 0 !important;
}
</style>`;

// Function to make path root-relative
function makeRootRelative(pathStr, currentDir) {
    if (!pathStr || pathStr.startsWith('http://') || pathStr.startsWith('https://') || pathStr.startsWith('//') || pathStr.startsWith('#')) {
        return pathStr;
    }
    
    // Remove query strings
    pathStr = pathStr.split('?')[0];
    
    // If already root-relative, return as is
    if (pathStr.startsWith('/')) {
        return pathStr;
    }
    
    // Calculate depth from root
    const depth = currentDir.split('/').filter(p => p && p !== 'annualhha.com').length;
    
    // Remove leading ../
    let cleanPath = pathStr.replace(/^\.\.\//g, '');
    
    // If path doesn't start with /, make it root-relative
    if (!cleanPath.startsWith('/')) {
        // Count how many ../ were removed
        const upLevels = (pathStr.match(/\.\.\//g) || []).length;
        const actualDepth = Math.max(0, depth - upLevels);
        
        if (actualDepth === 0) {
            cleanPath = '/' + cleanPath;
        } else {
            // Build root path
            cleanPath = '/' + cleanPath;
        }
    }
    
    return cleanPath;
}

// Function to remove query strings from paths
function removeQueryString(pathStr) {
    if (!pathStr) return pathStr;
    return pathStr.split('?')[0].split('#')[0];
}

// Function to fix all paths in HTML content
function fixPaths(html, filePath) {
    const currentDir = path.dirname(filePath).replace(/\\/g, '/');
    
    // Fix img src attributes
    html = html.replace(/<img([^>]*)\ssrc=["']([^"']+)["']/gi, (match, attrs, src) => {
        const fixedSrc = makeRootRelative(src, currentDir);
        return `<img${attrs} src="${fixedSrc}"`;
    });
    
    // Fix img srcset attributes
    html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
        const fixedSrcset = srcset.split(',').map(item => {
            const parts = item.trim().split(/\s+/);
            const url = parts[0];
            const descriptor = parts.slice(1).join(' ');
            const fixedUrl = makeRootRelative(url, currentDir);
            return fixedUrl + (descriptor ? ' ' + descriptor : '');
        }).join(', ');
        return `srcset="${fixedSrcset}"`;
    });
    
    // Fix link href attributes (CSS, etc.)
    html = html.replace(/<link([^>]*)\shref=["']([^"']+)["']/gi, (match, attrs, href) => {
        // Skip external URLs
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
            return match;
        }
        const fixedHref = makeRootRelative(href, currentDir);
        return `<link${attrs} href="${fixedHref}"`;
    });
    
    // Fix script src attributes
    html = html.replace(/<script([^>]*)\ssrc=["']([^"']+)["']/gi, (match, attrs, src) => {
        // Skip external URLs
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
            return match;
        }
        const fixedSrc = makeRootRelative(src, currentDir);
        return `<script${attrs} src="${fixedSrc}"`;
    });
    
    // Fix anchor href attributes (internal links only)
    html = html.replace(/<a([^>]*)\shref=["']([^"']+)["']/gi, (match, attrs, href) => {
        // Skip external URLs, mailto, tel, etc.
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || 
            href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
            return match;
        }
        const fixedHref = makeRootRelative(href, currentDir);
        return `<a${attrs} href="${fixedHref}"`;
    });
    
    // Fix background-image URLs in style attributes
    html = html.replace(/background-image:\s*url\(["']?([^"')]+)["']?\)/gi, (match, url) => {
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return match;
        }
        const fixedUrl = makeRootRelative(url, currentDir);
        return `background-image: url("${fixedUrl}")`;
    });
    
    // Fix style attribute URLs
    html = html.replace(/style=["']([^"']*url\([^)]+\)[^"']*)["']/gi, (match, styleContent) => {
        return match.replace(/url\(["']?([^"')]+)["']?\)/gi, (urlMatch, url) => {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
                return urlMatch;
            }
            const fixedUrl = makeRootRelative(url, currentDir);
            return `url("${fixedUrl}")`;
        });
    });
    
    return html;
}

// Function to inject dark theme CSS
function injectDarkTheme(html) {
    // Check if dark theme CSS already exists
    if (html.includes('premium-dark-theme-forced')) {
        return html;
    }
    
    // Find the </head> tag and insert before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
        html = html.slice(0, headEndIndex) + darkThemeCSS + '\n' + html.slice(headEndIndex);
    }
    
    return html;
}

// Function to standardize footer
function standardizeFooter(html) {
    // Find all footer elements
    const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/gi;
    const footers = [];
    let match;
    
    while ((match = footerRegex.exec(html)) !== null) {
        footers.push({
            full: match[0],
            content: match[1],
            index: match.index
        });
    }
    
    // If there are multiple footers, keep only the first one's content
    let footerContent = '';
    if (footers.length > 0) {
        footerContent = footers[0].content;
    }
    
    // Remove all existing footer elements
    html = html.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
    
    // Remove existing unified-footer.js script if present
    html = html.replace(/<script[^>]*src=["'][^"']*unified-footer\.js[^"']*["'][^>]*><\/script>/gi, '');
    
    // Find the closing </body> tag
    const bodyEndIndex = html.lastIndexOf('</body>');
    if (bodyEndIndex !== -1) {
        const standardFooter = `\n\t<footer id="main-footer" class="premium-unified-footer">${footerContent}\n\t</footer>\n\t<script src="/wp-content/themes/unified-footer.js"></script>`;
        html = html.slice(0, bodyEndIndex) + standardFooter + '\n' + html.slice(bodyEndIndex);
    }
    
    return html;
}

// Main function to process a file
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Fix all paths
        content = fixPaths(content, filePath);
        
        // Inject dark theme CSS
        content = injectDarkTheme(content);
        
        // Standardize footer
        content = standardizeFooter(content);
        
        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`- No changes: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Find all HTML files
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Main execution
const projectRoot = __dirname;
const htmlFiles = findHTMLFiles(projectRoot);

console.log(`Found ${htmlFiles.length} HTML files to process...\n`);

let processed = 0;
htmlFiles.forEach(file => {
    if (processFile(file)) {
        processed++;
    }
});

console.log(`\n✓ Processed ${processed} files with changes`);
console.log(`✓ Total files checked: ${htmlFiles.length}`);

