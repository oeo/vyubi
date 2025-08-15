import { loadConfig, ConfigError } from './config';
import { generateOTP, incrementCounter, OtpType } from './otp';
import { NativeHotkeyManager } from './native-hotkeys';
import { outputOTP } from './output';

async function main() {
  console.log('vyubi - virtual yubikey');
  console.log('=======================\n');

  try {
    // load configuration
    const config = await loadConfig();
    console.log('configuration loaded successfully\n');

    // initialize native hotkey manager
    const hotkeyManager = new NativeHotkeyManager();
    hotkeyManager.start();

    // register slot 1
    if (config.slots.slot1) {
      const slot1 = config.slots.slot1;
      hotkeyManager.registerHotkey(slot1.hotkey, async () => {
        console.log(`\n[slot 1] generating ${slot1.type}...`);
        try {
          const otp = generateOTP(slot1, 'slot1');
          await outputOTP(otp, config.outputMethod);
          
          // increment counter for HOTP
          if (slot1.type === OtpType.HOTP) {
            incrementCounter('slot1');
          }
        } catch (err) {
          console.error('error generating OTP:', err);
        }
      });
      console.log(`slot 1: ${slot1.type} (${slot1.hotkey})`);
    }

    // register slot 2
    if (config.slots.slot2) {
      const slot2 = config.slots.slot2;
      hotkeyManager.registerHotkey(slot2.hotkey, async () => {
        console.log(`\n[slot 2] generating ${slot2.type}...`);
        try {
          const otp = generateOTP(slot2, 'slot2');
          await outputOTP(otp, config.outputMethod);
          
          // increment counter for HOTP
          if (slot2.type === OtpType.HOTP) {
            incrementCounter('slot2');
          }
        } catch (err) {
          console.error('error generating OTP:', err);
        }
      });
      console.log(`slot 2: ${slot2.type} (${slot2.hotkey})`);
    }

    console.log(`\noutput method: ${config.outputMethod}`);
    console.log('\nvyubi is running. press your hotkeys to generate OTPs.');
    console.log('press ctrl+c to exit.\n');

    // keep process running
    process.on('SIGINT', () => {
      console.log('\nstopping vyubi...');
      hotkeyManager.stop();
      process.exit(0);
    });

    // prevent exit
    setInterval(() => {}, 1000);

  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('configuration error:\n');
      console.error(err.message);
      process.exit(1);
    } else {
      console.error('unexpected error:', err);
      process.exit(1);
    }
  }
}

main();