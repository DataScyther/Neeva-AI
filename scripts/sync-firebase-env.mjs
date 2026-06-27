#!/usr/bin/env node
/**
 * Sync Firebase credentials from google-services.json into .env
 * Usage: npm run firebase:sync-env
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const GOOGLE_SERVICES_PATHS = [
  path.join(root, 'google-services.json'),
  path.join(root, '.expo', 'google-services.json'),
];

function findGoogleServicesPath() {
  return GOOGLE_SERVICES_PATHS.find((filePath) => fs.existsSync(filePath));
}

const googleServicesPath = findGoogleServicesPath();
const envPath = path.join(root, '.env');

if (!googleServicesPath) {
  console.error('Missing google-services.json.');
  console.error('Place it in the project root or .expo/google-services.json');
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
const client = json.client?.[0];
const apiKey = client?.api_key?.[0]?.current_key;
const projectId = json.project_info?.project_id;
const storageBucket = json.project_info?.storage_bucket;
const messagingSenderId = json.project_info?.project_number;
const appId = client?.client_info?.mobilesdk_app_id;

if (!apiKey || !projectId) {
  console.error('google-services.json is missing apiKey or projectId.');
  process.exit(1);
}

const updates = {
  EXPO_PUBLIC_FIREBASE_API_KEY: apiKey,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: `${projectId}.firebaseapp.com`,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket || `${projectId}.firebasestorage.app`,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: String(messagingSenderId),
  EXPO_PUBLIC_FIREBASE_APP_ID: appId,
};

let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

for (const [key, value] of Object.entries(updates)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  if (pattern.test(envContent)) {
    envContent = envContent.replace(pattern, line);
  } else {
    envContent = envContent.trimEnd() + (envContent.endsWith('\n') ? '' : '\n') + line + '\n';
  }
}

fs.writeFileSync(envPath, envContent);
console.log(`Updated .env from ${path.relative(root, googleServicesPath)}:`);
for (const key of Object.keys(updates)) {
  console.log(`  ✓ ${key}`);
}
