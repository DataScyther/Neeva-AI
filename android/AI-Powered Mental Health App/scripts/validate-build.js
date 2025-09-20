#!/usr/bin/env node

/**
 * Build Validation Script for Neeva Mental Health App
 * Validates environment, dependencies, and configuration before building APK
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Neeva Mental Health App Build Configuration...\n');

// Check if required files exist
const requiredFiles = [
  '.env',
  'package.json',
  'capacitor.config.ts',
  'vite.config.ts',
  'src/App.tsx',
  'src/utils/openrouter.ts'
];

let validationPassed = true;

// 1. Check required files
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    validationPassed = false;
  }
});

// 2. Check environment variables
console.log('\n🔧 Checking environment variables...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  
  const envVars = [
    'VITE_OPENROUTER_API_KEY',
    'VITE_OPENROUTER_MODEL',
    'VITE_OPENROUTER_BASE_URL'
  ];
  
  envVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`   ✅ ${envVar}`);
    } else {
      console.log(`   ❌ ${envVar} - MISSING!`);
      validationPassed = false;
    }
  });
} else {
  console.log('   ❌ .env file not found!');
  validationPassed = false;
}

// 3. Check package.json dependencies
console.log('\n📦 Checking critical dependencies...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const criticalDeps = [
    '@capacitor/core',
    '@capacitor/android',
    'react',
    'react-dom',
    'vite'
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`   ✅ ${dep}`);
    } else {
      console.log(`   ❌ ${dep} - MISSING!`);
      validationPassed = false;
    }
  });
}

// 4. Check Android configuration
console.log('\n🤖 Checking Android configuration...');
const androidFiles = [
  '../../../android/build.gradle',
  '../../../android/app/build.gradle',
  '../../../android/app/my-release-key.jks'
];

androidFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${path.basename(file)}`);
  } else {
    console.log(`   ❌ ${path.basename(file)} - MISSING!`);
    validationPassed = false;
  }
});

// 5. Final validation result
console.log('\n' + '='.repeat(50));
if (validationPassed) {
  console.log('🎉 BUILD VALIDATION PASSED!');
  console.log('✅ Your Neeva Mental Health App is ready to build.');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run android:debug (for debug APK)');
  console.log('3. Run: npm run android (for release APK)');
} else {
  console.log('❌ BUILD VALIDATION FAILED!');
  console.log('⚠️  Please fix the issues above before building.');
  process.exit(1);
}

console.log('\n📖 For detailed instructions, see README.md and DEBUG.md');
console.log('='.repeat(50));
