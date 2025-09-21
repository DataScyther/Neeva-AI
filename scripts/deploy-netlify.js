#!/usr/bin/env node

// Script to prepare the application for Netlify deployment
const fs = require('fs');
const path = require('path');

console.log('Preparing application for Netlify deployment...');

// Ensure the dist directory exists
const buildDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log('Created build directory');
}

// Create or update the _redirects file for SPA routing
const redirectsContent = `
/*    /index.html   200
`;
const redirectsFile = path.join(buildDir, '_redirects');

// Also copy to build directory for backward compatibility
const legacyBuildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(legacyBuildDir)) {
  fs.mkdirSync(legacyBuildDir, { recursive: true });
  fs.writeFileSync(path.join(legacyBuildDir, '_redirects'), redirectsContent.trim());
}

fs.writeFileSync(redirectsFile, redirectsContent.trim());
console.log('Created _redirects file for SPA routing');

console.log('Netlify deployment preparation completed!');
console.log('To deploy to Netlify:');
console.log('1. Build the project: npm run build');
console.log('2. Deploy the dist directory to Netlify');