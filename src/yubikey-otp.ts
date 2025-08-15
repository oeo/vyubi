import { createCipheriv, randomBytes } from 'crypto';

// modhex alphabet used by yubikey
const MODHEX_MAP = 'cbdefghijklnrtuv';

/**
 * convert bytes to modhex string
 */
function toModhex(data: Buffer): string {
  let result = '';
  for (const byte of data) {
    result += MODHEX_MAP[byte >> 4];
    result += MODHEX_MAP[byte & 0x0f];
  }
  return result;
}

/**
 * generate a yubikey otp string
 * format: [public_id][aes_block]
 * total: 44 characters in modhex
 */
export function generateYubikeyOTP(
  publicId: string,
  privateId: string,
  secretKey: string,
  sessionCounter: number = 1,
  timestamp: number = 1,
  useCounter: number = 1
): string {
  // ensure public id is 12 chars (6 bytes) in modhex
  const paddedPublicId = publicId.padEnd(12, 'c');
  
  // create the token fields (16 bytes total)
  const token = Buffer.alloc(16);
  
  // private id (6 bytes)
  const privateIdBytes = Buffer.from(privateId.padEnd(12, '0').slice(0, 12), 'hex');
  privateIdBytes.copy(token, 0);
  
  // session counter (2 bytes)
  token.writeUInt16LE(sessionCounter, 6);
  
  // timestamp (3 bytes)
  token.writeUInt16LE(timestamp & 0xffff, 8);
  token[10] = (timestamp >> 16) & 0xff;
  
  // session use counter (1 byte)
  token[11] = useCounter & 0xff;
  
  // random bytes (2 bytes)
  const random = randomBytes(2);
  random.copy(token, 12);
  
  // crc16 checksum (2 bytes)
  const crc = calculateCRC16(token.slice(0, 14));
  token.writeUInt16LE(crc, 14);
  
  // encrypt with aes-128
  const key = Buffer.from(secretKey.padEnd(32, '0').slice(0, 32), 'hex');
  const cipher = createCipheriv('aes-128-ecb', key.slice(0, 16), null);
  cipher.setAutoPadding(false);
  const encrypted = cipher.update(token);
  cipher.final();
  
  // convert to modhex and combine with public id
  return paddedPublicId + toModhex(encrypted);
}

/**
 * crc16 implementation matching yubikey
 */
function calculateCRC16(data: Buffer): number {
  let crc = 0xffff;
  
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      const flag = crc & 1;
      crc >>= 1;
      if (flag) {
        crc ^= 0x8408;
      }
    }
  }
  
  return crc;
}

/**
 * generate a simple yubikey-like otp based on current time
 * this creates a unique otp each time but isn't cryptographically
 * compatible with real yubikey validation servers
 */
export function generateSimpleYubikeyOTP(deviceId: string = 'vvvvvv'): string {
  const now = Date.now();
  const sessionCounter = Math.floor(now / 1000000) & 0xffff;
  const timestamp = Math.floor(now / 1000) & 0xffffff;
  const useCounter = (now % 256);
  
  // use device id as public id (convert to modhex if needed)
  const publicId = deviceId.slice(0, 6).padEnd(6, 'v');
  const modhexPublicId = publicId.split('').map(c => {
    const idx = MODHEX_MAP.indexOf(c.toLowerCase());
    return idx >= 0 ? c : 'c';
  }).join('');
  
  // generate deterministic values for demo
  const privateId = '000000000000';
  const secretKey = '00000000000000000000000000000000';
  
  return generateYubikeyOTP(
    modhexPublicId,
    privateId,
    secretKey,
    sessionCounter,
    timestamp,
    useCounter
  );
}