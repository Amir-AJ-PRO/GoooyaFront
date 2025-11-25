/**
 * تست‌های تابع تبدیل عدد به حروف فارسی
 */

import { numberToWords, amountToWords, formatNumber } from '../numberToWords';

describe('numberToWords', () => {
  test('تبدیل صفر', () => {
    expect(numberToWords(0)).toBe('صفر');
  });

  test('تبدیل اعداد یک رقمی', () => {
    expect(numberToWords(5)).toBe('پنج');
    expect(numberToWords(9)).toBe('نه');
  });

  test('تبدیل اعداد دو رقمی', () => {
    expect(numberToWords(10)).toBe('ده');
    expect(numberToWords(15)).toBe('پانزده');
    expect(numberToWords(25)).toBe('بیست و پنج');
    expect(numberToWords(99)).toBe('نود و نه');
  });

  test('تبدیل اعداد سه رقمی', () => {
    expect(numberToWords(100)).toBe('یکصد');
    expect(numberToWords(250)).toBe('دویست و پنجاه');
    expect(numberToWords(999)).toBe('نهصد و نود و نه');
  });

  test('تبدیل هزارها', () => {
    expect(numberToWords(1000)).toBe('یک هزار');
    expect(numberToWords(5000)).toBe('پنج هزار');
    expect(numberToWords(12345)).toBe('دوازده هزار و سیصد و چهل و پنج');
  });

  test('تبدیل میلیون‌ها', () => {
    expect(numberToWords(1000000)).toBe('یک میلیون');
    expect(numberToWords(5000000)).toBe('پنج میلیون');
    expect(numberToWords(1234567)).toBe('یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت');
  });

  test('تبدیل میلیاردها', () => {
    expect(numberToWords(1000000000)).toBe('یک میلیارد');
    expect(numberToWords(5000000000)).toBe('پنج میلیارد');
  });

  test('تبدیل رشته به عدد', () => {
    expect(numberToWords('1234')).toBe('یک هزار و دویست و سی و چهار');
    expect(numberToWords('5,000,000')).toBe('پنج میلیون');
  });

  test('اعداد نامعتبر', () => {
    expect(numberToWords(-10)).toBe('');
    expect(numberToWords('abc')).toBe('');
  });
});

describe('amountToWords', () => {
  test('تبدیل مبلغ به فرمت ساده', () => {
    expect(amountToWords(5000000)).toBe('5 میلیون تومان');
    expect(amountToWords(1000000000)).toBe('1 میلیارد تومان');
    expect(amountToWords(200000000000)).toBe('200 میلیارد تومان');
  });

  test('مبلغ صفر', () => {
    expect(amountToWords(0)).toBe('0 تومان');
  });

  test('اعداد با اعشار', () => {
    expect(amountToWords(1234567890)).toBe('1.23 میلیارد تومان');
    expect(amountToWords(5500000000)).toBe('5.5 میلیارد تومان');
  });

  test('تریلیون و بالاتر', () => {
    expect(amountToWords(1000000000000)).toBe('1 تریلیون تومان');
    expect(amountToWords(5000000000000)).toBe('5 تریلیون تومان');
    expect(amountToWords(1234567890123456)).toBe('1,234.57 تریلیون تومان');
  });

  test('کوادریلیون', () => {
    expect(amountToWords(1000000000000000)).toBe('1 کوادریلیون تومان');
    expect(amountToWords(5500000000000000)).toBe('5.5 کوادریلیون تومان');
  });
});

describe('formatNumber', () => {
  test('فرمت کردن عدد با کامای جداکننده', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber('5000000')).toBe('5,000,000');
    expect(formatNumber('1234567890')).toBe('1,234,567,890');
  });
});

// مثال‌های واقعی از قیمت املاک
describe('مثال‌های واقعی', () => {
  test('قیمت آپارتمان', () => {
    expect(amountToWords(5000000000)).toBe('5 میلیارد تومان');
  });

  test('رهن', () => {
    expect(amountToWords(500000000)).toBe('500 میلیون تومان');
  });

  test('اجاره', () => {
    expect(amountToWords(10000000)).toBe('10 میلیون تومان');
  });

  test('قیمت‌های بسیار بالا', () => {
    expect(amountToWords(1500000000000)).toBe('1.5 تریلیون تومان');
    expect(amountToWords(250000000000)).toBe('250 میلیارد تومان');
  });

  test('اعداد زیر هزار', () => {
    expect(amountToWords(500)).toBe('500 تومان');
    expect(amountToWords(999)).toBe('999 تومان');
  });
});

