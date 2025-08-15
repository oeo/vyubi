import { test, expect } from 'bun:test';
import { generateTOTP, generateHOTP, generateStatic } from '../src/otp';

test('generateTOTP with RFC test vector', () => {
  // rfc 6238 test vector
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // "12345678901234567890" in base32
  
  // we can't test exact values without controlling time,
  // but we can verify format
  const otp = generateTOTP(secret);
  expect(otp).toMatch(/^\d{6}$/);
  expect(otp.length).toBe(6);
});

test('generateHOTP with RFC test vectors', () => {
  // rfc 4226 test vectors
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // "12345678901234567890" in base32
  
  // test counter 0
  const otp0 = generateHOTP(secret, 0);
  expect(otp0).toBe('755224');
  
  // test counter 1
  const otp1 = generateHOTP(secret, 1);
  expect(otp1).toBe('287082');
  
  // test counter 2
  const otp2 = generateHOTP(secret, 2);
  expect(otp2).toBe('359152');
  
  // test counter 3
  const otp3 = generateHOTP(secret, 3);
  expect(otp3).toBe('969429');
  
  // test counter 4
  const otp4 = generateHOTP(secret, 4);
  expect(otp4).toBe('338314');
});

test('generateStatic returns the secret unchanged', () => {
  const secret = 'my-static-password';
  const result = generateStatic(secret);
  expect(result).toBe(secret);
});

test('TOTP generates 6 digit codes', () => {
  const secret = 'JBSWY3DPEHPK3PXP';
  const otp = generateTOTP(secret);
  expect(otp).toMatch(/^\d{6}$/);
});

test('HOTP increments properly', () => {
  const secret = 'JBSWY3DPEHPK3PXP';
  const otp1 = generateHOTP(secret, 0);
  const otp2 = generateHOTP(secret, 1);
  const otp3 = generateHOTP(secret, 0);
  
  // same counter should produce same code
  expect(otp1).toBe(otp3);
  // different counter should produce different code
  expect(otp1).not.toBe(otp2);
});