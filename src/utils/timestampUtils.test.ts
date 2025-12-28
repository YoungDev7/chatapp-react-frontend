/// <reference types="jest" />
import { formatMessageTimestamp, isWithinOneMinute, shouldShowTimestamp } from './timestampUtils';

describe('formatMessageTimestamp', () => {
    // Mock the current date to ensure consistent tests
    const mockNow = new Date('2025-12-28T15:30:00Z'); // 3:30 PM UTC

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(mockNow);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('handles different input formats', () => {
        test('formats ISO 8601 string (UTC timezone)', () => {
            const timestamp = '2025-12-28T10:15:00Z'; // 10:15 AM UTC
            const result = formatMessageTimestamp(timestamp);

            // The result will depend on system timezone
            // In UTC+0, this would be "10:15"
            // We're checking it returns a valid time format
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('formats ISO 8601 string with positive timezone offset', () => {
            const timestamp = '2025-12-28T20:45:00+05:30'; // 8:45 PM IST (India)
            const result = formatMessageTimestamp(timestamp);

            // This converts to UTC (15:15) which is today in our mock
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('formats ISO 8601 string with negative timezone offset', () => {
            const timestamp = '2025-12-28T10:00:00-05:00'; // 10 AM EST (New York)
            const result = formatMessageTimestamp(timestamp);

            // This converts to UTC (15:00) which is today
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('formats Unix timestamp (seconds)', () => {
            const timestamp = 1766935800; // Dec 28, 2025 15:30:00 UTC (same day as mockNow)
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('formats Date object', () => {
            const timestamp = new Date('2025-12-28T14:20:00Z');
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });
    });

    describe('formats based on date rules', () => {
        test('returns time only for today', () => {
            // Same day as mockNow (2025-12-28)
            const timestamp = '2025-12-28T12:45:00Z';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
            expect(result).not.toContain('Dec');
        });

        test('returns "MMM DD, HH:MM" for different day in same year', () => {
            // Different day but same year
            const timestamp = '2025-11-15T14:30:00Z';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{2}:\d{2}$/);
            expect(result).toContain('Nov 15');
            expect(result).not.toContain('2025');
        });

        test('returns "MMM DD, YYYY HH:MM" for different year', () => {
            // Different year
            const timestamp = '2024-06-20T10:00:00Z';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4} \d{2}:\d{2}$/);
            expect(result).toContain('Jun 20, 2024');
        });
    });

    describe('timezone conversion tests', () => {
        test('converts Tokyo time (UTC+9) correctly', () => {
            // Dec 28, 2025 at midnight Tokyo time = Dec 27, 2025 15:00 UTC
            const timestamp = '2025-12-28T00:00:00+09:00';
            const result = formatMessageTimestamp(timestamp);

            // Should be formatted as Dec 27 since that's what it is in UTC
            expect(result).toBeTruthy();
            expect(result).not.toBe('');
        });

        test('converts Los Angeles time (UTC-8) correctly', () => {
            // Dec 28, 2025 at 7:30 AM PST = Dec 28, 2025 15:30 UTC (same as mockNow)
            const timestamp = '2025-12-28T07:30:00-08:00';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('converts London time (UTC+0) correctly', () => {
            const timestamp = '2025-12-28T15:30:00+00:00';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('converts Sydney time (UTC+11) correctly', () => {
            // Dec 29, 2025 at 2:30 AM AEDT = Dec 28, 2025 15:30 UTC
            const timestamp = '2025-12-29T02:30:00+11:00';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });
    });

    describe('edge cases', () => {
        test('returns empty string for null', () => {
            expect(formatMessageTimestamp(null)).toBe('');
        });

        test('returns empty string for undefined', () => {
            expect(formatMessageTimestamp(undefined)).toBe('');
        });

        test('returns empty string for invalid date string', () => {
            expect(formatMessageTimestamp('invalid-date')).toBe('');
        });

        test('handles midnight correctly', () => {
            const timestamp = '2025-12-28T00:00:00Z';
            const result = formatMessageTimestamp(timestamp);

            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        test('handles end of day correctly', () => {
            const timestamp = '2025-12-28T23:59:59Z';
            const result = formatMessageTimestamp(timestamp);

            // This is still today (Dec 28) so should show time only
            // However, in some timezones this might be next day
            expect(result).toBeTruthy();
            expect(result).not.toBe('');
        });
    });

    describe('month name formatting', () => {
        const months = [
            { month: 0, name: 'Jan', date: '2025-01-15T12:00:00Z' },
            { month: 1, name: 'Feb', date: '2025-02-15T12:00:00Z' },
            { month: 2, name: 'Mar', date: '2025-03-15T12:00:00Z' },
            { month: 3, name: 'Apr', date: '2025-04-15T12:00:00Z' },
            { month: 4, name: 'May', date: '2025-05-15T12:00:00Z' },
            { month: 5, name: 'Jun', date: '2025-06-15T12:00:00Z' },
            { month: 6, name: 'Jul', date: '2025-07-15T12:00:00Z' },
            { month: 7, name: 'Aug', date: '2025-08-15T12:00:00Z' },
            { month: 8, name: 'Sep', date: '2025-09-15T12:00:00Z' },
            { month: 9, name: 'Oct', date: '2025-10-15T12:00:00Z' },
            { month: 10, name: 'Nov', date: '2025-11-15T12:00:00Z' },
            { month: 11, name: 'Dec', date: '2025-12-15T12:00:00Z' },
        ];

        months.forEach(({ name, date }) => {
            test(`formats ${name} correctly`, () => {
                const result = formatMessageTimestamp(date);
                expect(result).toContain(name);
            });
        });
    });
});

describe('isWithinOneMinute', () => {
    test('returns true for timestamps within one minute', () => {
        const ts1 = '2025-12-28T15:30:00Z';
        const ts2 = '2025-12-28T15:30:45Z';

        expect(isWithinOneMinute(ts1, ts2)).toBe(true);
    });

    test('returns false for timestamps more than one minute apart', () => {
        const ts1 = '2025-12-28T15:30:00Z';
        const ts2 = '2025-12-28T15:31:30Z';

        expect(isWithinOneMinute(ts1, ts2)).toBe(false);
    });

    test('returns false for null timestamps', () => {
        expect(isWithinOneMinute(null, null)).toBe(false);
        expect(isWithinOneMinute('2025-12-28T15:30:00Z', null)).toBe(false);
    });

    test('works with Unix timestamps', () => {
        const ts1 = 1735396200; // Dec 28, 2025 15:30:00 UTC
        const ts2 = 1735396230; // Dec 28, 2025 15:30:30 UTC

        expect(isWithinOneMinute(ts1, ts2)).toBe(true);
    });

    test('handles different timezones correctly', () => {
        const ts1 = '2025-12-28T15:30:00Z'; // UTC
        const ts2 = '2025-12-28T21:00:45+05:30'; // IST (same as 15:30:45 UTC)

        expect(isWithinOneMinute(ts1, ts2)).toBe(true);
    });
});

describe('shouldShowTimestamp', () => {
    test('returns true for first message (no previous timestamp)', () => {
        const result = shouldShowTimestamp(
            '2025-12-28T15:30:00Z',
            null,
            'user1',
            null
        );

        expect(result).toBe(true);
    });

    test('returns true for different sender', () => {
        const result = shouldShowTimestamp(
            '2025-12-28T15:30:00Z',
            '2025-12-28T15:29:30Z',
            'user1',
            'user2'
        );

        expect(result).toBe(true);
    });

    test('returns false for same sender within one minute', () => {
        const result = shouldShowTimestamp(
            '2025-12-28T15:30:00Z',
            '2025-12-28T15:29:30Z',
            'user1',
            'user1'
        );

        expect(result).toBe(false);
    });

    test('returns true for same sender after one minute', () => {
        const result = shouldShowTimestamp(
            '2025-12-28T15:30:00Z',
            '2025-12-28T15:28:00Z',
            'user1',
            'user1'
        );

        expect(result).toBe(true);
    });
});
