import type { DiscountQuoteResult } from '@/ts/Types';

const trustedCoupons: Readonly<Record<string, number>> = Object.freeze({
  SUMMER10: 10,
  VIP25: 25,
  FREESHIP: 5,
});

const currencyPrecision = 100;

function roundCurrency(value: number): number {
  return Math.round(value * currencyPrecision) / currencyPrecision;
}

function resolveCoupon(couponCode: string | undefined): DiscountQuoteResult {
  if (!couponCode) {
    return {
      ok: true,
      total: 0,
      discountPercent: 0,
    };
  }

  const normalizedCouponCode = couponCode.trim().toUpperCase();
  const discountPercent = trustedCoupons[normalizedCouponCode];

  if (discountPercent === undefined) {
    return {
      ok: false,
      error: 'coupon is not valid',
    };
  }

  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    return {
      ok: false,
      error: 'coupon is not configured correctly',
    };
  }

  return {
    ok: true,
    total: 0,
    discountPercent,
    couponCode: normalizedCouponCode,
  };
}

function calculateDiscountQuote(amount: number, couponCode?: string): DiscountQuoteResult {
  if (!Number.isFinite(amount) || amount < 0) {
    return {
      ok: false,
      error: 'amount must be a finite non-negative number',
    };
  }

  const coupon = resolveCoupon(couponCode);

  if (!coupon.ok) {
    return coupon;
  }

  const discount = amount * (coupon.discountPercent / 100);
  const total = Math.max(0, roundCurrency(amount - discount));

  return {
    ok: true,
    total,
    discountPercent: coupon.discountPercent,
    couponCode: coupon.couponCode,
  };
}

export default calculateDiscountQuote;
