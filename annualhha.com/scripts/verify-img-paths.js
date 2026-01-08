#!/usr/bin/env node

/**
 * Verification script for 2022 Honorees images
 * Checks that image files exist at the exact paths used in HTML
 */

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../2022-honorees/index.html');
const imgRoot = path.join(__dirname, '../img');

if (!fs.existsSync(pagePath)) {
  console.error('❌ Error: 2022-honorees/index.html not found');
  process.exit(1);
}

if (!fs.existsSync(imgRoot)) {
  console.error('❌ Error: img directory not found at repo root');
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
    imagePaths.add(match[1]);
  }
});

// Check each path exists
let allExist = true;
const missing = [];

imagePaths.forEach(imgPath => {
  const fullPath = path.join(imgRoot, imgPath);
  if (!fs.existsSync(fullPath)) {
    allExist = false;
    missing.push(imgPath);
  }
});

if (!allExist) {
  console.error('❌ FAILED: Some image files are missing from /img:');
  missing.forEach(path => {
    console.error(`   Missing: img/${path}`);
  });
  console.error(`\nTotal missing: ${missing.length} out of ${imagePaths.size} images`);
  process.exit(1);
} else {
  console.log(`✅ PASSED: All ${imagePaths.size} image files exist in /img`);
  console.log('\nVerified files:');
  Array.from(imagePaths).sort().forEach(imgPath => {
    console.log(`   ✓ img/${imgPath}`);
  });
  process.exit(0);
}

