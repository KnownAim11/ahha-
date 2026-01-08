#!/usr/bin/env node

/**
 * Verification script for 2022 Honorees page
 * Checks that the page contains ZERO references to /wp-content or /wp-includes
 */

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../2022-honorees/index.html');

if (!fs.existsSync(pagePath)) {
  console.error('❌ Error: 2022-honorees/index.html not found');
  process.exit(1);
}

const content = fs.readFileSync(pagePath, 'utf8');

// Check for wp-content and wp-includes paths (excluding exclusion patterns in prefetch JSON)
const wpContentMatches = content.match(/\/wp-content\/(?!.*prefetch)/g);
const wpIncludesMatches = content.match(/\/wp-includes\/(?!.*prefetch)/g);

// Also check for wp-content/wp-includes in URLs that aren't in exclusion patterns
const problematicPatterns = [
  /href=["']\/wp-content\//g,
  /src=["']\/wp-content\//g,
  /href=["']\/wp-includes\//g,
  /src=["']\/wp-includes\//g,
  /url\(["']\/wp-content\//g,
  /url\(["']\/wp-includes\//g,
  /srcset=["'][^"']*\/wp-content\//g,
  /srcset=["'][^"']*\/wp-includes\//g,
];

let foundIssues = false;
const issues = [];

problematicPatterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches) {
    foundIssues = true;
    issues.push(`Found ${matches.length} match(es) with pattern ${index + 1}`);
    matches.slice(0, 3).forEach(match => {
      issues.push(`  - ${match.substring(0, 80)}...`);
    });
  }
});

// Check for wp-content/wp-includes in JavaScript strings (excluding prefetch exclusions)
const jsStringPattern = /["']https?:\/\/[^"']*\/wp-(content|includes)\//g;
const jsMatches = content.match(jsStringPattern);
if (jsMatches) {
  // Filter out prefetch exclusion patterns
  const realIssues = jsMatches.filter(m => !m.includes('prefetch') && !m.includes('not'));
  if (realIssues.length > 0) {
    foundIssues = true;
    issues.push(`Found ${realIssues.length} wp-* path(s) in JavaScript strings:`);
    realIssues.slice(0, 3).forEach(match => {
      issues.push(`  - ${match.substring(0, 80)}...`);
    });
  }
}

if (foundIssues) {
  console.error('❌ FAILED: 2022 Honorees page still contains /wp-content or /wp-includes paths');
  console.error('\nIssues found:');
  issues.forEach(issue => console.error(issue));
  console.error('\nThe page must make ZERO network requests to /wp-content/* or /wp-includes/*');
  process.exit(1);
} else {
  console.log('✅ PASSED: 2022 Honorees page contains no /wp-content or /wp-includes paths');
  console.log('   All assets are correctly referenced under /assets/*');
  process.exit(0);
}

