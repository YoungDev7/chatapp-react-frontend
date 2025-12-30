/// <reference types="jest" />
/// <reference types="node" />
import { formatMessageTimestamp } from "./timestampUtils";

describe('formatMessageTimestamp', () => {
    const currentTimezone = process.env.TZ;

    describe('timezone conversion test', () => {
        //2025-12-29T16:35:18.918Z = 1767026118.918 = 29th December 2025 16:35 UTC 
        //we can use UTC timesamp for all timezones because all related functions such as .getHours() already
        //convert to the right timezone, it doesnt break break functionality that relies on timestampUtils.ts:24
        const mockNow = new Date('2025-12-29T16:35:18.918Z');

        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(mockNow);
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test(`converts ${currentTimezone} timezone timestamp correctly`, () => {
            const utcUnixTimestampNow = 1767026118.918;
            const result = formatMessageTimestamp(utcUnixTimestampNow)

            console.log("result: " + result);
            console.log("timezone: " + currentTimezone);
            console.log("mock now: " + mockNow);

            if (currentTimezone === "America/Los_Angeles") {
                expect(result).toBe("08:35");
            }

            if (currentTimezone === "Asia/Tokyo") {
                expect(result).toBe("01:35");
            }

            if (currentTimezone === "America/New_York") {
                expect(result).toBe("11:35");
            }

            if (currentTimezone === "Europe/Berlin") {
                expect(result).toBe("17:35");
            }

            if (currentTimezone === "UTC") {
                expect(result).toBe("16:35");
            }
        })

    });
});
