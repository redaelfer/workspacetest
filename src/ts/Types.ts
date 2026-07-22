export type QueryValue = string | string[] | undefined;

export type DiscountQuoteResult =
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
