import type QueryValue from '@/ts/QueryValue';

export default interface DiscountQuoteRequest {
  query: {
    amount?: QueryValue;
    coupon?: QueryValue;
  };
}
