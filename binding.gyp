{
  "targets": [
    {
      "target_name": "hotkeys",
      "sources": [ "src/native/hotkeys.c" ],
      "conditions": [
        ['OS=="mac"', {
          "link_settings": {
            "libraries": [
              "-framework Carbon",
              "-framework CoreFoundation",
              "-framework ApplicationServices"
            ]
          }
        }],
        ['OS=="linux"', {
          "libraries": [
            "-lX11",
            "-lXtst"
          ]
        }],
        ['OS=="win"', {
          "libraries": [
            "user32.lib"
          ]
        }]
      ]
    },
    {
      "target_name": "keyboard",
      "sources": [ "src/native/keyboard.c" ],
      "conditions": [
        ['OS=="mac"', {
          "link_settings": {
            "libraries": [
              "-framework Carbon",
              "-framework CoreGraphics",
              "-framework ApplicationServices"
            ]
          }
        }],
        ['OS=="linux"', {
          "libraries": [
            "-lX11",
            "-lXtst"
          ]
        }],
        ['OS=="win"', {
          "libraries": [
            "user32.lib"
          ]
        }]
      ]
    }
  ]
}