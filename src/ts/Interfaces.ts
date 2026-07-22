import type SharedTypes from '@/ts/Types';

interface DiscountQuoteRequest {
  query: {
    amount?: SharedTypes['QueryValue'];
    coupon?: SharedTypes['QueryValue'];
  };
}

interface DiscountQuoteResponse {
  statusCode: number;
  setHeader?: (name: string, value: string) => void;
  end: (body: string) => void;
}

export default interface SharedInterfaces {
  DiscountQuoteRequest: DiscountQuoteRequest;
  DiscountQuoteResponse: DiscountQuoteResponse;
}
