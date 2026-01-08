#!/usr/bin/env node
/**
 * Fix inline CSS background-image quoting issues
 * Fixes: style="background-image: url("/assets/...");"
 * To: style='background-image: url("/assets/...");'
 */

const fs = require('fs');
const path = require('path');

function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'public') {
            findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function fixHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix: style="background-image: url("/assets/...");"
        // To: style='background-image: url("/assets/...");'
        const problematicPattern = /style="background-image:\s*url\("([^"]+)"\);"/g;
        content = content.replace(problematicPattern, (match, url) => {
            modified = true;
            return `style='background-image: url("${url}");'`;
        });
        
        // Also handle: style="background-image: url('/assets/...');"
        const problematicPattern2 = /style="background-image:\s*url\('([^']+)'\);"/g;
        content = content.replace(problematicPattern2, (match, url) => {
            modified = true;
            return `style='background-image: url("${url}");'`;
        });
        
        // Handle unquoted URLs: style="background-image: url(/assets/...);"
        // This is actually fine, but let's ensure quotes are consistent
        const problematicPattern3 = /style="background-image:\s*url\(([^)]+)\);"/g;
        content = content.replace(problematicPattern3, (match, url) => {
            // If url already has quotes inside, we need to fix the outer quotes
            if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
                modified = true;
                return `style='background-image: url(${url});'`;
            }
            return match;
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    const siteDir = __dirname;
    console.log('Fixing inline CSS background-image quoting issues...\n');
    
    const htmlFiles = findHTMLFiles(siteDir);
    console.log(`Found ${htmlFiles.length} HTML files\n`);
    
    let updated = 0;
    htmlFiles.forEach(file => {
        if (fixHTMLFile(file)) {
            updated++;
            console.log(`✓ Fixed: ${path.relative(siteDir, file)}`);
        }
    });
    
    console.log(`\n✓ Fixed ${updated} files out of ${htmlFiles.length}`);
    console.log('Quote fix complete!');
}

main();

