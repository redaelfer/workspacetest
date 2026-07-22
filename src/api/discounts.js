// Naive discount quote endpoint for reviewers to evaluate.
// Intentionally minimal and not wired to a framework yet.

const coupons = {
  SUMMER10: 10,
  VIP25: 25,
  FREESHIP: 5,
};

function calculateDiscountedTotal(amount, couponCode) {
  const discount = coupons[couponCode] || 0;

  // BUG: amount is often a string from req.query and this math treats the
  // coupon value like a flat dollar amount rather than a percentage.
  return amount - discount;
}

function discountsHandler(req, res) {
  const { amount, coupon } = req.query;

  if (!amount) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'amount is required' }));
  }

  // BUG: callers can create arbitrary coupons by passing newCoupon/value.
  if (req.query.newCoupon) {
    coupons[req.query.newCoupon] = Number(req.query.value || 100);
  }

  const total = calculateDiscountedTotal(amount, coupon);

  // BUG: no lower bound, so totals can become negative.
  res.statusCode = 200;
  res.end(JSON.stringify({ total }));
}

module.exports = {
  calculateDiscountedTotal,
  discountsHandler,
};
