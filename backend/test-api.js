/**
 * API Test Script
 * Quick script to test all backend endpoints
 * Run: node test-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testEndpoint(name, url) {
  try {
    logInfo(`Testing: ${name}`);
    const response = await axios.get(url);
    
    if (response.data.success) {
      logSuccess(`${name} - Success`);
      console.log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      logWarning(`${name} - Returned success: false`);
      console.log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    logError(`${name} - Failed`);
    if (error.response) {
      console.log('Response:', error.response.data);
    } else if (error.request) {
      console.log('No response received. Is the server running?');
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  log('🧪 AirBloom Backend API Test Suite', 'blue');
  console.log('='.repeat(60) + '\n');

  logInfo(`Base URL: ${BASE_URL}`);
  logInfo('Make sure the server is running on port 5000\n');

  const results = {
    passed: 0,
    failed: 0
  };

  // Test 1: Health Check
  console.log('\n' + '-'.repeat(60));
  log('Test 1: Health Check', 'yellow');
  console.log('-'.repeat(60));
  const test1 = await testEndpoint('Health Check', `${BASE_URL}/api/data/health`);
  test1 ? results.passed++ : results.failed++;

  // Test 2: Latest Reading
  console.log('\n' + '-'.repeat(60));
  log('Test 2: Latest Reading', 'yellow');
  console.log('-'.repeat(60));
  const test2 = await testEndpoint('Latest Reading', `${BASE_URL}/api/data/latest`);
  test2 ? results.passed++ : results.failed++;

  // Test 3: Historical Data (default)
  console.log('\n' + '-'.repeat(60));
  log('Test 3: Historical Data (default count)', 'yellow');
  console.log('-'.repeat(60));
  const test3 = await testEndpoint('History (default)', `${BASE_URL}/api/data/history`);
  test3 ? results.passed++ : results.failed++;

  // Test 4: Historical Data (custom count)
  console.log('\n' + '-'.repeat(60));
  log('Test 4: Historical Data (count=10)', 'yellow');
  console.log('-'.repeat(60));
  const test4 = await testEndpoint('History (count=10)', `${BASE_URL}/api/data/history?count=10`);
  test4 ? results.passed++ : results.failed++;

  // Test 5: Channel Info
  console.log('\n' + '-'.repeat(60));
  log('Test 5: Channel Information', 'yellow');
  console.log('-'.repeat(60));
  const test5 = await testEndpoint('Channel Info', `${BASE_URL}/api/data/channel-info`);
  test5 ? results.passed++ : results.failed++;

  // Test 6: Root endpoint
  console.log('\n' + '-'.repeat(60));
  log('Test 6: Root Endpoint', 'yellow');
  console.log('-'.repeat(60));
  const test6 = await testEndpoint('Root', `${BASE_URL}/`);
  test6 ? results.passed++ : results.failed++;

  // Summary
  console.log('\n' + '='.repeat(60));
  log('📊 Test Summary', 'blue');
  console.log('='.repeat(60));
  logSuccess(`Passed: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Failed: ${results.failed}`);
  } else {
    logSuccess('All tests passed! 🎉');
  }
  console.log('='.repeat(60) + '\n');

  if (results.failed > 0) {
    logWarning('Some tests failed. Check the output above for details.');
    logInfo('Common issues:');
    console.log('  1. Server not running (run: npm run dev)');
    console.log('  2. Wrong port (check .env file)');
    console.log('  3. ThingSpeak credentials not configured');
    console.log('  4. No data in ThingSpeak channel');
  }
}

// Run tests
runTests().catch(error => {
  logError('Test suite failed to run');
  console.error(error);
  process.exit(1);
});
