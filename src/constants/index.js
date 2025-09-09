const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
}

const SETTING_KEY = {
  TAX: 'tax_setting',
  CURRENCY: 'currency_setting',
  FEE: 'fee_setting'
}

const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked'
}

const COMMENT_ABLE_TYPE = {
  POST: 'post',
  PRODUCT: 'product'
}

const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

const PAYMENT_METHOD = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  MOMO: 'momo',
  PAYPAL: 'paypal'
}

const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

const SHIPPING_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  FAILED: 'failed'
}

const SHIPPING_METHOD = {
  STANDARD_SHIPPING: 'standard_shipping',
  EXPRESS_SHIPPING: 'express_shipping'
  // FREIGHT: 'freight',
  // COURIER: 'courier'
}

const DISCOUNT_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DISABLED: 'disabled'
}

const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping',
  BUY_X_GET_Y: 'buy_x_get_y'
}

const CONTACT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved'
}

const RECEIPT_TYPE = {
  IMPORT: 'import',
  EXPORT: 'export'
}

const RECEIPT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCEL: 'canceled'
}

const PRODUCT_STATUS = {
  ACTIVE: 'active',
  HIDE: 'hide',
  ACTIVE_LIST: 'active_list'
}

module.exports = {
  STATUS_CODE,
  SETTING_KEY,
  ACCOUNT_STATUS,
  COMMENT_ABLE_TYPE,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  SHIPPING_STATUS,
  SHIPPING_METHOD,
  DISCOUNT_STATUS,
  DISCOUNT_TYPE,
  CONTACT_STATUS,
  RECEIPT_TYPE,
  RECEIPT_STATUS,
  PRODUCT_STATUS
}
