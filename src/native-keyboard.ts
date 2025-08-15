// native keyboard module interface
interface NativeKeyboard {
  typeString(text: string, delay?: number): void;
  typeKey(key: string): void;
}

let keyboardModule: NativeKeyboard | null = null;

// try to load the native module
try {
  keyboardModule = require('../build/Release/keyboard.node');
} catch (err) {
  console.error('failed to load native keyboard module:', err);
}

export class NativeKeyboard {
  private available: boolean;

  constructor() {
    this.available = keyboardModule !== null;
  }

  isAvailable(): boolean {
    return this.available;
  }

  /**
   * type a string of characters with realistic typing speed
   * @param text the text to type
   * @param delay optional delay between characters in ms (default 30)
   */
  typeString(text: string, delay: number = 30): void {
    if (!keyboardModule) {
      throw new Error('native keyboard module not available');
    }
    
    keyboardModule.typeString(text, delay);
  }

  /**
   * type a special key like enter, tab, etc
   * @param key the key name
   */
  typeKey(key: string): void {
    if (!keyboardModule) {
      throw new Error('native keyboard module not available');
    }
    
    keyboardModule.typeKey(key);
  }

  /**
   * type text with enter key at the end
   * @param text the text to type
   */
  typeWithEnter(text: string): void {
    this.typeString(text);
    this.typeKey('enter');
  }
}