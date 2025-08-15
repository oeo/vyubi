import { GlobalKeyboardListener } from 'node-global-key-listener';
import { HotkeyConfig } from './types';

export class HotkeyManager {
  private listener: GlobalKeyboardListener;
  private callbacks: Map<string, () => void>;
  private activeKeys: Set<string>;

  constructor() {
    this.listener = new GlobalKeyboardListener();
    this.callbacks = new Map();
    this.activeKeys = new Set();
    
    this.setupListener();
  }

  private setupListener() {
    this.listener.addListener((e, down) => {
      const { name, state } = e;
      const keyName = name.toUpperCase();
      
      if (state === 'DOWN') {
        // normalize key names
        if (keyName === 'LEFT CTRL' || keyName === 'RIGHT CTRL') {
          this.activeKeys.add('ctrl');
        } else if (keyName === 'LEFT ALT' || keyName === 'RIGHT ALT') {
          this.activeKeys.add('alt');
        } else if (keyName === 'LEFT SHIFT' || keyName === 'RIGHT SHIFT') {
          this.activeKeys.add('shift');
        } else if (keyName === 'LEFT META' || keyName === 'RIGHT META') {
          this.activeKeys.add('cmd');
        } else {
          this.activeKeys.add(keyName.toLowerCase());
        }
        this.checkHotkeys();
      } else if (state === 'UP') {
        // clear on key up
        if (keyName === 'LEFT CTRL' || keyName === 'RIGHT CTRL') {
          this.activeKeys.delete('ctrl');
        } else if (keyName === 'LEFT ALT' || keyName === 'RIGHT ALT') {
          this.activeKeys.delete('alt');
        } else if (keyName === 'LEFT SHIFT' || keyName === 'RIGHT SHIFT') {
          this.activeKeys.delete('shift');
        } else if (keyName === 'LEFT META' || keyName === 'RIGHT META') {
          this.activeKeys.delete('cmd');
        } else {
          this.activeKeys.delete(keyName.toLowerCase());
        }
      }
    });
  }

  private parseHotkey(hotkey: string): HotkeyConfig {
    const parts = hotkey.toLowerCase().split('+').map(p => p.trim());
    const modifiers: string[] = [];
    let key = '';

    for (const part of parts) {
      if (['cmd', 'command', 'meta', 'ctrl', 'control', 'alt', 'option', 'shift'].includes(part)) {
        // store simplified modifier names
        if (part === 'cmd' || part === 'command' || part === 'meta') {
          modifiers.push('cmd');
        } else if (part === 'ctrl' || part === 'control') {
          modifiers.push('ctrl');
        } else if (part === 'alt' || part === 'option') {
          modifiers.push('alt');
        } else if (part === 'shift') {
          modifiers.push('shift');
        }
      } else {
        key = part;
      }
    }

    return { modifiers, key };
  }

  private checkHotkeys() {
    for (const [hotkey, callback] of this.callbacks) {
      const config = this.parseHotkey(hotkey);
      const allPressed = config.modifiers.every(mod => this.activeKeys.has(mod));
      
      if (allPressed && this.activeKeys.has(config.key)) {
        callback();
        this.activeKeys.clear(); // prevent repeat
      }
    }
  }

  registerHotkey(hotkey: string, callback: () => void) {
    this.callbacks.set(hotkey.toLowerCase(), callback);
    console.log(`registered hotkey: ${hotkey}`);
  }

  stop() {
    this.listener.kill();
  }
}