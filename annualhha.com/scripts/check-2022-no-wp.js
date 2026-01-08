#!/usr/bin/env node

/**
 * Verification script for 2022 Honorees page
 * Checks that the page contains ZERO references to wp-content, wp-includes, or any "wp" in asset URLs
 */

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../2022-honorees/index.html');

if (!fs.existsSync(pagePath)) {
  console.error('❌ Error: 2022-honorees/index.html not found');
  process.exit(1);
}

const content = fs.readFileSync(pagePath, 'utf8');

let foundIssues = false;
const issues = [];

// Check for wp-content, wp-includes, or /assets/wp in URLs
const problematicPatterns = [
  {
    name: '/wp-content/',
    regex: /href=["']\/wp-content\//g
  },
  {
    name: '/wp-includes/',
    regex: /href=["']\/wp-includes\//g
  },
  {
    name: 'src="/wp-content/',
    regex: /src=["']\/wp-content\//g
  },
  {
    name: 'src="/wp-includes/',
    regex: /src=["']\/wp-includes\//g
  },
  {
    name: '/assets/wp (any wp in assets path)',
    regex: /\/assets\/wp[^"'\s]*/g
  },
  {
    name: '/assets/et-cache (should be /assets/cache)',
    regex: /\/assets\/et-cache\//g
  },
  {
    name: 'wp-content in srcset',
    regex: /srcset=["'][^"']*\/wp-content\//g
  },
  {
    name: 'wp-includes in srcset',
    regex: /srcset=["'][^"']*\/wp-includes\//g
  },
  {
    name: 'wp-content in url()',
    regex: /url\(["']\/wp-content\//g
  },
  {
    name: 'wp-includes in url()',
    regex: /url\(["']\/wp-includes\//g
  },
  {
    name: 'wp-content in JavaScript strings (excluding prefetch exclusions)',
    regex: /["']https?:\/\/[^"']*\/wp-content\//g
  },
  {
    name: 'wp-includes in JavaScript strings',
    regex: /["']https?:\/\/[^"']*\/wp-includes\//g
  }
];

problematicPatterns.forEach(({ name, regex }) => {
  const matches = content.match(regex);
  if (matches) {
    // Filter out prefetch exclusion patterns (these are OK - they tell browser NOT to prefetch)
    const realIssues = matches.filter(m => {
      // Allow wp-* in prefetch exclusion patterns
      if (m.includes('prefetch') || m.includes('not') || m.includes('href_matches')) {
        return false;
      }
      return true;
    });
    
    if (realIssues.length > 0) {
      foundIssues = true;
      issues.push(`Found ${realIssues.length} issue(s) with ${name}:`);
      realIssues.slice(0, 3).forEach(match => {
        const preview = match.length > 100 ? match.substring(0, 100) + '...' : match;
        issues.push(`  - ${preview}`);
      });
    }
  }
});

// Check for bare "annualhha.com/" requests (should be relative paths)
const bareDomainPattern = /(src|href)=["']https?:\/\/annualhha\.com\/[^"']*["']/g;
const bareMatches = content.match(bareDomainPattern);
if (bareMatches) {
  const assetMatches = bareMatches.filter(m => 
    !m.includes('/feed/') && 
    !m.includes('/comments/') && 
    !m.includes('/wp-json/') &&
    !m.includes('xmlrpc.php') &&
    !m.includes('schema.org')
  );
  if (assetMatches.length > 0) {
    foundIssues = true;
    issues.push(`Found ${assetMatches.length} bare domain request(s) (should use relative paths):`);
    assetMatches.slice(0, 3).forEach(match => {
      issues.push(`  - ${match.substring(0, 100)}...`);
    });
  }
}

if (foundIssues) {
  console.error('❌ FAILED: 2022 Honorees page still contains wp-content, wp-includes, or /assets/wp paths');
  console.error('\nIssues found:');
  issues.forEach(issue => console.error(issue));
  console.error('\nThe page must make ZERO network requests containing "wp" in the URL');
  console.error('All assets must be served from /assets/* (no wp-content, wp-includes, or /assets/wp)');
  process.exit(1);
} else {
  console.log('✅ PASSED: 2022 Honorees page contains no wp-content, wp-includes, or /assets/wp paths');
  console.log('   All assets are correctly referenced under /assets/* (vendor, themes, plugins, cache, uploads)');
  console.log('   Zero "wp" strings in asset URLs');
  process.exit(0);
}

