#!/bin/bash

echo "vyubi macOS test"
echo "================"
echo ""
echo "1. testing otp generation..."
bun run test-otp.ts | head -3
echo ""
echo "2. starting vyubi (will run for 10 seconds)..."
echo "   try pressing ctrl+9 to test hotkey"
echo ""
timeout 10 bun start 2>&1 || true
echo ""
echo "test complete!"