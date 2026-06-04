import { describe, test, expect } from 'vitest';
import { normalizePhoneNumber } from '../app/utils/phone';

describe('normalizePhoneNumber', () => {
  test('returns empty for blank input', () => {
    expect(normalizePhoneNumber('')).toBe('');
  });

  test('prefixes US 10-digit numbers with +1', () => {
    expect(normalizePhoneNumber('8125550199')).toBe('+18125550199');
  });

  test('keeps E.164 numbers', () => {
    expect(normalizePhoneNumber('+442079460123')).toBe('+442079460123');
  });
});
