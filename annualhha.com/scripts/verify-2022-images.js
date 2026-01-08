#!/usr/bin/env node

/**
 * Verification script for 2022 Honorees images
 * Reads the 2022 honorees HTML, extracts all /img/... URLs,
 * and verifies each exists in /public with the same relative path
 */

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../2022-honorees/index.html');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(pagePath)) {
  console.error('❌ Error: 2022-honorees/index.html not found');
  process.exit(1);
}

if (!fs.existsSync(publicDir)) {
  console.error('❌ Error: public directory not found');
  process.exit(1);
}

const content = fs.readFileSync(pagePath, 'utf8');

// Extract all /img/ paths from the HTML
const imgPatterns = [
  /src=["']\/img\/([^"']+)["']/g,
  /background-image:\s*url\(["']\/img\/([^"']+)["']\)/g
];

const imagePaths = new Set();

imgPatterns.forEach(pattern => {
  let match;
  while ((match = pattern.exec(content)) !== null) {
    // Add 'img/' prefix since files are in public/img/
    imagePaths.add('img/' + match[1]);
  }
});

// Check each path exists
let allExist = true;
const missing = [];

imagePaths.forEach(imgPath => {
  const fullPath = path.join(publicDir, imgPath);
  if (!fs.existsSync(fullPath)) {
    allExist = false;
    missing.push(imgPath);
  }
});

if (!allExist) {
  console.error('❌ FAILED: Some image files are missing from /public:');
  missing.forEach(path => {
    console.error(`   Missing: /public/${path}`);
  });
  console.error(`\nTotal missing: ${missing.length} out of ${imagePaths.size} images`);
  process.exit(1);
} else {
  console.log(`✅ PASSED: All ${imagePaths.size} image files exist in /public`);
  console.log('\nVerified files:');
  Array.from(imagePaths).sort().forEach(imgPath => {
    console.log(`   ✓ /public/${imgPath}`);
  });
  process.exit(0);
}

