#!/usr/bin/env node

/**
 * Password Hash Generator for AirBloom Tracker
 * 
 * Usage:
 *   node scripts/generate-password-hash.js YOUR_PASSWORD
 * 
 * Or interactive mode:
 *   node scripts/generate-password-hash.js
 */

const crypto = require('crypto');
const readline = require('readline');

function generateHash(password) {
  if (!password) {
    console.error('Error: Password is required');
    process.exit(1);
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Password provided as argument
    const password = args[0];
    const hash = generateHash(password);
    
    console.log('\n=================================');
    console.log('Password Hash Generated');
    console.log('=================================');
    console.log('\nPassword:', password);
    console.log('SHA-256 Hash:', hash);
    console.log('\nAdd this to your .env file:');
    console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\nOr add to Vercel environment variables:');
    console.log('Key: VITE_ADMIN_PASSWORD_HASH');
    console.log('Value:', hash);
    console.log('=================================\n');
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter password: ', (password) => {
      if (!password) {
        console.error('Error: Password cannot be empty');
        rl.close();
        process.exit(1);
      }

      const hash = generateHash(password);
      
      console.log('\n=================================');
      console.log('Password Hash Generated');
      console.log('=================================');
      console.log('\nSHA-256 Hash:', hash);
      console.log('\nAdd this to your .env file:');
      console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
      console.log('\nOr add to Vercel environment variables:');
      console.log('Key: VITE_ADMIN_PASSWORD_HASH');
      console.log('Value:', hash);
      console.log('=================================\n');
      
      rl.close();
    });
  }
}

main();
