import { generateSimpleYubikeyOTP, generateYubikeyOTP } from './src/yubikey-otp';

console.log('testing yubikey otp generation\n');

// test simple generation
console.log('simple yubikey otp (auto-generated):');
for (let i = 0; i < 3; i++) {
  const otp = generateSimpleYubikeyOTP('cccccc');
  console.log(`  ${otp} (length: ${otp.length})`);
}

console.log('\nfull yubikey otp (with counters):');
for (let i = 1; i <= 3; i++) {
  const otp = generateYubikeyOTP(
    'cccccc',  // public id (6 chars modhex = 12 chars total)
    '000000000000',  // private id (6 bytes hex)
    '00000000000000000000000000000000',  // aes key (16 bytes hex)
    i,  // session counter
    Date.now() / 1000,  // timestamp
    1   // use counter
  );
  console.log(`  ${otp} (length: ${otp.length})`);
}

console.log('\nexpected: 44 characters in modhex format (c,b,d,e,f,g,h,i,j,k,l,n,r,t,u,v)');