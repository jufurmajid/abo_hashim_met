import { Customer } from '@/types';

export interface ValidationErrors {
  fullName?: string;
  phone?: string;
  governorate?: string;
  area?: string;
  address?: string;
  landmark?: string;
  notes?: string;
  items?: string;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic HTML tag prevention
    .slice(0, 500); // Prevent excessively long strings
}

export function validateCustomerDetails(customer: Customer): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  const cleanName = sanitizeInput(customer.fullName || '');
  if (!cleanName || cleanName.length < 3) {
    errors.fullName = 'يرجى كتابة الاسم الكامل (3 أحرف على الأقل)';
  }

  const cleanPhone = (customer.phone || '').trim().replace(/\s+/g, '');
  // Iraqi phone format checks (starts with 07 or +9647 or 009647 or 10-11 digits)
  const phoneRegex = /^(\+?964|0)?7[0-9]{9}$/;
  if (!cleanPhone) {
    errors.phone = 'رقم الهاتف مطلوب';
  } else if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
    errors.phone = 'يرجى إدخال رقم هاتف صحيح (مثال: 07701234567)';
  }

  const cleanGov = sanitizeInput(customer.governorate || '');
  if (!cleanGov) {
    errors.governorate = 'يرجى اختيار أو كتابة المحافظة';
  }

  const cleanArea = sanitizeInput(customer.area || '');
  if (!cleanArea) {
    errors.area = 'يرجى إدخال المنطقة/الحي';
  }

  const cleanAddress = sanitizeInput(customer.address || '');
  if (!cleanAddress || cleanAddress.length < 5) {
    errors.address = 'يرجى كتابة العنوان بالتفصيل (5 أحرف على الأقل)';
  }

  const cleanLandmark = sanitizeInput(customer.landmark || '');
  if (!cleanLandmark) {
    errors.landmark = 'يرجى تحديد أقرب نقطة دالة لتسهيل التوصيل';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const IRAQI_GOVERNORATES = [
  'بغداد',
  'البصرة',
  'نينوى',
  'أربيل',
  'النجف الأشرف',
  'كربلاء المقدسة',
  'بابل',
  'كركوك',
  'أنبار',
  'ذي قار',
  'ديالى',
  'واسط',
  'القادسية (الديوانية)',
  'ميسان',
  'المثنى',
  'السليمانية',
  'دهوك',
  'حلبجة',
];
