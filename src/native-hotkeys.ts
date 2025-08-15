import { HotkeyConfig } from './types';

// native module interface
interface NativeHotkeys {
  registerHotkey(hotkey: string, callback: () => void): void;
  startListening(): void;
  stopListening(): void;
}

let nativeModule: NativeHotkeys | null = null;

// try to load the native module
try {
  nativeModule = require('../build/Release/hotkeys.node');
} catch (err) {
  console.error('failed to load native hotkey module:', err);
}

export class NativeHotkeyManager {
  private callbacks: Map<string, () => void>;
  private isListening: boolean;

  constructor() {
    this.callbacks = new Map();
    this.isListening = false;
    
    if (!nativeModule) {
      throw new Error('native hotkey module not available');
    }
  }

  start() {
    if (this.isListening || !nativeModule) return;
    
    this.isListening = true;
    nativeModule.startListening();
    console.log('native hotkey listener started');
  }

  registerHotkey(hotkey: string, callback: () => void) {
    if (!nativeModule) return;
    
    // store callback
    this.callbacks.set(hotkey.toLowerCase(), callback);
    
    // register with native module
    nativeModule.registerHotkey(hotkey.toLowerCase(), callback);
    console.log(`registered hotkey: ${hotkey}`);
  }

  stop() {
    if (!this.isListening || !nativeModule) return;
    
    nativeModule.stopListening();
    this.isListening = false;
    console.log('native hotkey listener stopped');
  }
}