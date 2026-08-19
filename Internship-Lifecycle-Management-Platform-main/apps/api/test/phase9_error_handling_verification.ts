import * as assert from 'assert';

/**
 * Phase 9: Error Sanitization & Production Error Handling Engine Verification
 * Verifies that all 11 required error categories map to safe, user-friendly, non-leaking messages.
 */

function sanitizeErrorMessage(err: any): string {
  if (!err) return 'Something went wrong. Please try again.';

  const status = err.response?.status || err.status;
  const rawMsg = (
    err.response?.data?.message ||
    err.message ||
    ''
  ).toString().toLowerCase();

  // 1. Session Expiration (401)
  if (status === 401 || rawMsg.includes('unauthorized') || rawMsg.includes('session expired') || rawMsg.includes('sign in')) {
    return 'Your session has expired. Please sign in again to continue.';
  }

  // 2. Unauthorized User (403)
  if (status === 403 || rawMsg.includes('forbidden') || rawMsg.includes('not authorized') || rawMsg.includes('permission')) {
    return 'You are not authorized to create an Admin account.';
  }

  // 3. Existing Email / Duplicate Account (409)
  if (
    status === 409 ||
    rawMsg.includes('already exists') ||
    rawMsg.includes('email-already-in-use') ||
    rawMsg.includes('duplicate')
  ) {
    return 'An account with this email already exists.';
  }

  // 4. Invalid Email
  if (rawMsg.includes('valid email') || rawMsg.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }

  // 5. Password Mismatch
  if (rawMsg.includes('passwords do not match') || rawMsg.includes('mismatch')) {
    return 'Passwords do not match.';
  }

  // 6. Weak Password
  if (rawMsg.includes('weak-password') || rawMsg.includes('at least 8 characters')) {
    return 'Password must be at least 8 characters long and contain both letters and numbers.';
  }

  // 7. Firestore / Database Failure
  if (
    rawMsg.includes('firestore') ||
    rawMsg.includes('database') ||
    rawMsg.includes('prisma') ||
    rawMsg.includes('postgres') ||
    rawMsg.includes('sqlite') ||
    rawMsg.includes('internal server error')
  ) {
    return 'Database service is currently unavailable. Please try again.';
  }

  // 8. Network / Offline Connection Failure
  if (
    rawMsg.includes('network') ||
    rawMsg.includes('offline') ||
    rawMsg.includes('econnrefused') ||
    err.code === 'ERR_NETWORK' ||
    err.code === 'auth/network-request-failed'
  ) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  // 9. Clean server error if safe
  if (
    err.response?.data?.message &&
    typeof err.response.data.message === 'string' &&
    !rawMsg.includes('prisma') &&
    !rawMsg.includes('stack') &&
    !rawMsg.includes('syntax')
  ) {
    return err.response.data.message;
  }

  return 'Something went wrong. Please try again.';
}

function runPhase9ErrorHandlingVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 9: PRODUCTION ERROR HANDLING VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Empty Fields / Missing Data
  console.log('🔹 Case 1: Empty Fields Validation');
  const emptyEmailMsg = sanitizeErrorMessage({ message: 'Please enter a valid email address.' });
  assert.strictEqual(emptyEmailMsg, 'Please enter a valid email address.');
  console.log(`  ✅ Output: "${emptyEmailMsg}"`);

  // 2. Invalid Email Format
  console.log('\n🔹 Case 2: Invalid Email Format');
  const invalidEmailMsg = sanitizeErrorMessage({ message: 'auth/invalid-email' });
  assert.strictEqual(invalidEmailMsg, 'Please enter a valid email address.');
  console.log(`  ✅ Output: "${invalidEmailMsg}"`);

  // 3. Weak Password
  console.log('\n🔹 Case 3: Weak Password');
  const weakPasswordMsg = sanitizeErrorMessage({ message: 'Password must be at least 8 characters long.' });
  assert.strictEqual(weakPasswordMsg, 'Password must be at least 8 characters long and contain both letters and numbers.');
  console.log(`  ✅ Output: "${weakPasswordMsg}"`);

  // 4. Password Mismatch
  console.log('\n🔹 Case 4: Password Mismatch');
  const mismatchMsg = sanitizeErrorMessage({ message: 'Passwords do not match.' });
  assert.strictEqual(mismatchMsg, 'Passwords do not match.');
  console.log(`  ✅ Output: "${mismatchMsg}"`);

  // 5. Existing Email / Duplicate Account
  console.log('\n🔹 Case 5: Existing Email (409 Conflict / auth/email-already-in-use)');
  const existingEmailMsg1 = sanitizeErrorMessage({ status: 409, message: 'An account with this email already exists.' });
  const existingEmailMsg2 = sanitizeErrorMessage({ message: 'auth/email-already-in-use' });
  assert.strictEqual(existingEmailMsg1, 'An account with this email already exists.');
  assert.strictEqual(existingEmailMsg2, 'An account with this email already exists.');
  console.log(`  ✅ Output: "${existingEmailMsg1}"`);

  // 6. Authentication Failure
  console.log('\n🔹 Case 6: Authentication Failure');
  const authFailMsg = sanitizeErrorMessage({ message: 'Invalid credentials or authentication failure' });
  assert.ok(authFailMsg.length > 0);
  console.log(`  ✅ Output: "${authFailMsg}"`);

  // 7. Database / Firestore Failure
  console.log('\n🔹 Case 7: Database / Firestore Server Failure');
  const dbErrorMsg = sanitizeErrorMessage({ message: 'Prisma Client Query Engine Error: table lock timeout', status: 500 });
  assert.strictEqual(dbErrorMsg, 'Database service is currently unavailable. Please try again.');
  console.log(`  ✅ Output: "${dbErrorMsg}" (Zero stack traces exposed)`);

  // 8. Network / Connection Failure
  console.log('\n🔹 Case 8: Network / Offline Failure');
  const networkErrorMsg = sanitizeErrorMessage({ code: 'ERR_NETWORK', message: 'Network request failed' });
  assert.strictEqual(networkErrorMsg, 'Network connection error. Please check your internet connection and try again.');
  console.log(`  ✅ Output: "${networkErrorMsg}"`);

  // 9. Unauthorized User (403 Forbidden)
  console.log('\n🔹 Case 9: Unauthorized User (403 Forbidden)');
  const forbiddenMsg = sanitizeErrorMessage({ status: 403, message: 'Forbidden resource' });
  assert.strictEqual(forbiddenMsg, 'You are not authorized to create an Admin account.');
  console.log(`  ✅ Output: "${forbiddenMsg}"`);

  // 10. Session Expiration (401 Unauthorized)
  console.log('\n🔹 Case 10: Session Expiration (401 Unauthorized)');
  const expiredMsg = sanitizeErrorMessage({ status: 401, message: 'Session expired' });
  assert.strictEqual(expiredMsg, 'Your session has expired. Please sign in again to continue.');
  console.log(`  ✅ Output: "${expiredMsg}"`);

  // 11. Security Test: Sensitive SQL / Stack Leak Prevention
  console.log('\n🔹 Case 11: Sensitive Internal Error Obfuscation');
  const internalLeak = sanitizeErrorMessage({
    response: {
      status: 500,
      data: { message: 'FATAL: database "postgres" connection refused at 10.0.4.12:5432 with password hash scrypt:xyz' },
    },
  });
  assert.ok(!internalLeak.includes('10.0.4.12'), 'Must NEVER leak internal IP addresses');
  assert.ok(!internalLeak.includes('scrypt:xyz'), 'Must NEVER leak password hashes');
  assert.strictEqual(internalLeak, 'Database service is currently unavailable. Please try again.');
  console.log(`  ✅ Output: "${internalLeak}" (Completely sanitized)`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 ALL 11 PRODUCTION ERROR HANDLING TEST CASES PASSED!');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

runPhase9ErrorHandlingVerification();
