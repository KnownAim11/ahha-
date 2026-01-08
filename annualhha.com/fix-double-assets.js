#!/usr/bin/env node
/**
 * Fix double assets paths: /assets/assets/ -> /assets/
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
        
        // Fix double assets: /assets/assets/ -> /assets/
        if (content.includes('/assets/assets/')) {
            content = content.replace(/\/assets\/assets\//g, '/assets/');
            modified = true;
        }
        
        // Also fix escaped versions in JSON
        if (content.includes('\\/assets\\/assets\\/')) {
            content = content.replace(/\\\/assets\\\/assets\\\//g, '\\/assets\\/');
            modified = true;
        }
        
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
    console.log('Fixing double assets paths...\n');
    
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
    console.log('Double assets fix complete!');
}

main();

