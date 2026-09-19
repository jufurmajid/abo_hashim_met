'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShoppingBag, Loader2, User, Phone, MapPin, Building, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { validateCustomerDetails, IRAQI_GOVERNORATES, ValidationErrors } from '@/lib/validation';
import { Customer, Order } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();

  const [customer, setCustomer] = useState<Customer>({
    fullName: '',
    phone: '',
    governorate: 'بغداد',
    area: '',
    address: '',
    landmark: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateCustomerDetails(customer);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (items.length === 0) {
      setSubmitError('سلة المشتريات فارغة');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء تقديم الطلب');
      }

      setCompletedOrder(data.order);
      clearCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'عذراً، تعذر إرسال الطلب. يرجى المحاولة لاحقاً.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setCompletedOrder(null);
    setSubmitError(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={handleCloseAndReset}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-5 sm:p-8 text-right shadow-2xl transition-all my-6 border border-slate-100 animate-fade-in">

          {/* Close button */}
          <button
            onClick={handleCloseAndReset}
            className="absolute left-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Order Success View */}
          {completedOrder ? (
            <div className="py-6 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>تم استلام طلبك بنجاح 🎉</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  شكراً لطلبك من متجر أبو هاشم
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  رقم الطلب: <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">{completedOrder.id}</span>
                </p>
              </div>

              {/* Order summary details */}
              <div className="bg-slate-50 p-5 rounded-2xl text-right text-xs sm:text-sm text-slate-600 space-y-3 border border-slate-200/80 max-w-lg mx-auto">
                <div className="font-black text-slate-900 border-b border-slate-200 pb-2.5 flex justify-between items-center">
                  <span>ملخص الطلب</span>
                  <span className="text-emerald-700 font-extrabold">{completedOrder.total.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong className="text-slate-900">الاسم:</strong> {completedOrder.customerName}</p>
                  <p><strong className="text-slate-900">الهاتف:</strong> {completedOrder.phone}</p>
                  <p><strong className="text-slate-900">العنوان:</strong> {completedOrder.governorate} - {completedOrder.area} - {completedOrder.address}</p>
                  <p><strong className="text-slate-900">أقرب نقطة دالة:</strong> {completedOrder.landmark}</p>
                  {completedOrder.notes && <p><strong className="text-slate-900">ملاحظات:</strong> {completedOrder.notes}</p>}
                </div>
                <div className="border-t border-slate-200 pt-2.5 text-[11px] font-medium text-slate-500">
                  سيتم التواصل معكم عبر الهاتف لتأكيد التوصيل المباشر.
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full max-w-sm mx-auto py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
              >
                العودة للرئيسية
              </button>
            </div>
          ) : (
            /* Guest Checkout Form View */
            <div>
              <div className="mb-6 border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>شراء مباشر بدون حساب</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  إتمام بيانات التوصيل
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  أدخل عنوانك بالتفصيل ليصلك طلبك طازجاً ومباشرةً.
                </p>
              </div>

              {submitError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="أدخل اسمك الثلاثي"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 transition-all font-medium ${
                        errors.fullName
                          ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={customer.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0770XXXXXXX"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-right focus:outline-hidden focus:ring-2 transition-all font-medium ${
                        errors.phone
                          ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.phone}</p>}
                  </div>
                </div>

                {/* Governorate & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      المحافظة *
                    </label>
                    <select
                      value={customer.governorate}
                      onChange={(e) => handleInputChange('governorate', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white font-medium"
                    >
                      {IRAQI_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                    {errors.governorate && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.governorate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      المنطقة / الحي *
                    </label>
                    <input
                      type="text"
                      value={customer.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="مثال: المنصور، الحارثية"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 transition-all font-medium ${
                        errors.area
                          ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.area && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.area}</p>}
                  </div>
                </div>

                {/* Detailed Address & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      العنوان بالتفصيل *
                    </label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="شارع، محلة، زقاق، رقم الدار"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 transition-all font-medium ${
                        errors.address
                          ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.address && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      أقرب نقطة دالة *
                    </label>
                    <input
                      type="text"
                      value={customer.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      placeholder="مثال: قرب جامع، مدرسة، مستشفى"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 transition-all font-medium ${
                        errors.landmark
                          ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.landmark && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.landmark}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={customer.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي تعليمات خاصة بالتقطيع أو التغليف أو وقت التوصيل..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium"
                  />
                </div>

                {/* Order Total Preview & Submit */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right w-full sm:w-auto">
                    <span className="text-xs text-slate-500 block font-medium">الإجمالي النهائي</span>
                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                      {totalPrice.toLocaleString('ar-IQ')} <span className="text-xs font-bold text-slate-500">د.ع</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري إرسال الطلب...</span>
                      </>
                    ) : (
                      <span>تأكيد الطلب</span>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
