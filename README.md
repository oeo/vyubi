# vyubi - virtual yubikey

A software implementation of YubiKey functionality that generates one-time passwords (OTP) and types them via native keyboard events, just like a hardware YubiKey.

## Features

- **YubiKey OTP**: Generates authentic 44-character modhex strings like real YubiKeys
- **TOTP**: Time-based 6-digit codes compatible with Google Authenticator
- **HOTP**: Counter-based 6-digit codes with persistent counter storage
- **Static passwords**: Fixed password output
- **Native keyboard typing**: Types characters like a real USB device
- **Global hotkeys**: System-wide keyboard shortcuts
- **Multiple slots**: Configure up to 2 different identities

## Installation

```bash
# clone the repository
git clone https://github.com/yourusername/vyubi.git
cd vyubi

# install dependencies
bun install

# build native modules (requires python3 and build tools)
bun run build-native

# generate a new yubikey identity (optional)
bun run generate-yubikey-identity.ts

# copy and configure your secrets
cp .env.vyubi.example .env.vyubi
# edit .env.vyubi with your generated keys or examples
```

## Quick start

### Generate a YubiKey identity

```bash
bun run generate-yubikey-identity.ts
```

This generates secure keys and outputs configuration:

```bash
SLOT1_TYPE=YUBIKEY
SLOT1_SECRET=a4a94f58d030463b3b42125aebd5b199
SLOT1_PUBLIC_ID=jvjjnvducill
SLOT1_PRIVATE_ID=c14790eff112
SLOT1_HOTKEY=cmd+alt+1
```

## Configuration

Edit `.env.vyubi` to configure your slots:

### YubiKey OTP (44-character modhex like real YubiKey)

```bash
SLOT1_TYPE=YUBIKEY
SLOT1_SECRET=a4a94f58d030463b3b42125aebd5b199  # 32 hex chars
SLOT1_PUBLIC_ID=cccccc                         # 12 modhex chars  
SLOT1_PRIVATE_ID=000000000000                  # 12 hex chars
SLOT1_HOTKEY=cmd+alt+1
```
Outputs: `ccccccdrffkivfenjintcldceundjuibhitubi`

### TOTP (6-digit code)

```bash
SLOT1_TYPE=TOTP
SLOT1_SECRET=JBSWY3DPEHPK3PXP  # base32 encoded
SLOT1_HOTKEY=cmd+alt+2
```
Outputs: `123456`

### HOTP (6-digit counter-based)

```bash
SLOT1_TYPE=HOTP
SLOT1_SECRET=JBSWY3DPEHPK3PXP
SLOT1_HOTKEY=cmd+alt+3
SLOT1_COUNTER=0  # optional starting counter
```

### Static password

```bash
SLOT2_TYPE=STATIC
SLOT2_SECRET=my-secure-password
SLOT2_HOTKEY=cmd+alt+4
```

### Output methods

```bash
OUTPUT_METHOD=keyboard  # types like real yubikey (default)
OUTPUT_METHOD=clipboard # copies to clipboard
```

## Hotkey format

Hotkeys use a simple format: `modifier+modifier+key`

Modifiers:
- `cmd` / `command` / `meta` (⌘ on mac)
- `ctrl` / `control`
- `alt` / `option`
- `shift`

Keys:
- Letters: `a-z`
- Numbers: `0-9`
- Function keys: `f1-f12`
- Special: `space`, `enter`, `tab`, `escape`

Examples:
- `cmd+alt+1` - Command + Option + 1 (mac)
- `ctrl+shift+y` - Control + Shift + Y

## Usage

```bash
# start vyubi
bun start

# press your configured hotkey (e.g., cmd+alt+1)
# watch it type the otp just like a real yubikey!
```

The OTP will be typed character-by-character into the active field, exactly like a physical YubiKey.

## Development

```bash
# run tests
bun test

# development mode with auto-reload
bun dev

# rebuild native modules
bun run build-native

# generate new identity
bun run generate-yubikey-identity.ts
```

## Using with websites

### For YubiKey OTP

Services that support YubiKey OTP:
- LastPass
- KeePass  
- Bitwarden (premium)
- Self-hosted validation servers

Generate an identity and register the public ID with the service.

### For TOTP (Google Authenticator)

1. When setting up 2FA, look for "Can't scan QR code?"
2. Copy the base32 secret
3. Add to `.env.vyubi` as TOTP type

### Running your own validation server

- [yubikey-val](https://github.com/Yubico/yubikey-val) - Official validation
- [yubiauth](https://github.com/Yubico/yubiauth) - Authentication backend

## Security

### Generating secure identities

Always use the provided script:

```bash
bun run generate-yubikey-identity.ts
```

This uses cryptographically secure random generation.

### File permissions

```bash
chmod 600 .env.vyubi  # owner read/write only
```

### Best practices

- **Never commit `.env.vyubi` to version control**
- Treat secrets like SSH private keys
- Use different identities for different services  
- For production security, use hardware YubiKeys
- The public ID is safe to share (it's in every OTP)

## Platform requirements

### macOS

Grant accessibility permissions:
1. System Settings → Privacy & Security → Accessibility
2. Add your terminal app (Terminal.app, iTerm2, etc.)
3. Enable the checkbox

### Linux

```bash
sudo apt-get install libx11-dev libxtst-dev
```

### Windows

Install Visual Studio Build Tools for native compilation.

### Build requirements

- Python 3.x
- C++ compiler
- macOS: Xcode Command Line Tools
- Linux: build-essential
- Windows: Visual Studio Build Tools

## Troubleshooting

### "Failed to create event tap" on macOS

Grant accessibility permissions (see Platform requirements).

### Hotkeys not working

1. Check accessibility permissions (macOS)
2. Verify no other app uses the same hotkey
3. Try simpler hotkeys like `ctrl+1`
4. Run with `sudo` if needed

### Keyboard typing not working

1. Rebuild native modules: `bun run build-native`
2. Check active app accepts keyboard input
3. Try clipboard mode: `OUTPUT_METHOD=clipboard`

### OTP codes not matching

- Ensure system time is synchronized
- TOTP uses 30-second windows
- Verify base32 encoding for TOTP/HOTP

## License

MIT
