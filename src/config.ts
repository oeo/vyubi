import { OtpType, SlotConfig, VyubiConfig } from './types';
import { existsSync } from 'fs';
import { join } from 'path';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function parseSlotConfig(slotNumber: 1 | 2): SlotConfig | undefined {
  const prefix = `SLOT${slotNumber}`;
  const type = process.env[`${prefix}_TYPE`] as OtpType;
  const secret = process.env[`${prefix}_SECRET`];
  const hotkey = process.env[`${prefix}_HOTKEY`];

  if (!type && !secret) {
    return undefined;
  }

  if (!type || !secret || !hotkey) {
    throw new ConfigError(
      `Incomplete configuration for slot ${slotNumber}. ` +
      `Ensure ${prefix}_TYPE, ${prefix}_SECRET, and ${prefix}_HOTKEY are all set.`
    );
  }

  if (!Object.values(OtpType).includes(type)) {
    throw new ConfigError(
      `Invalid OTP type for slot ${slotNumber}: ${type}. ` +
      `Must be one of: ${Object.values(OtpType).join(', ')}`
    );
  }

  // validate base32 for TOTP/HOTP
  if ((type === OtpType.TOTP || type === OtpType.HOTP) && secret) {
    const base32Regex = /^[A-Z2-7]+=*$/;
    if (!base32Regex.test(secret)) {
      throw new ConfigError(
        `Invalid base32 secret for slot ${slotNumber}. ` +
        `TOTP/HOTP secrets must be base32 encoded (uppercase A-Z, 2-7).`
      );
    }
  }

  const config: SlotConfig = {
    type,
    secret,
    hotkey
  };

  // add counter for HOTP
  if (type === OtpType.HOTP) {
    const counter = process.env[`${prefix}_COUNTER`];
    config.counter = counter ? parseInt(counter, 10) : 0;
  }

  // add yubikey-specific fields
  if (type === OtpType.YUBIKEY) {
    config.publicId = process.env[`${prefix}_PUBLIC_ID`] || 'vvvvvv';
    config.privateId = process.env[`${prefix}_PRIVATE_ID`] || '000000000000';
  }

  return config;
}

export async function loadConfig(): Promise<VyubiConfig> {
  const envPath = join(process.cwd(), '.env.vyubi');
  
  if (!existsSync(envPath)) {
    const examplePath = join(process.cwd(), '.env.vyubi.example');
    throw new ConfigError(
      `Configuration file not found: ${envPath}\n` +
      `Please create it from the example file:\n` +
      `  cp ${examplePath} ${envPath}\n` +
      `Then edit it with your secret keys.`
    );
  }

  // load .env.vyubi file
  const envFile = await Bun.file(envPath).text();
  const lines = envFile.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
  
  const slot1 = parseSlotConfig(1);
  const slot2 = parseSlotConfig(2);

  if (!slot1 && !slot2) {
    throw new ConfigError(
      'No slots configured. At least one slot must be configured.'
    );
  }

  const outputMethod = (process.env.OUTPUT_METHOD as 'keyboard' | 'clipboard') || 'keyboard';
  
  if (!['keyboard', 'clipboard'].includes(outputMethod)) {
    throw new ConfigError(
      `Invalid OUTPUT_METHOD: ${outputMethod}. Must be 'keyboard' or 'clipboard'.`
    );
  }

  return {
    slots: {
      slot1,
      slot2
    },
    outputMethod
  };
}