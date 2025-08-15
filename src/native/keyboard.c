#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#ifdef __APPLE__
#include <Carbon/Carbon.h>
#include <CoreGraphics/CoreGraphics.h>

void type_string_mac(const char* str) {
  for (int i = 0; str[i] != '\0'; i++) {
    char ch = str[i];
    CGKeyCode keycode = 0;
    bool shift = false;
    
    // map character to keycode
    switch (ch) {
      // letters
      case 'a': case 'A': keycode = kVK_ANSI_A; shift = (ch == 'A'); break;
      case 'b': case 'B': keycode = kVK_ANSI_B; shift = (ch == 'B'); break;
      case 'c': case 'C': keycode = kVK_ANSI_C; shift = (ch == 'C'); break;
      case 'd': case 'D': keycode = kVK_ANSI_D; shift = (ch == 'D'); break;
      case 'e': case 'E': keycode = kVK_ANSI_E; shift = (ch == 'E'); break;
      case 'f': case 'F': keycode = kVK_ANSI_F; shift = (ch == 'F'); break;
      case 'g': case 'G': keycode = kVK_ANSI_G; shift = (ch == 'G'); break;
      case 'h': case 'H': keycode = kVK_ANSI_H; shift = (ch == 'H'); break;
      case 'i': case 'I': keycode = kVK_ANSI_I; shift = (ch == 'I'); break;
      case 'j': case 'J': keycode = kVK_ANSI_J; shift = (ch == 'J'); break;
      case 'k': case 'K': keycode = kVK_ANSI_K; shift = (ch == 'K'); break;
      case 'l': case 'L': keycode = kVK_ANSI_L; shift = (ch == 'L'); break;
      case 'm': case 'M': keycode = kVK_ANSI_M; shift = (ch == 'M'); break;
      case 'n': case 'N': keycode = kVK_ANSI_N; shift = (ch == 'N'); break;
      case 'o': case 'O': keycode = kVK_ANSI_O; shift = (ch == 'O'); break;
      case 'p': case 'P': keycode = kVK_ANSI_P; shift = (ch == 'P'); break;
      case 'q': case 'Q': keycode = kVK_ANSI_Q; shift = (ch == 'Q'); break;
      case 'r': case 'R': keycode = kVK_ANSI_R; shift = (ch == 'R'); break;
      case 's': case 'S': keycode = kVK_ANSI_S; shift = (ch == 'S'); break;
      case 't': case 'T': keycode = kVK_ANSI_T; shift = (ch == 'T'); break;
      case 'u': case 'U': keycode = kVK_ANSI_U; shift = (ch == 'U'); break;
      case 'v': case 'V': keycode = kVK_ANSI_V; shift = (ch == 'V'); break;
      case 'w': case 'W': keycode = kVK_ANSI_W; shift = (ch == 'W'); break;
      case 'x': case 'X': keycode = kVK_ANSI_X; shift = (ch == 'X'); break;
      case 'y': case 'Y': keycode = kVK_ANSI_Y; shift = (ch == 'Y'); break;
      case 'z': case 'Z': keycode = kVK_ANSI_Z; shift = (ch == 'Z'); break;
      
      // numbers
      case '0': keycode = kVK_ANSI_0; break;
      case '1': keycode = kVK_ANSI_1; break;
      case '2': keycode = kVK_ANSI_2; break;
      case '3': keycode = kVK_ANSI_3; break;
      case '4': keycode = kVK_ANSI_4; break;
      case '5': keycode = kVK_ANSI_5; break;
      case '6': keycode = kVK_ANSI_6; break;
      case '7': keycode = kVK_ANSI_7; break;
      case '8': keycode = kVK_ANSI_8; break;
      case '9': keycode = kVK_ANSI_9; break;
      
      // special characters
      case ' ': keycode = kVK_Space; break;
      case '-': keycode = kVK_ANSI_Minus; break;
      case '=': keycode = kVK_ANSI_Equal; break;
      case '[': keycode = kVK_ANSI_LeftBracket; break;
      case ']': keycode = kVK_ANSI_RightBracket; break;
      case '\\': keycode = kVK_ANSI_Backslash; break;
      case ';': keycode = kVK_ANSI_Semicolon; break;
      case '\'': keycode = kVK_ANSI_Quote; break;
      case ',': keycode = kVK_ANSI_Comma; break;
      case '.': keycode = kVK_ANSI_Period; break;
      case '/': keycode = kVK_ANSI_Slash; break;
      case '`': keycode = kVK_ANSI_Grave; break;
      case '\n': keycode = kVK_Return; break;
      case '\t': keycode = kVK_Tab; break;
      
      // shifted special characters
      case '!': keycode = kVK_ANSI_1; shift = true; break;
      case '@': keycode = kVK_ANSI_2; shift = true; break;
      case '#': keycode = kVK_ANSI_3; shift = true; break;
      case '$': keycode = kVK_ANSI_4; shift = true; break;
      case '%': keycode = kVK_ANSI_5; shift = true; break;
      case '^': keycode = kVK_ANSI_6; shift = true; break;
      case '&': keycode = kVK_ANSI_7; shift = true; break;
      case '*': keycode = kVK_ANSI_8; shift = true; break;
      case '(': keycode = kVK_ANSI_9; shift = true; break;
      case ')': keycode = kVK_ANSI_0; shift = true; break;
      case '_': keycode = kVK_ANSI_Minus; shift = true; break;
      case '+': keycode = kVK_ANSI_Equal; shift = true; break;
      case '{': keycode = kVK_ANSI_LeftBracket; shift = true; break;
      case '}': keycode = kVK_ANSI_RightBracket; shift = true; break;
      case '|': keycode = kVK_ANSI_Backslash; shift = true; break;
      case ':': keycode = kVK_ANSI_Semicolon; shift = true; break;
      case '"': keycode = kVK_ANSI_Quote; shift = true; break;
      case '<': keycode = kVK_ANSI_Comma; shift = true; break;
      case '>': keycode = kVK_ANSI_Period; shift = true; break;
      case '?': keycode = kVK_ANSI_Slash; shift = true; break;
      case '~': keycode = kVK_ANSI_Grave; shift = true; break;
      
      default:
        continue; // skip unknown characters
    }
    
    // create key events
    CGEventSourceRef source = CGEventSourceCreate(kCGEventSourceStateHIDSystemState);
    
    // press shift if needed
    if (shift) {
      CGEventRef shiftDown = CGEventCreateKeyboardEvent(source, kVK_Shift, true);
      CGEventPost(kCGHIDEventTap, shiftDown);
      CFRelease(shiftDown);
      usleep(10000); // 10ms delay
    }
    
    // press and release the key
    CGEventRef keyDown = CGEventCreateKeyboardEvent(source, keycode, true);
    CGEventRef keyUp = CGEventCreateKeyboardEvent(source, keycode, false);
    
    CGEventPost(kCGHIDEventTap, keyDown);
    usleep(10000); // 10ms delay between press and release
    CGEventPost(kCGHIDEventTap, keyUp);
    
    CFRelease(keyDown);
    CFRelease(keyUp);
    
    // release shift if it was pressed
    if (shift) {
      CGEventRef shiftUp = CGEventCreateKeyboardEvent(source, kVK_Shift, false);
      CGEventPost(kCGHIDEventTap, shiftUp);
      CFRelease(shiftUp);
      usleep(10000); // 10ms delay
    }
    
    CFRelease(source);
    
    // small delay between characters (30ms total per char)
    usleep(20000);
  }
}

#elif defined(__linux__)
#include <X11/Xlib.h>
#include <X11/keysym.h>
#include <X11/extensions/XTest.h>

void type_string_linux(const char* str) {
  Display* display = XOpenDisplay(NULL);
  if (!display) return;
  
  for (int i = 0; str[i] != '\0'; i++) {
    KeySym keysym = XStringToKeysym(&str[i]);
    KeyCode keycode = XKeysymToKeycode(display, keysym);
    
    XTestFakeKeyEvent(display, keycode, True, 0);
    XTestFakeKeyEvent(display, keycode, False, 0);
    XFlush(display);
    
    usleep(30000); // 30ms delay between characters
  }
  
  XCloseDisplay(display);
}

#elif defined(_WIN32)
#include <windows.h>

void type_string_windows(const char* str) {
  for (int i = 0; str[i] != '\0'; i++) {
    INPUT input[2] = {0};
    
    // key down
    input[0].type = INPUT_KEYBOARD;
    input[0].ki.wVk = 0;
    input[0].ki.wScan = str[i];
    input[0].ki.dwFlags = KEYEVENTF_UNICODE;
    
    // key up
    input[1].type = INPUT_KEYBOARD;
    input[1].ki.wVk = 0;
    input[1].ki.wScan = str[i];
    input[1].ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;
    
    SendInput(2, input, sizeof(INPUT));
    Sleep(30); // 30ms delay between characters
  }
}
#endif

napi_value type_string(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  
  if (argc < 1) {
    napi_throw_error(env, NULL, "missing string argument");
    return NULL;
  }
  
  // get string to type
  char str[1024];
  size_t str_len;
  napi_get_value_string_utf8(env, args[0], str, sizeof(str), &str_len);
  
  // get optional delay (default 30ms)
  int delay = 30;
  if (argc >= 2) {
    napi_get_value_int32(env, args[1], &delay);
  }
  
#ifdef __APPLE__
  type_string_mac(str);
#elif defined(__linux__)
  type_string_linux(str);
#elif defined(_WIN32)
  type_string_windows(str);
#endif
  
  return NULL;
}

napi_value type_key(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  
  if (argc < 1) {
    napi_throw_error(env, NULL, "missing key argument");
    return NULL;
  }
  
  char key[32];
  size_t key_len;
  napi_get_value_string_utf8(env, args[0], key, sizeof(key), &key_len);
  
#ifdef __APPLE__
  CGEventSourceRef source = CGEventSourceCreate(kCGEventSourceStateHIDSystemState);
  CGKeyCode keycode = 0;
  
  // map special keys
  if (strcmp(key, "enter") == 0 || strcmp(key, "return") == 0) {
    keycode = kVK_Return;
  } else if (strcmp(key, "tab") == 0) {
    keycode = kVK_Tab;
  } else if (strcmp(key, "space") == 0) {
    keycode = kVK_Space;
  } else if (strcmp(key, "backspace") == 0) {
    keycode = kVK_Delete;
  } else if (strcmp(key, "escape") == 0) {
    keycode = kVK_Escape;
  } else if (strcmp(key, "up") == 0) {
    keycode = kVK_UpArrow;
  } else if (strcmp(key, "down") == 0) {
    keycode = kVK_DownArrow;
  } else if (strcmp(key, "left") == 0) {
    keycode = kVK_LeftArrow;
  } else if (strcmp(key, "right") == 0) {
    keycode = kVK_RightArrow;
  }
  
  if (keycode != 0) {
    CGEventRef keyDown = CGEventCreateKeyboardEvent(source, keycode, true);
    CGEventRef keyUp = CGEventCreateKeyboardEvent(source, keycode, false);
    
    CGEventPost(kCGHIDEventTap, keyDown);
    usleep(10000);
    CGEventPost(kCGHIDEventTap, keyUp);
    
    CFRelease(keyDown);
    CFRelease(keyUp);
  }
  
  CFRelease(source);
#endif
  
  return NULL;
}

napi_value init(napi_env env, napi_value exports) {
  napi_value type_string_fn, type_key_fn;
  
  napi_create_function(env, NULL, 0, type_string, NULL, &type_string_fn);
  napi_create_function(env, NULL, 0, type_key, NULL, &type_key_fn);
  
  napi_set_named_property(env, exports, "typeString", type_string_fn);
  napi_set_named_property(env, exports, "typeKey", type_key_fn);
  
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)