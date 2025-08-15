current focus: yubikey otp implementation with native keyboard typing completed

## Phase 1: Project Foundation

### 1.1 Project Initialization
- [x] run `bun init` in vyubi directory
- [x] verify package.json was created
- [x] verify tsconfig.json was created
- [x] test bun runs with `bun --version`

### 1.2 Git Configuration
- [x] create .gitignore file
- [x] add node_modules/ to .gitignore
- [x] add .env.vyubi to .gitignore
- [x] add .env to .gitignore
- [x] add dist/ to .gitignore
- [x] add *.log to .gitignore

### 1.3 Dependencies Installation
- [x] run `bun add base32-encode base32-decode`
- [x] verify dependencies in package.json

### 1.4 Project Structure Creation
- [x] create src/ directory
- [x] create src/config.ts file
- [x] create src/otp.ts file
- [x] create src/types.ts file
- [x] create tests/ directory

## Phase 2: Configuration System

### 2.1 Type Definitions
- [x] define OtpType enum (TOTP, HOTP, STATIC)
- [x] define SlotConfig interface
- [x] define VyubiConfig interface
- [x] define HotkeyConfig interface
- [x] export all types from types.ts

### 2.2 Environment File Template
- [x] create .env.vyubi.example file
- [x] add SLOT1_TYPE=TOTP comment
- [x] add SLOT1_SECRET=BASE32SECRETHERE comment
- [x] add SLOT1_HOTKEY=cmd+alt+1 comment  
- [x] add SLOT2_TYPE=STATIC comment
- [x] add SLOT2_SECRET=staticpassword comment
- [x] add SLOT2_HOTKEY=cmd+alt+2 comment
- [x] add OUTPUT_METHOD=keyboard comment

### 2.3 Config Loader Implementation
- [x] create loadConfig function
- [x] implement .env.vyubi path resolution
- [x] check if .env.vyubi exists
- [x] load environment variables with bun
- [x] create config validation function
- [x] validate SLOT1_TYPE is valid enum value
- [x] validate SLOT1_SECRET exists if slot configured
- [x] validate SLOT2_TYPE is valid enum value
- [x] validate SLOT2_SECRET exists if slot configured
- [x] parse hotkey strings
- [x] return typed VyubiConfig object
- [x] export loadConfig function

### 2.4 Config Error Handling
- [x] create ConfigError class
- [x] handle missing .env.vyubi file
- [x] provide helpful error for missing secrets
- [x] validate base32 format for TOTP/HOTP
- [x] add example creation prompt if missing

## Phase 3: OTP Core Implementation

### 3.1 TOTP Implementation
- [x] create generateTOTP function
- [x] import base32-decode
- [x] decode base32 secret to buffer
- [x] get current unix timestamp
- [x] calculate time counter (30 second window)
- [x] create hmac-sha1 with secret
- [x] update hmac with time counter bytes
- [x] get hmac digest
- [x] implement dynamic truncation
- [x] extract 4 bytes from offset
- [x] mask and convert to 6-digit code
- [x] add zero padding if needed
- [x] return formatted code

### 3.2 HOTP Implementation  
- [x] create generateHOTP function
- [x] accept counter parameter
- [x] decode base32 secret
- [x] convert counter to 8-byte buffer
- [x] create hmac-sha1 with secret
- [x] update hmac with counter bytes
- [x] implement same truncation as TOTP
- [x] return formatted code

### 3.3 Static Password Handler
- [x] create generateStatic function
- [x] simply return the stored secret
- [x] no transformation needed

### 3.4 OTP Dispatcher
- [x] create generateOTP main function
- [x] accept SlotConfig parameter
- [x] switch on type field
- [x] call generateTOTP for TOTP type
- [x] call generateHOTP for HOTP type
- [x] call generateStatic for STATIC type
- [x] handle unknown type error
- [x] export generateOTP function

### 3.5 Counter Management for HOTP
- [x] create .vyubi-state.json file handler
- [x] implement readCounter function
- [x] implement incrementCounter function
- [x] handle missing state file

## Phase 4: Basic Testing

### 4.1 OTP Test Setup
- [x] create tests/otp.test.ts
- [x] import test from bun:test
- [x] import expect from bun:test

### 4.2 TOTP Tests
- [x] test with known RFC test vector
- [x] use secret "12345678901234567890" 
- [x] verify produces 6-digit code
- [x] test with example secret

### 4.3 HOTP Tests
- [x] test with RFC test vectors
- [x] test counter 0 produces expected code
- [x] test counter 1 produces expected code
- [x] verify counter increments work

### 4.4 Config Tests
- [ ] test valid config loads correctly
- [ ] test missing file error handling
- [ ] test invalid type error handling
- [ ] test missing secret error handling

## Phase 5: Hotkey System

### 5.1 Hotkey Library Setup
- [x] run `bun add node-global-key-listener`
- [x] create src/hotkeys.ts file
- [x] import GlobalKeyboardListener

### 5.2 Hotkey Registration
- [x] create HotkeyManager class
- [x] initialize keyboard listener
- [x] create registerHotkey method
- [x] parse hotkey string format
- [x] convert to library key codes
- [x] handle modifier keys (cmd/ctrl/alt/shift)
- [x] store callback functions

### 5.3 Hotkey Event Handling
- [x] implement keydown event listener
- [x] check if key combination matches
- [x] prevent default if matched
- [x] call associated callback
- [x] handle multiple hotkeys

### 5.4 Platform Differences
- [x] detect current platform
- [x] map cmd to ctrl on windows/linux
- [x] map ctrl to cmd on mac if needed
- [x] test on current platform

### 5.5 Native C Implementation
- [x] create native C module for lower-level access
- [x] implement macOS support with Carbon/CoreFoundation
- [x] create node-gyp binding configuration
- [x] build and test native module
- [x] integrate with main application

## Phase 6: Keyboard Output

### 6.1 Output Library Setup
- [x] run `bun add node-key-sender`
- [x] create src/output.ts file
- [x] import key sender library

### 6.2 Keyboard Simulation
- [x] create sendKeys function
- [x] accept string parameter
- [x] split into individual characters
- [x] send each character as keystroke
- [x] add small delay between keys
- [x] handle special characters

### 6.3 Clipboard Alternative
- [x] run `bun add clipboardy`
- [x] create copyToClipboard function  
- [x] implement clipboard write
- [x] add clipboard output option

### 6.4 Output Method Selection
- [x] check OUTPUT_METHOD from config
- [x] use keyboard if "keyboard"
- [x] use clipboard if "clipboard"
- [x] default to keyboard

### 6.5 Native Keyboard Implementation
- [x] create native c module for keyboard typing
- [x] implement macos support with coregraphics
- [x] add realistic typing delays
- [x] integrate with output module
- [x] test keyboard typing functionality

## Phase 7: Main Application

### 7.1 Application Entry Point
- [x] create src/index.ts
- [x] import all modules
- [x] create main function
- [x] wrap in try-catch

### 7.2 Initialization Sequence
- [x] load configuration
- [x] validate configuration
- [x] initialize hotkey manager
- [x] register slot 1 hotkey if configured
- [x] register slot 2 hotkey if configured
- [x] set up OTP generation callbacks

### 7.3 Hotkey Callbacks
- [x] create slot1Handler function
- [x] generate OTP for slot 1
- [x] output via selected method
- [x] create slot2Handler function
- [x] generate OTP for slot 2
- [x] output via selected method
- [x] handle HOTP counter increment

### 7.4 Process Management
- [x] add process.on('SIGINT') handler
- [x] cleanup keyboard listener
- [x] add console message for running state
- [x] add hotkey reminder message
- [x] keep process running with setInterval

## Phase 7.5: YubiKey OTP Format

### 7.5.1 YubiKey OTP Implementation
- [x] create yubikey-otp.ts module
- [x] implement modhex encoding
- [x] generate 44-character otp strings
- [x] add public/private id support
- [x] implement crc16 checksum
- [x] add aes-128 encryption

### 7.5.2 Identity Generation
- [x] create generate-yubikey-identity.ts script
- [x] generate secure random keys
- [x] output configuration format
- [x] provide security guidelines

## Phase 8: Build and Run Scripts

### 8.1 Package Scripts
- [ ] add "start": "bun run src/index.ts"
- [ ] add "dev": "bun --watch src/index.ts"  
- [ ] add "test": "bun test"
- [ ] add "build": "bun build src/index.ts --outfile=dist/vyubi"

### 8.2 First Run Experience
- [ ] detect missing .env.vyubi
- [ ] prompt to create from example
- [ ] copy .env.vyubi.example to .env.vyubi
- [ ] show instructions for configuration
- [ ] exit with helpful message

## Phase 9: Documentation

### 9.1 README.md
- [ ] add project title and description
- [ ] add installation instructions
- [ ] add configuration section
- [ ] add usage examples
- [ ] add security warning
- [ ] add troubleshooting section

### 9.2 Configuration Guide
- [ ] explain each environment variable
- [ ] provide TOTP setup example
- [ ] provide HOTP setup example
- [ ] explain hotkey format
- [ ] list supported modifiers

### 9.3 Security Documentation
- [ ] explain .env security model
- [ ] recommend file permissions
- [ ] compare to ssh key security
- [ ] mention encryption options
- [ ] link to hardware yubikey

## Phase 10: Platform Testing

### 10.1 macOS Testing
- [ ] test hotkey capture
- [ ] test keyboard output
- [ ] verify cmd key mapping
- [ ] test with real TOTP secret
- [ ] compare with authenticator app

### 10.2 Linux Testing
- [ ] test on ubuntu/debian
- [ ] verify x11 dependencies
- [ ] test hotkey capture
- [ ] test keyboard output
- [ ] check permissions needed

### 10.3 Windows Testing
- [ ] test on windows 10/11
- [ ] test hotkey capture
- [ ] test keyboard output
- [ ] verify no admin required
- [ ] test with antivirus software

## Phase 11: Enhancements

### 11.1 Status Indicator
- [ ] add console output on start
- [ ] show configured slots
- [ ] show registered hotkeys
- [ ] add timestamp to output
- [ ] add success confirmation

### 11.2 Error Recovery
- [ ] handle keyboard library failures
- [ ] fallback to clipboard on error
- [ ] retry failed operations
- [ ] add debug mode with verbose output
- [ ] log errors to file if debug enabled

### 11.3 Performance Optimization
- [ ] pre-decode base32 secrets on load
- [ ] cache TOTP for current 30s window
- [ ] minimize library imports
- [ ] test startup time
- [ ] optimize for low memory usage