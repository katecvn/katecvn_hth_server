const PERMISSIONS = {
  USER: 'user',
  USER_CREATE: 'user_create',
  USER_VIEW: 'user_view',
  USER_DETAIL: 'user_detail',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_MANAGE_ROLE: 'user_manage_role',
  USER_MANAGE_STATUS: 'user_manage_status',

  PERMISSION: 'permission',
  PERMISSION_CREATE: 'permission_create',
  PERMISSION_VIEW: 'permission_view',
  PERMISSION_UPDATE: 'permission_update',
  PERMISSION_DELETE: 'permission_delete',

  ROLE: 'role',
  ROLE_CREATE: 'role_create',
  ROLE_VIEW: 'role_view',
  ROLE_DETAIL: 'role_detail',
  ROLE_UPDATE: 'role_update',
  ROLE_DELETE: 'role_delete',
  ROLE_MANAGE_PERMISSION: 'role_manage_permission',

  POST: 'post',
  POST_CREATE: 'post_create',
  POST_VIEW: 'post_view',
  POST_DETAIL: 'post_detail',
  POST_UPDATE: 'post_update',
  POST_DELETE: 'post_delete',
  POST_STATUS: 'post_status',

  TOPIC: 'topic',
  TOPIC_CREATE: 'topic_create',
  TOPIC_VIEW: 'topic_view',
  TOPIC_DETAIL: 'topic_detail',
  TOPIC_UPDATE: 'topic_update',
  TOPIC_DELETE: 'topic_delete',
  TOPIC_MANAGE_STATUS: 'topic_manage_status',

  COMMENT: 'comment',
  COMMENT_UPDATE: 'comment_update',
  COMMENT_DELETE: 'comment_delete',
  COMMENT_MANAGE_STATUS: 'comment_manage_status',

  PRODUCT: 'product',
  PRODUCT_CREATE: 'product_create',
  PRODUCT_VIEW: 'product_view',
  PRODUCT_DETAIL: 'product_detail',
  PRODUCT_UPDATE: 'product_update',
  PRODUCT_DELETE: 'product_delete',
  PRODUCT_MANAGE_STATUS: 'product_manage_status',

  // Đơn hàng
  ORDER: 'order',
  ORDER_CREATE: 'order_create',
  ORDER_VIEW: 'order_view',
  ORDER_DETAIL: 'order_detail',
  ORDER_UPDATE: 'order_update',
  ORDER_DELETE: 'order_delete',
  ORDER_MANAGE_STATUS: 'order_manage_status',

  // Giảm giá
  DISCOUNT: 'discount',
  DISCOUNT_CREATE: 'discount_create',
  DISCOUNT_VIEW: 'discount_view',
  DISCOUNT_DETAIL: 'discount_detail',
  DISCOUNT_UPDATE: 'discount_update',
  DISCOUNT_DELETE: 'discount_delete',
  DISCOUNT_MANAGE_STATUS: 'discount_manage_status',

  // Liên hệ
  CONTACT: 'contact',
  CONTACT_CREATE: 'contact_create',
  CONTACT_VIEW: 'contact_view',
  CONTACT_UPDATE: 'contact_update',
  CONTACT_DELETE: 'contact_delete',
  CONTACT_MANAGE_STATUS: 'contact_manage_status',

  // Tập tin
  FILE: 'file',
  FILE_UPLOAD: 'file_upload',
  FILE_VIEW: 'file_view',
  FILE_UPDATE: 'file_update',
  FILE_DELETE: 'file_delete',

  // Thanh toán
  PAYMENT: 'payment',
  PAYMENT_CREATE: 'payment_create',
  PAYMENT_VIEW: 'payment_view',
  PAYMENT_UPDATE: 'payment_update',
  PAYMENT_DELETE: 'payment_delete',
  PAYMENT_MANAGE_STATUS: 'payment_manage_status',

  // Vận chuyển
  SHIPPING: 'shipping',
  SHIPPING_CREATE: 'shipping_create',
  SHIPPING_VIEW: 'shipping_view',
  SHIPPING_UPDATE: 'shipping_update',
  SHIPPING_DELETE: 'shipping_delete',
  SHIPPING_MANAGE_STATUS: 'shipping_manage_status',

  // Nhóm khách hàng
  CUSTOMER_GROUP: 'customer_group',
  CUSTOMER_GROUP_CREATE: 'customer_group_create',
  CUSTOMER_GROUP_VIEW: 'customer_group_view',
  CUSTOMER_GROUP_DETAIL: 'customer_group_detail',
  CUSTOMER_GROUP_UPDATE: 'customer_group_update',
  CUSTOMER_GROUP_DELETE: 'customer_group_delete',

  // Giảm giá theo nhóm khách hàng
  CUSTOMER_GROUP_DISCOUNT: 'customer_group_discount',
  CUSTOMER_GROUP_DISCOUNT_CREATE: 'customer_group_discount_create',
  CUSTOMER_GROUP_DISCOUNT_VIEW: 'customer_group_discount_view',
  CUSTOMER_GROUP_DISCOUNT_DETAIL: 'customer_group_discount_detail',
  CUSTOMER_GROUP_DISCOUNT_UPDATE: 'customer_group_discount_update',
  CUSTOMER_GROUP_DISCOUNT_DELETE: 'customer_group_discount_delete',

  // Lịch sử giảm giá theo nhóm khách hàng
  CUSTOMER_GROUP_DISCOUNT_HISTORY: 'customer_group_discount_history',
  CUSTOMER_GROUP_DISCOUNT_HISTORY_VIEW: 'customer_group_discount_history_view',
  CUSTOMER_GROUP_DISCOUNT_HISTORY_DETAIL: 'customer_group_discount_history_detail',

  // Cài đặt
  SETTING: 'setting',
  SETTING_MENU: 'setting_menu',
  SETTING_PAGE: 'setting_page',

  // Điểm thưởng
  REWARD: 'reward',
  REWARD_RULE_VIEW: 'reward_rule_view',
  REWARD_RULE_CREATE: 'reward_rule_create',
  REWARD_RULE_UPDATE: 'reward_rule_update',
  REWARD_RULE_DELETE: 'reward_rule_delete',
  REWARD_HISTORY_VIEW: 'reward_history_view',

  // Hóa đơn
  INVOICE: 'invoice',
  INVOICE_CREATE: 'invoice_create',
  INVOICE_VIEW: 'invoice_view',
  INVOICE_UPDATE: 'invoice_update',
  INVOICE_MANAGE_STATUS: 'invoice_manage_status',
  INVOICE_DELETE: 'invoice_delete',


}

module.exports = PERMISSIONS
