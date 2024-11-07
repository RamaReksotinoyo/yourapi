// src/utils/__tests__/calculateZodiac.spec.ts
import { calculateZodiac } from './calculateZodiac';

describe('calculateZodiac', () => {
  it('should return Aries for March 21', () => {
    expect(calculateZodiac('2024-03-21')).toBe('Aries');
  });

  it('should return Taurus for April 20', () => {
    expect(calculateZodiac('2024-04-20')).toBe('Taurus');
  });

  it('should return Gemini for June 15', () => {
    expect(calculateZodiac('2024-06-15')).toBe('Gemini');
  });

  it('should return Cancer for July 22', () => {
    expect(calculateZodiac('2024-07-22')).toBe('Cancer');
  });

  it('should return Leo for August 1', () => {
    expect(calculateZodiac('2024-08-01')).toBe('Leo');
  });

  it('should return Virgo for September 1', () => {
    expect(calculateZodiac('2024-09-01')).toBe('Virgo');
  });

  it('should return Libra for October 10', () => {
    expect(calculateZodiac('2024-10-10')).toBe('Libra');
  });

  it('should return Scorpio for November 1', () => {
    expect(calculateZodiac('2024-11-01')).toBe('Scorpio');
  });

  it('should return Sagittarius for December 15', () => {
    expect(calculateZodiac('2024-12-15')).toBe('Sagittarius');
  });

  it('should return Capricorn for January 10', () => {
    expect(calculateZodiac('2024-01-10')).toBe('Capricorn');
  });

  it('should return Aquarius for February 5', () => {
    expect(calculateZodiac('2024-02-05')).toBe('Aquarius');
  });

  it('should return Pisces for March 10', () => {
    expect(calculateZodiac('2024-03-10')).toBe('Pisces');
  });
});
