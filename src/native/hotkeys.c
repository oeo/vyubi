#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <pthread.h>

#ifdef __APPLE__
#include <Carbon/Carbon.h>
#include <CoreFoundation/CoreFoundation.h>
#include <ApplicationServices/ApplicationServices.h>

typedef struct {
  int keycode;
  int modifiers;
  napi_threadsafe_function callback;
} hotkey_binding;

static hotkey_binding* bindings = NULL;
static int binding_count = 0;
static int binding_capacity = 0;
static CFMachPortRef event_tap = NULL;
static CFRunLoopSourceRef run_loop_source = NULL;
static CFRunLoopRef run_loop = NULL;

// key mapping for macOS
int map_key_to_code(const char* key) {
  if (strcmp(key, "a") == 0) return kVK_ANSI_A;
  if (strcmp(key, "b") == 0) return kVK_ANSI_B;
  if (strcmp(key, "c") == 0) return kVK_ANSI_C;
  if (strcmp(key, "d") == 0) return kVK_ANSI_D;
  if (strcmp(key, "e") == 0) return kVK_ANSI_E;
  if (strcmp(key, "f") == 0) return kVK_ANSI_F;
  if (strcmp(key, "g") == 0) return kVK_ANSI_G;
  if (strcmp(key, "h") == 0) return kVK_ANSI_H;
  if (strcmp(key, "i") == 0) return kVK_ANSI_I;
  if (strcmp(key, "j") == 0) return kVK_ANSI_J;
  if (strcmp(key, "k") == 0) return kVK_ANSI_K;
  if (strcmp(key, "l") == 0) return kVK_ANSI_L;
  if (strcmp(key, "m") == 0) return kVK_ANSI_M;
  if (strcmp(key, "n") == 0) return kVK_ANSI_N;
  if (strcmp(key, "o") == 0) return kVK_ANSI_O;
  if (strcmp(key, "p") == 0) return kVK_ANSI_P;
  if (strcmp(key, "q") == 0) return kVK_ANSI_Q;
  if (strcmp(key, "r") == 0) return kVK_ANSI_R;
  if (strcmp(key, "s") == 0) return kVK_ANSI_S;
  if (strcmp(key, "t") == 0) return kVK_ANSI_T;
  if (strcmp(key, "u") == 0) return kVK_ANSI_U;
  if (strcmp(key, "v") == 0) return kVK_ANSI_V;
  if (strcmp(key, "w") == 0) return kVK_ANSI_W;
  if (strcmp(key, "x") == 0) return kVK_ANSI_X;
  if (strcmp(key, "y") == 0) return kVK_ANSI_Y;
  if (strcmp(key, "z") == 0) return kVK_ANSI_Z;
  if (strcmp(key, "0") == 0) return kVK_ANSI_0;
  if (strcmp(key, "1") == 0) return kVK_ANSI_1;
  if (strcmp(key, "2") == 0) return kVK_ANSI_2;
  if (strcmp(key, "3") == 0) return kVK_ANSI_3;
  if (strcmp(key, "4") == 0) return kVK_ANSI_4;
  if (strcmp(key, "5") == 0) return kVK_ANSI_5;
  if (strcmp(key, "6") == 0) return kVK_ANSI_6;
  if (strcmp(key, "7") == 0) return kVK_ANSI_7;
  if (strcmp(key, "8") == 0) return kVK_ANSI_8;
  if (strcmp(key, "9") == 0) return kVK_ANSI_9;
  if (strcmp(key, "space") == 0) return kVK_Space;
  if (strcmp(key, "enter") == 0) return kVK_Return;
  if (strcmp(key, "tab") == 0) return kVK_Tab;
  if (strcmp(key, "escape") == 0) return kVK_Escape;
  if (strcmp(key, "f1") == 0) return kVK_F1;
  if (strcmp(key, "f2") == 0) return kVK_F2;
  if (strcmp(key, "f3") == 0) return kVK_F3;
  if (strcmp(key, "f4") == 0) return kVK_F4;
  if (strcmp(key, "f5") == 0) return kVK_F5;
  if (strcmp(key, "f6") == 0) return kVK_F6;
  if (strcmp(key, "f7") == 0) return kVK_F7;
  if (strcmp(key, "f8") == 0) return kVK_F8;
  if (strcmp(key, "f9") == 0) return kVK_F9;
  if (strcmp(key, "f10") == 0) return kVK_F10;
  if (strcmp(key, "f11") == 0) return kVK_F11;
  if (strcmp(key, "f12") == 0) return kVK_F12;
  return -1;
}

CGEventRef event_callback(CGEventTapProxy proxy, CGEventType type,
                          CGEventRef event, void* refcon) {
  if (type != kCGEventKeyDown) {
    return event;
  }
  
  CGKeyCode keycode = (CGKeyCode)CGEventGetIntegerValueField(event,
                                                     kCGKeyboardEventKeycode);
  CGEventFlags flags = CGEventGetFlags(event);
  
  int modifiers = 0;
  if (flags & kCGEventFlagMaskCommand) modifiers |= 1;
  if (flags & kCGEventFlagMaskControl) modifiers |= 2;
  if (flags & kCGEventFlagMaskAlternate) modifiers |= 4;
  if (flags & kCGEventFlagMaskShift) modifiers |= 8;
  
  // check all bindings
  for (int i = 0; i < binding_count; i++) {
    if (bindings[i].keycode == keycode && 
        bindings[i].modifiers == modifiers) {
      // trigger callback
      napi_call_threadsafe_function(bindings[i].callback, NULL,
                                   napi_tsfn_blocking);
      // consume event
      return NULL;
    }
  }
  
  return event;
}

void* run_loop_thread(void* arg) {
  // create event tap
  CGEventMask event_mask = CGEventMaskBit(kCGEventKeyDown);
  event_tap = CGEventTapCreate(kCGSessionEventTap, kCGHeadInsertEventTap,
                               kCGEventTapOptionDefault, event_mask,
                               event_callback, NULL);
  
  if (!event_tap) {
    fprintf(stderr, "failed to create event tap\n");
    return NULL;
  }
  
  run_loop_source = CFMachPortCreateRunLoopSource(kCFAllocatorDefault,
                                                  event_tap, 0);
  run_loop = CFRunLoopGetCurrent();
  CFRunLoopAddSource(run_loop, run_loop_source, kCFRunLoopCommonModes);
  CGEventTapEnable(event_tap, true);
  
  CFRunLoopRun();
  return NULL;
}

#endif

// parse hotkey string like "cmd+alt+1"
void parse_hotkey(const char* hotkey, int* keycode, int* modifiers) {
  char buffer[256];
  strncpy(buffer, hotkey, sizeof(buffer) - 1);
  buffer[sizeof(buffer) - 1] = '\0';
  
  *keycode = -1;
  *modifiers = 0;
  
  char* token = strtok(buffer, "+");
  while (token != NULL) {
    // convert to lowercase
    for (char* p = token; *p; p++) {
      *p = tolower(*p);
    }
    
    if (strcmp(token, "cmd") == 0 || strcmp(token, "command") == 0) {
      *modifiers |= 1;
    } else if (strcmp(token, "ctrl") == 0 || strcmp(token, "control") == 0) {
      *modifiers |= 2;
    } else if (strcmp(token, "alt") == 0 || strcmp(token, "option") == 0) {
      *modifiers |= 4;
    } else if (strcmp(token, "shift") == 0) {
      *modifiers |= 8;
    } else {
      *keycode = map_key_to_code(token);
    }
    
    token = strtok(NULL, "+");
  }
}

static void call_js_callback(napi_env env, napi_value js_callback,
                             void* context, void* data) {
  napi_value global;
  napi_get_global(env, &global);
  napi_call_function(env, global, js_callback, 0, NULL, NULL);
}

napi_value register_hotkey(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);
  
  if (argc < 2) {
    napi_throw_error(env, NULL, "missing arguments");
    return NULL;
  }
  
  // get hotkey string
  char hotkey[256];
  size_t hotkey_len;
  napi_get_value_string_utf8(env, args[0], hotkey, sizeof(hotkey),
                             &hotkey_len);
  
  // parse hotkey
  int keycode, modifiers;
  parse_hotkey(hotkey, &keycode, &modifiers);
  
  if (keycode == -1) {
    napi_throw_error(env, NULL, "invalid key");
    return NULL;
  }
  
  // grow bindings array if needed
  if (binding_count >= binding_capacity) {
    binding_capacity = binding_capacity ? binding_capacity * 2 : 4;
    bindings = realloc(bindings, binding_capacity * sizeof(hotkey_binding));
  }
  
  // create threadsafe function for callback
  napi_value callback = args[1];
  napi_threadsafe_function tsfn;
  napi_create_threadsafe_function(env, callback, NULL, NULL, 0, 1, NULL,
                                  NULL, NULL, call_js_callback, &tsfn);
  
  // add binding
  bindings[binding_count].keycode = keycode;
  bindings[binding_count].modifiers = modifiers;
  bindings[binding_count].callback = tsfn;
  binding_count++;
  
  return NULL;
}

napi_value start_listening(napi_env env, napi_callback_info info) {
#ifdef __APPLE__
  pthread_t thread;
  pthread_create(&thread, NULL, run_loop_thread, NULL);
  pthread_detach(thread);
#endif
  return NULL;
}

napi_value stop_listening(napi_env env, napi_callback_info info) {
#ifdef __APPLE__
  if (run_loop) {
    CFRunLoopStop(run_loop);
  }
  if (event_tap) {
    CGEventTapEnable(event_tap, false);
  }
  if (run_loop_source && run_loop) {
    CFRunLoopRemoveSource(run_loop, run_loop_source, kCFRunLoopCommonModes);
  }
#endif
  return NULL;
}

napi_value init(napi_env env, napi_value exports) {
  napi_value register_fn, start_fn, stop_fn;
  
  napi_create_function(env, NULL, 0, register_hotkey, NULL, &register_fn);
  napi_create_function(env, NULL, 0, start_listening, NULL, &start_fn);
  napi_create_function(env, NULL, 0, stop_listening, NULL, &stop_fn);
  
  napi_set_named_property(env, exports, "registerHotkey", register_fn);
  napi_set_named_property(env, exports, "startListening", start_fn);
  napi_set_named_property(env, exports, "stopListening", stop_fn);
  
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)