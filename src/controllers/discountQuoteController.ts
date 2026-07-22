import calculateDiscountQuote from '@/services/discountQuoteService';
import type DiscountQuoteRequest from '@/ts/DiscountQuoteRequest';
import type DiscountQuoteResponse from '@/ts/DiscountQuoteResponse';
import type QueryValue from '@/ts/QueryValue';

function firstQueryValue(value: QueryValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function sendJson(
  res: DiscountQuoteResponse,
  statusCode: number,
  body: Record<string, number | string | undefined>,
): void {
  res.statusCode = statusCode;
  res.end(JSON.stringify(body));
}

function discountQuoteController(req: DiscountQuoteRequest, res: DiscountQuoteResponse): void {
  const amountValue = firstQueryValue(req.query.amount);

  if (amountValue === undefined || amountValue.trim() === '') {
    sendJson(res, 400, { error: 'amount is required' });
    return;
  }

  const amount = Number(amountValue);

  if (!Number.isFinite(amount) || amount < 0) {
    sendJson(res, 400, { error: 'amount must be a finite non-negative number' });
    return;
  }

  const quote = calculateDiscountQuote(amount, firstQueryValue(req.query.coupon));

  if (!quote.ok) {
    sendJson(res, 400, { error: quote.error });
    return;
  }

  sendJson(res, 200, {
    total: quote.total,
    discountPercent: quote.discountPercent,
    coupon: quote.couponCode,
  });
}

export default discountQuoteController;
