#!/bin/bash
# filepath: /home/pap/repos/chatapp/chatapp-react-frontend/test-timezones.sh

echo "Testing in UTC (UTC+0)..."
TZ=UTC npm test -- timestampUtils.test.ts

echo "Testing in America/Los_Angeles (PST UTC-8)..."
TZ=America/Los_Angeles npm test -- timestampUtils.test.ts

echo "Testing in Asia/Tokyo (JST UTC+9)..."
TZ=Asia/Tokyo npm test -- timestampUtils.test.ts

echo "Testing in Europe/Berlin (CET UTC+1)..."
TZ=Europe/Berlin npm test -- timestampUtils.test.ts

echo "Testing in America/New_York (EST UTC-5)..."
TZ=America/New_York npm test -- timestampUtils.test.ts
