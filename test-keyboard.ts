import { NativeKeyboard } from './src/native-keyboard';

console.log('testing native keyboard typing...');
console.log('text will be typed in 3 seconds...\n');

const keyboard = new NativeKeyboard();

if (!keyboard.isAvailable()) {
  console.error('native keyboard module not available');
  process.exit(1);
}

setTimeout(() => {
  console.log('typing yubikey otp...');
  
  // type a sample yubikey otp string
  const otp = 'ccccccdrffkivfenjintcldceundjuibhitubi';
  keyboard.typeString(otp, 20); // 20ms delay between chars for fast typing
  
  console.log('\ndone! the otp was typed');
}, 3000);