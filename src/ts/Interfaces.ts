import type { QueryValue } from '@/ts/Types';

export interface DiscountQuoteRequest {
  query: {
    amount?: QueryValue;
    coupon?: QueryValue;
  };
}

export interface DiscountQuoteResponse {
  statusCode: number;
  end: (body: string) => void;
}
