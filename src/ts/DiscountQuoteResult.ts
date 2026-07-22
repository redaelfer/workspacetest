type DiscountQuoteResult =
  | {
      ok: true;
      total: number;
      discountPercent: number;
      couponCode?: string;
    }
  | {
      ok: false;
      error: string;
    };

export default DiscountQuoteResult;
