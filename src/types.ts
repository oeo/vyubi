export enum OtpType {
  TOTP = 'TOTP',
  HOTP = 'HOTP',
  STATIC = 'STATIC',
  YUBIKEY = 'YUBIKEY'
}

export interface SlotConfig {
  type: OtpType;
  secret: string;
  hotkey: string;
  counter?: number; // for HOTP
  publicId?: string; // for YUBIKEY
  privateId?: string; // for YUBIKEY
}

export interface VyubiConfig {
  slots: {
    slot1?: SlotConfig;
    slot2?: SlotConfig;
  };
  outputMethod: 'keyboard' | 'clipboard';
}

export interface HotkeyConfig {
  modifiers: string[];
  key: string;
}