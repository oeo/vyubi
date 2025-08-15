#!/usr/bin/env bun
import { randomBytes } from 'crypto';

/**
 * generate a new yubikey identity with secure random keys
 * this creates cryptographically secure keys suitable for use with
 * yubikey otp validation servers
 */

// modhex alphabet used by yubikey
const MODHEX_CHARS = 'cbdefghijklnrtuv';

function toHex(buffer: Buffer): string {
  return buffer.toString('hex');
}

function toModhex(buffer: Buffer): string {
  let result = '';
  for (const byte of buffer) {
    result += MODHEX_CHARS[byte >> 4];
    result += MODHEX_CHARS[byte & 0x0f];
  }
  return result;
}

function generateIdentity() {
  // generate random keys
  const publicId = randomBytes(6);   // 6 bytes = 12 modhex chars
  const privateId = randomBytes(6);  // 6 bytes for private uid
  const secretKey = randomBytes(16); // 16 bytes for aes-128
  
  console.log('generated new yubikey identity');
  console.log('=============================\n');
  
  console.log('public id (modhex):  ' + toModhex(publicId));
  console.log('public id (hex):     ' + toHex(publicId));
  console.log('');
  
  console.log('private id (hex):    ' + toHex(privateId));
  console.log('secret key (hex):    ' + toHex(secretKey));
  console.log('');
  
  console.log('configuration for .env.vyubi:');
  console.log('------------------------------');
  console.log(`SLOT1_TYPE=YUBIKEY`);
  console.log(`SLOT1_SECRET=${toHex(secretKey)}`);
  console.log(`SLOT1_PUBLIC_ID=${toModhex(publicId)}`);
  console.log(`SLOT1_PRIVATE_ID=${toHex(privateId)}`);
  console.log(`SLOT1_HOTKEY=cmd+alt+1`);
  console.log('');
  
  console.log('security notes:');
  console.log('---------------');
  console.log('- keep the secret key and private id secure');
  console.log('- the public id is safe to share (it\'s in every otp)');
  console.log('- use different identities for different services');
  console.log('- for production use, consider hardware yubikeys');
  console.log('');
  
  console.log('validation server setup:');
  console.log('------------------------');
  console.log('if setting up your own validation server:');
  console.log(`  client_id: ${toHex(randomBytes(8))}`);
  console.log(`  api_key:   ${toHex(randomBytes(16))}`);
  console.log('');
  console.log('for yubico cloud (requires real yubikey):');
  console.log('  register at: https://upgrade.yubico.com/getapikey/');
}

// run if called directly
if (import.meta.main) {
  generateIdentity();
}