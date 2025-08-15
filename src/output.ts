import clipboardy from 'clipboardy';
import { NativeKeyboard } from './native-keyboard';

const keyboard = new NativeKeyboard();

export async function sendKeys(text: string): Promise<void> {
  // try native keyboard first
  if (keyboard.isAvailable()) {
    try {
      keyboard.typeString(text, 25); // 25ms delay for realistic typing
      console.log('typed keys successfully');
      return;
    } catch (err) {
      console.error('failed to type keys:', err);
    }
  }
  
  // fallback to clipboard
  console.warn('keyboard output not available, copying to clipboard instead');
  await copyToClipboard(text);
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await clipboardy.write(text);
    console.log('copied to clipboard');
  } catch (err) {
    console.error('failed to copy to clipboard:', err);
  }
}

export async function outputOTP(
  otp: string, 
  method: 'keyboard' | 'clipboard'
): Promise<void> {
  if (method === 'clipboard') {
    await copyToClipboard(otp);
  } else {
    await sendKeys(otp);
  }
}