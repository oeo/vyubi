import { UniversalHotkeyManager } from './src/hotkeys-universal';

console.log('testing universal hotkey listener...');
console.log('press ctrl+1, ctrl+2, or cmd+q to test\n');

const manager = new UniversalHotkeyManager();

manager.registerHotkey('ctrl+1', () => {
  console.log('ctrl+1 pressed!');
});

manager.registerHotkey('ctrl+2', () => {
  console.log('ctrl+2 pressed!');
});

manager.registerHotkey('cmd+q', () => {
  console.log('cmd+q pressed! exiting...');
  manager.stop();
  process.exit(0);
});

manager.start();

// keep process running
setInterval(() => {}, 1000);

process.on('SIGINT', () => {
  console.log('\nstopping...');
  manager.stop();
  process.exit(0);
});