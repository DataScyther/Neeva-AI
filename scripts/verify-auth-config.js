#!/usr/bin/env node

// Script to verify authentication configuration
const fs = require('fs');
const path = require('path');

console.log('Verifying authentication configuration...');

// Check auth.ts file
const authFilePath = path.join(__dirname, '..', 'src', 'lib', 'supabase', 'auth.ts');
if (fs.existsSync(authFilePath)) {
  const authContent = fs.readFileSync(authFilePath, 'utf8');
  
  // Check that getRedirectUrl returns the correct URL
  if (authContent.includes("return 'https://neevaai.netlify.app/';")) {
    console.log('✓ Authentication redirect URL is correctly set to Netlify URL');
  } else {
    console.log('✗ Authentication redirect URL is not set correctly');
  }
  
  // Check that there are no localhost references
  if (!authContent.includes('localhost')) {
    console.log('✓ No localhost references found in authentication code');
  } else {
    console.log('✗ Found localhost references in authentication code');
  }
} else {
  console.log('✗ Authentication file not found');
}

// Check documentation files
const docsDir = path.join(__dirname, '..', 'docs');
const requiredDocs = [
  'SUPABASE_REDIRECT_URL_UPDATE.md',
  'SUPABASE_GOOGLE_AUTH_FIX.md',
  'SUPABASE_CAPTCHA_ISSUES.md'
];

requiredDocs.forEach(doc => {
  const docPath = path.join(docsDir, doc);
  if (fs.existsSync(docPath)) {
    console.log(`✓ Documentation file ${doc} exists`);
  } else {
    console.log(`✗ Documentation file ${doc} is missing`);
  }
});

// Check README references
const readmePath = path.join(__dirname, '..', 'README.md');
if (fs.existsSync(readmePath)) {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  if (readmeContent.includes('SUPABASE_REDIRECT_URL_UPDATE.md')) {
    console.log('✓ README references redirect URL update documentation');
  } else {
    console.log('✗ README does not reference redirect URL update documentation');
  }
}

console.log('\nVerification complete!');
console.log('\nNext steps:');
console.log('1. Ensure your Supabase project redirect URLs are updated to use only https://neevaai.netlify.app/');
console.log('2. Deploy your application to Netlify');
console.log('3. Test authentication to verify everything works correctly');