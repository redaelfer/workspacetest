type QueryValue = string | string[] | undefined;

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

type SharedTypes = {
  QueryValue: QueryValue;
  DiscountQuoteResult: DiscountQuoteResult;
};

export default SharedTypes;
