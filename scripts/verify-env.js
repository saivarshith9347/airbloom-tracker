#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * 
 * Checks if all required environment variables are set correctly
 * Run before deploying to production
 * 
 * Usage:
 *   node scripts/verify-env.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
  'VITE_ADMIN_USERNAME',
  'VITE_ADMIN_PASSWORD_HASH',
];

const OPTIONAL_VARS = [
  'VITE_THINGSPEAK_CHANNEL_ID',
  'VITE_THINGSPEAK_API_KEY',
  'VITE_HOME_LATITUDE',
  'VITE_HOME_LONGITUDE',
  'VITE_HOME_NAME',
];

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('\nCreate .env file by copying .env.example:');
    console.log('  cp .env.example .env');
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach(line => {
    line = line.trim();
    
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    
    if (key && value) {
      env[key] = value;
    }
  });

  return env;
}

function verifyVariables(env) {
  console.log('\n=================================');
  console.log('Environment Variables Check');
  console.log('=================================\n');

  let hasErrors = false;
  let hasWarnings = false;

  // Check required variables
  console.log('Required Variables:');
  REQUIRED_VARS.forEach(varName => {
    const value = env[varName];
    
    if (!value) {
      console.log(`  ❌ ${varName}: NOT SET`);
      hasErrors = true;
    } else if (value.includes('your_') || value.includes('_here')) {
      console.log(`  ⚠️  ${varName}: PLACEHOLDER VALUE`);
      hasWarnings = true;
    } else {
      console.log(`  ✅ ${varName}: SET`);
    }
  });

  // Check optional variables
  console.log('\nOptional Variables:');
  OPTIONAL_VARS.forEach(varName => {
    const value = env[varName];
    
    if (!value) {
      console.log(`  ⚠️  ${varName}: NOT SET (optional)`);
    } else if (value.includes('your_') || value.includes('_here')) {
      console.log(`  ⚠️  ${varName}: PLACEHOLDER VALUE`);
    } else {
      console.log(`  ✅ ${varName}: SET`);
    }
  });

  // Validate password hash format
  console.log('\nValidation:');
  const passwordHash = env['VITE_ADMIN_PASSWORD_HASH'];
  if (passwordHash) {
    if (passwordHash.length === 64 && /^[a-f0-9]+$/.test(passwordHash)) {
      console.log('  ✅ Password hash format is valid (SHA-256)');
    } else {
      console.log('  ❌ Password hash format is invalid');
      console.log('     Expected: 64 character hexadecimal string');
      console.log('     Got:', passwordHash.length, 'characters');
      hasErrors = true;
    }
  }

  // Summary
  console.log('\n=================================');
  if (hasErrors) {
    console.log('❌ ERRORS FOUND - Fix before deploying');
    console.log('\nTo fix:');
    console.log('1. Update .env file with correct values');
    console.log('2. Generate password hash: node scripts/generate-password-hash.js YOUR_PASSWORD');
    console.log('3. Run this script again to verify');
  } else if (hasWarnings) {
    console.log('⚠️  WARNINGS - Review before deploying');
    console.log('\nOptional variables are not set.');
    console.log('The app will work but some features may be limited.');
  } else {
    console.log('✅ ALL CHECKS PASSED');
    console.log('\nYour environment is configured correctly!');
    console.log('\nNext steps:');
    console.log('1. Test login locally: npm run dev');
    console.log('2. Add variables to Vercel dashboard');
    console.log('3. Deploy to production');
  }
  console.log('=================================\n');

  return !hasErrors;
}

function main() {
  console.log('AirBloom Tracker - Environment Verification\n');

  const env = loadEnvFile();
  if (!env) {
    process.exit(1);
  }

  const isValid = verifyVariables(env);
  process.exit(isValid ? 0 : 1);
}

main();
