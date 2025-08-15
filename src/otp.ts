import { createHmac } from 'crypto';
import decode from 'base32-decode';
import { SlotConfig, OtpType } from './types';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateSimpleYubikeyOTP, generateYubikeyOTP } from './yubikey-otp';

export { OtpType } from './types';

const STATE_FILE = join(process.cwd(), '.vyubi-state.json');

interface State {
  counters: {
    slot1?: number;
    slot2?: number;
  };
  yubikey: {
    slot1?: {
      sessionCounter: number;
      useCounter: number;
    };
    slot2?: {
      sessionCounter: number;
      useCounter: number;
    };
  };
}

function loadState(): State {
  if (!existsSync(STATE_FILE)) {
    return { counters: {}, yubikey: {} };
  }
  try {
    const state = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    if (!state.yubikey) state.yubikey = {};
    return state;
  } catch {
    return { counters: {}, yubikey: {} };
  }
}

function saveState(state: State): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function incrementCounter(slot: 'slot1' | 'slot2'): number {
  const state = loadState();
  const currentCounter = state.counters[slot] || 0;
  const newCounter = currentCounter + 1;
  state.counters[slot] = newCounter;
  saveState(state);
  return newCounter;
}

export function getCounter(slot: 'slot1' | 'slot2'): number {
  const state = loadState();
  return state.counters[slot] || 0;
}

function dynamicTruncate(hmac: Buffer): string {
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = 
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

export function generateTOTP(secret: string, timeStep = 30): string {
  const decoded = decode(secret, 'RFC4648');
  const time = Math.floor(Date.now() / 1000 / timeStep);
  
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(time));
  
  const hmac = createHmac('sha1', Buffer.from(decoded));
  hmac.update(timeBuffer);
  const hash = hmac.digest();
  
  return dynamicTruncate(hash);
}

export function generateHOTP(secret: string, counter: number): string {
  const decoded = decode(secret, 'RFC4648');
  
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));
  
  const hmac = createHmac('sha1', Buffer.from(decoded));
  hmac.update(counterBuffer);
  const hash = hmac.digest();
  
  return dynamicTruncate(hash);
}

export function generateStatic(secret: string): string {
  return secret;
}

export function generateOTP(config: SlotConfig, slotName?: 'slot1' | 'slot2'): string {
  switch (config.type) {
    case OtpType.TOTP:
      return generateTOTP(config.secret);
    
    case OtpType.HOTP:
      if (!slotName) {
        throw new Error('Slot name required for HOTP');
      }
      const counter = config.counter ?? getCounter(slotName);
      return generateHOTP(config.secret, counter);
    
    case OtpType.STATIC:
      return generateStatic(config.secret);
    
    case OtpType.YUBIKEY:
      if (!slotName) {
        return generateSimpleYubikeyOTP(config.publicId);
      }
      
      const state = loadState();
      if (!state.yubikey[slotName]) {
        state.yubikey[slotName] = {
          sessionCounter: 1,
          useCounter: 1
        };
      }
      
      const timestamp = Math.floor(Date.now() / 1000) & 0xffffff;
      const otp = generateYubikeyOTP(
        config.publicId || 'vvvvvv',
        config.privateId || '000000000000',
        config.secret,
        state.yubikey[slotName].sessionCounter,
        timestamp,
        state.yubikey[slotName].useCounter
      );
      
      // increment counters
      state.yubikey[slotName].useCounter++;
      if (state.yubikey[slotName].useCounter > 255) {
        state.yubikey[slotName].useCounter = 0;
        state.yubikey[slotName].sessionCounter++;
      }
      saveState(state);
      
      return otp;
    
    default:
      throw new Error(`Unknown OTP type: ${config.type}`);
  }
}