#!/usr/bin/env node
/**
 * Migrate all wp-content and wp-includes paths to /assets/
 * Fix inline CSS quoting issues
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
        
        // 1. Replace /wp-content/ with /assets/
        if (content.includes('/wp-content/')) {
            content = content.replace(/\/wp-content\//g, '/assets/');
            modified = true;
        }
        
        // 2. Replace /wp-includes/ with /assets/wp-includes/
        if (content.includes('/wp-includes/')) {
            content = content.replace(/\/wp-includes\//g, '/assets/wp-includes/');
            modified = true;
        }
        
        // 3. Fix inline CSS background-image quoting issues
        // Match: style="background-image: url("/wp-content/...");"
        // Replace: style='background-image: url("/assets/...");'
        const quoteFixRegex = /style="background-image:\s*url\("(\/[^"]+)";/g;
        content = content.replace(quoteFixRegex, (match, url) => {
            const fixedUrl = url.replace('/wp-content/', '/assets/').replace('/wp-includes/', '/assets/wp-includes/');
            return `style='background-image: url("${fixedUrl}");`;
        });
        
        // Also handle single quotes inside double quotes
        const quoteFixRegex2 = /style="background-image:\s*url\('(\/[^']+)'\);/g;
        content = content.replace(quoteFixRegex2, (match, url) => {
            const fixedUrl = url.replace('/wp-content/', '/assets/').replace('/wp-includes/', '/assets/wp-includes/');
            return `style='background-image: url("${fixedUrl}");`;
        });
        
        // 4. Fix srcset attributes (they already have paths updated from step 1, but ensure consistency)
        // srcset might have multiple URLs separated by commas
        content = content.replace(/srcset="([^"]+)"/g, (match, srcset) => {
            const updated = srcset.replace(/\/wp-content\//g, '/assets/').replace(/\/wp-includes\//g, '/assets/wp-includes/');
            return `srcset="${updated}"`;
        });
        
        // 5. Fix URLs in JSON/LD schema and other data attributes
        content = content.replace(/https?:\/\/[^\/]+\/wp-content\//g, (match) => {
            return match.replace('/wp-content/', '/assets/');
        });
        content = content.replace(/https?:\/\/[^\/]+\/wp-includes\//g, (match) => {
            return match.replace('/wp-includes/', '/assets/wp-includes/');
        });
        
        // 6. Fix URLs in JavaScript variables/strings
        content = content.replace(/"\/wp-content\//g, '"/assets/');
        content = content.replace(/"\/wp-includes\//g, '"/assets/wp-includes/');
        content = content.replace(/\/wp-content\//g, '/assets/');
        content = content.replace(/\/wp-includes\//g, '/assets/wp-includes/');
        
        // 7. Fix speculationrules JSON (has escaped quotes)
        content = content.replace(/\\\/wp-content\\\//g, '\\/assets\\/');
        content = content.replace(/\\\/wp-includes\\\//g, '\\/assets\\/wp-includes\\/');
        
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
    console.log('Starting migration of wp-content and wp-includes paths to /assets/...\n');
    
    const htmlFiles = findHTMLFiles(siteDir);
    console.log(`Found ${htmlFiles.length} HTML files\n`);
    
    let updated = 0;
    htmlFiles.forEach(file => {
        if (fixHTMLFile(file)) {
            updated++;
            console.log(`✓ Updated: ${path.relative(siteDir, file)}`);
        }
    });
    
    console.log(`\n✓ Updated ${updated} files out of ${htmlFiles.length}`);
    console.log('Migration complete!');
}

main();

