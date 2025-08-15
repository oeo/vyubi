#!/usr/bin/env bun

import { generateTOTP } from './src/otp';

// test with the example secret
const secret = 'JBSWY3DPEHPK3PXP';
const otp = generateTOTP(secret);

console.log(`generated TOTP: ${otp}`);
console.log(`(this changes every 30 seconds)`);

// generate a few more to show they change
console.log('\nwaiting 30 seconds to show change...');
setTimeout(() => {
  const newOtp = generateTOTP(secret);
  console.log(`new TOTP: ${newOtp}`);
  process.exit(0);
}, 30000);