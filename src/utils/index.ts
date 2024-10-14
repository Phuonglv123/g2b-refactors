export const currencyLocaleMap: { [key: string]: string } = {
  USD: 'en-US',
  EUR: 'de-DE',
  VND: 'vi-VN',
  GBP: 'en-GB',
  CAD: 'en-CA',
  CNY: 'zh-CN',
  HKD: 'zh-HK',
  IDR: 'id-ID',
  JPY: 'ja-JP',
  SGD: 'en-SG',
  INR: 'hi-IN',
  THB: 'th-TH',
  KRW: 'ko-KR',
  MYR: 'ms-MY',
  PHP: 'fil-PH',
};

export const formatCurrency = (value: number, currency: string) => {
  const locale = currencyLocaleMap[currency] || 'en-US'; // Default to 'en-US' if currency is not in the map
  return new Intl.NumberFormat(locale, { currency }).format(value).replace(/\D00(?=\D*$)/, '');
};

export const getSrcImg = (images: string) => {
  return `${IMAGE_URL}${images}`;
};

export const formatNumberVietnamese = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export function convertTo12HourFormat(time: any) {
  // Split the time into hours, minutes, and seconds
  let [hours, minutes, seconds] = time.split(':').map(Number);

  // Determine the period (AM/PM)
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12 || 12;

  // Return the formatted time string
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
