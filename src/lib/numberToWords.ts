/**
 * تبدیل عدد به حروف فارسی
 */

const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const sadgan = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const dah = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];

function convertGroupToWords(num: number): string {
  if (num === 0) return '';
  
  const sadPosition = Math.floor(num / 100);
  const dahPosition = Math.floor((num % 100) / 10);
  const yekanPosition = num % 10;
  
  let result = '';
  
  // صدگان
  if (sadPosition > 0) {
    result += sadgan[sadPosition];
  }
  
  // دهگان و یکان
  if (dahPosition === 1) {
    // اعداد 10 تا 19
    if (result) result += ' و ';
    result += dah[yekanPosition];
  } else {
    // دهگان
    if (dahPosition > 0) {
      if (result) result += ' و ';
      result += dahgan[dahPosition];
    }
    
    // یکان
    if (yekanPosition > 0) {
      if (result) result += ' و ';
      result += yekan[yekanPosition];
    }
  }
  
  return result;
}

/**
 * تبدیل عدد به حروف فارسی
 * @param num عدد مورد نظر
 * @returns عدد به حروف فارسی
 * 
 * @example
 * numberToWords(1234567890) // "یک میلیارد و دویست و سی و چهار میلیون و پانصد و شصت و هفت هزار و هشتصد و نود"
 */
export function numberToWords(num: number | string): string {
  // تبدیل به عدد اگر رشته باشد
  const numValue = typeof num === 'string' ? parseInt(num.replace(/,/g, '')) : num;
  
  if (isNaN(numValue) || numValue < 0) {
    return '';
  }
  
  if (numValue === 0) {
    return 'صفر';
  }
  
  const groups = [
    { name: 'میلیارد', value: 1000000000 },
    { name: 'میلیون', value: 1000000 },
    { name: 'هزار', value: 1000 },
    { name: '', value: 1 }
  ];
  
  let result = '';
  let remaining = numValue;
  
  for (const group of groups) {
    const groupValue = Math.floor(remaining / group.value);
    
    if (groupValue > 0) {
      if (result) result += ' و ';
      
      const groupWords = convertGroupToWords(groupValue);
      result += groupWords;
      
      if (group.name) {
        result += ' ' + group.name;
      }
      
      remaining = remaining % group.value;
    }
  }
  
  return result;
}

/**
 * تبدیل مبلغ به فرمت ساده (عدد + واحد)
 * @param amount مبلغ به تومان
 * @returns مبلغ به فرمت ساده
 * 
 * @example
 * amountToWords(5000000000) // "5 میلیارد تومان"
 * amountToWords(1234567890000) // "1,234.57 میلیارد تومان"
 */
export function amountToWords(amount: number | string): string {
  // تبدیل به عدد
  const numValue = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  
  if (isNaN(numValue) || numValue < 0) {
    return '';
  }
  
  if (numValue === 0) {
    return '0 تومان';
  }
  
  // واحدهای مختلف با مقادیرشان
  const units = [
    { name: 'کوادریلیون', value: 1e15 }, // 1,000,000,000,000,000
    { name: 'تریلیون', value: 1e12 },     // 1,000,000,000,000
    { name: 'میلیارد', value: 1e9 },      // 1,000,000,000
    { name: 'میلیون', value: 1e6 },       // 1,000,000
    { name: 'هزار', value: 1e3 },         // 1,000
  ];
  
  // پیدا کردن مناسب‌ترین واحد
  for (const unit of units) {
    if (numValue >= unit.value) {
      const value = numValue / unit.value;
      
      // اگر عدد گرد باشد
      if (value === Math.floor(value)) {
        return `${formatNumber(Math.floor(value))} ${unit.name} تومان`;
      }
      
      // اگر اعشار داشته باشد، دو رقم اعشار نشون میدیم
      const roundedValue = Math.floor(value * 100) / 100;
      return `${roundedValue.toLocaleString('en-US')} ${unit.name} تومان`;
    }
  }
  
  // برای اعداد زیر 1000
  return `${formatNumber(numValue)} تومان`;
}

/**
 * فرمت کردن عدد با کامای جداکننده
 * @param num عدد
 * @returns عدد فرمت شده
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? num.replace(/,/g, '') : String(num);
  return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

