#!/usr/bin/env bun

import { GlobalKeyboardListener } from 'node-global-key-listener';

console.log('key test - press ctrl+9 to test, ctrl+c to exit\n');

const listener = new GlobalKeyboardListener();

listener.addListener((e) => {
  if (e.state === 'DOWN') {
    console.log(`key: ${e.name}, rawcode: ${e.rawcode}, vkey: ${e.vkey}`);
    
    if (e.name === 'LEFT CTRL' || e.name === 'RIGHT CTRL') {
      console.log('  -> ctrl pressed');
    }
    if (e.name === '9') {
      console.log('  -> 9 pressed');
    }
  }
});

process.on('SIGINT', () => {
  console.log('\nstopping...');
  listener.kill();
  process.exit(0);
});

// keep running
setInterval(() => {}, 1000);