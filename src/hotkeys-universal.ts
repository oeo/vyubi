import { uIOhook, UiohookKey } from 'uiohook-napi';
import { HotkeyConfig } from './types';

export class UniversalHotkeyManager {
  private callbacks: Map<string, () => void>;
  private pressedKeys: Set<number>;
  private isListening: boolean;

  constructor() {
    this.callbacks = new Map();
    this.pressedKeys = new Set();
    this.isListening = false;
  }

  start() {
    if (this.isListening) return;
    
    this.isListening = true;
    
    // register key down handler
    uIOhook.on('keydown', (e) => {
      this.pressedKeys.add(e.keycode);
      this.checkHotkeys();
    });

    // register key up handler
    uIOhook.on('keyup', (e) => {
      this.pressedKeys.delete(e.keycode);
    });

    // start listening
    uIOhook.start();
    console.log('universal hotkey listener started');
  }

  private parseHotkey(hotkey: string): Set<number> {
    const parts = hotkey.toLowerCase().split('+').map(p => p.trim());
    const keycodes = new Set<number>();

    for (const part of parts) {
      // map modifier keys
      if (part === 'cmd' || part === 'command' || part === 'meta') {
        if (process.platform === 'darwin') {
          keycodes.add(UiohookKey.Meta);  // cmd on mac
        } else {
          keycodes.add(UiohookKey.Ctrl);  // ctrl on windows/linux
        }
      } else if (part === 'ctrl' || part === 'control') {
        keycodes.add(UiohookKey.Ctrl);
      } else if (part === 'alt' || part === 'option') {
        keycodes.add(UiohookKey.Alt);
      } else if (part === 'shift') {
        keycodes.add(UiohookKey.Shift);
      }
      // map number keys
      else if (part === '0') keycodes.add(UiohookKey['0']);
      else if (part === '1') keycodes.add(UiohookKey['1']);
      else if (part === '2') keycodes.add(UiohookKey['2']);
      else if (part === '3') keycodes.add(UiohookKey['3']);
      else if (part === '4') keycodes.add(UiohookKey['4']);
      else if (part === '5') keycodes.add(UiohookKey['5']);
      else if (part === '6') keycodes.add(UiohookKey['6']);
      else if (part === '7') keycodes.add(UiohookKey['7']);
      else if (part === '8') keycodes.add(UiohookKey['8']);
      else if (part === '9') keycodes.add(UiohookKey['9']);
      // map letter keys
      else if (part === 'a') keycodes.add(UiohookKey.A);
      else if (part === 'b') keycodes.add(UiohookKey.B);
      else if (part === 'c') keycodes.add(UiohookKey.C);
      else if (part === 'd') keycodes.add(UiohookKey.D);
      else if (part === 'e') keycodes.add(UiohookKey.E);
      else if (part === 'f') keycodes.add(UiohookKey.F);
      else if (part === 'g') keycodes.add(UiohookKey.G);
      else if (part === 'h') keycodes.add(UiohookKey.H);
      else if (part === 'i') keycodes.add(UiohookKey.I);
      else if (part === 'j') keycodes.add(UiohookKey.J);
      else if (part === 'k') keycodes.add(UiohookKey.K);
      else if (part === 'l') keycodes.add(UiohookKey.L);
      else if (part === 'm') keycodes.add(UiohookKey.M);
      else if (part === 'n') keycodes.add(UiohookKey.N);
      else if (part === 'o') keycodes.add(UiohookKey.O);
      else if (part === 'p') keycodes.add(UiohookKey.P);
      else if (part === 'q') keycodes.add(UiohookKey.Q);
      else if (part === 'r') keycodes.add(UiohookKey.R);
      else if (part === 's') keycodes.add(UiohookKey.S);
      else if (part === 't') keycodes.add(UiohookKey.T);
      else if (part === 'u') keycodes.add(UiohookKey.U);
      else if (part === 'v') keycodes.add(UiohookKey.V);
      else if (part === 'w') keycodes.add(UiohookKey.W);
      else if (part === 'x') keycodes.add(UiohookKey.X);
      else if (part === 'y') keycodes.add(UiohookKey.Y);
      else if (part === 'z') keycodes.add(UiohookKey.Z);
      // function keys
      else if (part === 'f1') keycodes.add(UiohookKey.F1);
      else if (part === 'f2') keycodes.add(UiohookKey.F2);
      else if (part === 'f3') keycodes.add(UiohookKey.F3);
      else if (part === 'f4') keycodes.add(UiohookKey.F4);
      else if (part === 'f5') keycodes.add(UiohookKey.F5);
      else if (part === 'f6') keycodes.add(UiohookKey.F6);
      else if (part === 'f7') keycodes.add(UiohookKey.F7);
      else if (part === 'f8') keycodes.add(UiohookKey.F8);
      else if (part === 'f9') keycodes.add(UiohookKey.F9);
      else if (part === 'f10') keycodes.add(UiohookKey.F10);
      else if (part === 'f11') keycodes.add(UiohookKey.F11);
      else if (part === 'f12') keycodes.add(UiohookKey.F12);
      // special keys
      else if (part === 'space') keycodes.add(UiohookKey.Space);
      else if (part === 'enter' || part === 'return') keycodes.add(UiohookKey.Enter);
      else if (part === 'tab') keycodes.add(UiohookKey.Tab);
      else if (part === 'escape' || part === 'esc') keycodes.add(UiohookKey.Escape);
      else if (part === 'backspace') keycodes.add(UiohookKey.Backspace);
      else if (part === 'delete' || part === 'del') keycodes.add(UiohookKey.Delete);
      else if (part === 'home') keycodes.add(UiohookKey.Home);
      else if (part === 'end') keycodes.add(UiohookKey.End);
      else if (part === 'pageup') keycodes.add(UiohookKey.PageUp);
      else if (part === 'pagedown') keycodes.add(UiohookKey.PageDown);
      else if (part === 'up') keycodes.add(UiohookKey.ArrowUp);
      else if (part === 'down') keycodes.add(UiohookKey.ArrowDown);
      else if (part === 'left') keycodes.add(UiohookKey.ArrowLeft);
      else if (part === 'right') keycodes.add(UiohookKey.ArrowRight);
    }

    return keycodes;
  }

  private checkHotkeys() {
    for (const [hotkey, callback] of this.callbacks) {
      const requiredKeys = this.parseHotkey(hotkey);
      
      // check if all required keys are pressed
      let allPressed = true;
      for (const keycode of requiredKeys) {
        if (!this.pressedKeys.has(keycode)) {
          allPressed = false;
          break;
        }
      }
      
      if (allPressed && requiredKeys.size > 0) {
        // execute callback
        callback();
        // clear pressed keys to prevent repeat
        this.pressedKeys.clear();
      }
    }
  }

  registerHotkey(hotkey: string, callback: () => void) {
    this.callbacks.set(hotkey.toLowerCase(), callback);
    console.log(`registered hotkey: ${hotkey}`);
  }

  stop() {
    if (this.isListening) {
      uIOhook.stop();
      this.isListening = false;
      console.log('universal hotkey listener stopped');
    }
  }
}