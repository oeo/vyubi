import { NativeHotkeyManager } from './src/native-hotkeys';

console.log('testing native hotkey listener...');
console.log('note: you may need to grant accessibility permissions');
console.log('press cmd+1, cmd+2, or cmd+q to test\n');

try {
  const manager = new NativeHotkeyManager();

  manager.registerHotkey('cmd+1', () => {
    console.log('cmd+1 pressed!');
  });

  manager.registerHotkey('cmd+2', () => {
    console.log('cmd+2 pressed!');
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
} catch (err) {
  console.error('error:', err);
  process.exit(1);
}