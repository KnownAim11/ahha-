#!/usr/bin/env node
/**
 * Verification script to check for any remaining wp-content or wp-includes paths
 * This script scans all HTML, CSS, and JS files and fails if it finds any wp-* paths
 */

const fs = require('fs');
const path = require('path');

const wpPatterns = [
    // Match wp-content but NOT /assets/wp-content (negative lookbehind not supported in JS, so use positive match)
    /(?<!\/assets)\/wp-content\//g,
    // Match wp-includes but NOT /assets/wp-includes
    /(?<!\/assets)\/wp-includes\//g,
    // Direct paths without /assets prefix
    /href=["']\/wp-content\//g,
    /href=["']\/wp-includes\//g,
    /src=["']\/wp-content\//g,
    /src=["']\/wp-includes\//g,
    /url\(["']?\/wp-content\//g,
    /url\(["']?\/wp-includes\//g,
    /https?:\/\/[^\/]+\/wp-content\//g,
    /https?:\/\/[^\/]+\/wp-includes\//g,
];

// Alternative: check if path is NOT /assets/wp-* by using a function
function checkContent(content, filePath) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        // Check for /wp-content/ that is NOT /assets/wp-content/
        if (line.match(/(?<!\/assets)\/wp-content\//) || line.includes('/wp-content/') && !line.includes('/assets/wp-content/')) {
            // But make sure it's not already /assets/wp-content/
            if (!line.match(/\/assets\/wp-content\//)) {
                issues.push({
                    match: line.match(/\/wp-content\/[^"'\s\)]*/)?.[0] || '/wp-content/',
                    line: index + 1
                });
            }
        }
        
        // Check for /wp-includes/ that is NOT /assets/wp-includes/
        if (line.includes('/wp-includes/') && !line.includes('/assets/wp-includes/')) {
            issues.push({
                match: line.match(/\/wp-includes\/[^"'\s\)]*/)?.[0] || '/wp-includes/',
                line: index + 1
            });
        }
        
        // Check for href/src with direct wp-* paths (not /assets/)
        if (line.match(/href=["']\/wp-content\//) || line.match(/href=["']\/wp-includes\//)) {
            issues.push({
                match: line.match(/href=["']\/wp-[^"']+/)?.[0] || 'href with wp-*',
                line: index + 1
            });
        }
        if (line.match(/src=["']\/wp-content\//) || line.match(/src=["']\/wp-includes\//)) {
            issues.push({
                match: line.match(/src=["']\/wp-[^"']+/)?.[0] || 'src with wp-*',
                line: index + 1
            });
        }
        
        // Check for full URLs with wp-* (these should be updated)
        if (line.match(/https?:\/\/[^\/]+\/wp-content\//) || line.match(/https?:\/\/[^\/]+\/wp-includes\//)) {
            issues.push({
                match: line.match(/https?:\/\/[^\/]+\/wp-[^"'\s\)]+/)?.[0] || 'URL with wp-*',
                line: index + 1
            });
        }
    });
    
    return issues;
}

// Exclude patterns (like in scripts themselves)
const excludePatterns = [
    /node_modules/,
    /\.git/,
    /public\/assets/,
    /scripts\/check-wp-paths\.js/,
    /migrate-wp-paths\.js/,
    /fix-inline-quotes\.js/,
    /fix-double-assets\.js/,
    /fix-all-pages-comprehensive\.js/,
    /fix-image-paths\.js/,
    /fix-paths-smart\.js/,
    /fix-paths-to-absolute\.js/,
    /fix-all-paths\.js/,
    /fix-srcset-paths\.js/,
    /update-all-pages\.js/,
    /update-all-pages-nav\.js/,
];

function shouldExclude(filePath) {
    return excludePatterns.some(pattern => pattern.test(filePath));
}

function findFiles(dir, fileList = [], extensions = ['.html', '.css', '.js']) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            
            if (shouldExclude(filePath)) {
                return;
            }
            
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                findFiles(filePath, fileList, extensions);
            } else if (extensions.some(ext => file.endsWith(ext))) {
                fileList.push(filePath);
            }
        });
    } catch (error) {
        // Skip directories we can't read
    }
    
    return fileList;
}

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = checkContent(content, filePath);
        return issues;
    } catch (error) {
        return [{ error: error.message }];
    }
}

function main() {
    const siteDir = path.join(__dirname, '..');
    console.log('Checking for wp-content and wp-includes paths...\n');
    
    const files = findFiles(siteDir);
    console.log(`Found ${files.length} files to check\n`);
    
    let totalIssues = 0;
    const filesWithIssues = [];
    
    files.forEach(file => {
        const issues = checkFile(file);
        if (issues.length > 0) {
            totalIssues += issues.length;
            filesWithIssues.push({
                file: path.relative(siteDir, file),
                issues: issues
            });
        }
    });
    
    if (filesWithIssues.length > 0) {
        console.error('❌ Found wp-* paths in the following files:\n');
        filesWithIssues.forEach(({ file, issues }) => {
            console.error(`  ${file}:`);
            issues.forEach(issue => {
                if (issue.error) {
                    console.error(`    Error: ${issue.error}`);
                } else {
                    console.error(`    Line ${issue.line}: ${issue.match}`);
                }
            });
            console.error('');
        });
        console.error(`Total issues: ${totalIssues}`);
        process.exit(1);
    } else {
        console.log('✅ No wp-content or wp-includes paths found!');
        console.log('All paths have been migrated to /assets/');
        process.exit(0);
    }
}

main();

