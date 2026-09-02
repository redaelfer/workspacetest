# Discount quote API

## `GET /api/discounts`

Returns a discount quote for an order amount using an optional trusted coupon code.

### Query parameters

- `amount` (required): finite, non-negative numeric order amount.
- `coupon` (optional): trusted coupon code. Supported values are `SUMMER10`, `VIP25`, and `FREESHIP`. Blank or whitespace-only values are treated the same as an omitted coupon.

### Success response

Status: `200 OK`

```json
{
  "total": 90,
  "discountPercent": 10,
  "coupon": "SUMMER10"
}
```

When no coupon is supplied, `discountPercent` is `0` and `coupon` is omitted. Totals are rounded to two decimal places and never returned below zero.

### Error responses

Status: `400 Bad Request`

```json
{
  "error": "amount is required"
}
```

```json
{
  "error": "amount must be a finite non-negative number"
}
```

```json
{
  "error": "coupon is not valid"
}
```
