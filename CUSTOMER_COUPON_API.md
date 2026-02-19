# Customer-Facing Coupon API Documentation

## Base URL
```
Development: http://localhost:5000/api/publicApi/coupons
Production: https://your-domain.com/api/publicApi/coupons
```

## Authentication
**No authentication required** for customer-facing coupon endpoints.
Rate limiting: 10 requests per minute per IP address.

---

## 1. Validate Coupon Code

**Endpoint:** `POST /api/publicApi/coupons/validate`

**Description:** Validates a coupon code before order placement. Returns discount details if valid.

**When to Use:**
- Customer enters coupon code in checkout form
- Real-time validation to show discount amount
- Display error messages before order submission

**Request Body:**
```typescript
interface ValidateCouponRequest {
  couponCode: string;           // Coupon code to validate
  customerPhone: string;         // Customer's 11-digit phone number
  orderTotal: number;            // Total order amount before discount
  products?: Array<{             // Optional products array for restrictions
    productId: string;
    category?: string;
    quantity: number;
  }>;
}

// Example Request
{
  "couponCode": "SUMMER2025",
  "customerPhone": "01712345678",
  "orderTotal": 1500,
  "products": [
    {
      "productId": "507f1f77bcf86cd79943911",
      "category": "electronics",
      "quantity": 2
    }
  ]
}
```

**Response (200 OK) - Valid Coupon:**
```typescript
interface ValidateCouponSuccessResponse {
  success: true;
  message: "Coupon is valid";
  data: {
    valid: true;
    coupon: {
      code: string;                  // "SUMMER2025"
      discountType: 'fixed' | 'percentage';
      discountValue: number;          // 15 for percentage, 100 for fixed
      discountAmount: number;          // 225 (actual discount to apply)
      maxUses: number;                // Remaining uses for customer
      validUntil: string;              // "2025-03-31T23:59:59.999Z"
    };
  };
}
```

**Response (400 Bad Request) - Invalid Coupon:**
```typescript
interface ValidateCouponErrorResponse {
  success: false;
  message: "Invalid coupon";
  data: {
    valid: false;
    error: string;              // Specific error reason
    // Possible errors:
    // "Invalid or expired coupon code"
    // "This coupon has reached its maximum usage limit"
    // "You have already used this coupon 3 time(s)"
    // "This coupon is only valid for first orders"
    // "Minimum order amount of 500 BDT is required"
    // "This coupon is not applicable to any products in your cart"
  };
}
```

**Error Response Examples:**
```typescript
// Expired coupon
{
  "success": false,
  "message": "Invalid coupon",
  "data": {
    "valid": false,
    "error": "Invalid or expired coupon code"
  }
}

// Usage limit reached
{
  "success": false,
  "message": "Invalid coupon",
  "data": {
    "valid": false,
    "error": "You have already used this coupon 3 time(s)"
  }
}

// Minimum order not met
{
  "success": false,
  "message": "Invalid coupon",
  "data": {
    "valid": false,
    "error": "Minimum order amount of 500 BDT is required"
  }
}
```

---

## 2. Get My Active Coupons

**Endpoint:** `GET /api/publicApi/coupons/my/:phone`

**Description:** Returns all active coupons assigned to a customer.

**When to Use:**
- Display available coupons in customer account section
- Show "My Coupons" page with discount details
- Auto-apply best coupon on checkout

**URL Parameter:**
```typescript
phone: string;  // Customer's 11-digit phone number

// Example
GET /api/publicApi/coupons/my/01712345678
```

**Response (200 OK):**
```typescript
interface GetMyCouponsResponse {
  success: true;
  count: number;
  data: Array<{
    _id: string;
    customerId: string;
    code: string;                  // Customer's unique coupon code
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    maxUses: number;                // Total uses allowed
    usedCount: number;              // Times already used
    remainingUses: number;          // Calculated: maxUses - usedCount
    validFrom: string;              // ISO date string
    validUntil: string;             // ISO date string
    status: 'active' | 'expired' | 'disabled';
    minOrderAmount: number;          // Minimum order to use coupon
    maxDiscountAmount?: number;       // Max discount cap (percentage only)
    applicableProducts?: string[];   // Product IDs if restricted
    applicableCategories?: string[]; // Categories if restricted
    assignedBy: string;
    assignedAt: string;
    metadata?: {
      source: 'single' | 'bulk' | 'campaign';
      notes?: string;
    };
  }>;
}
```

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f2f77bcf86cd79943912",
      "customerId": "01712345678",
      "code": "CUSTOMER1735629123ABC",
      "discountType": "fixed",
      "discountValue": 100,
      "maxUses": 3,
      "usedCount": 1,
      "remainingUses": 2,
      "validFrom": "2025-01-01T00:00:00.000Z",
      "validUntil": "2025-06-30T23:59:59.999Z",
      "status": "active",
      "minOrderAmount": 0,
      "maxDiscountAmount": null,
      "applicableProducts": [],
      "applicableCategories": [],
      "assignedBy": "admin123",
      "assignedAt": "2025-01-15T10:30:00.000Z",
      "metadata": {
        "source": "bulk",
        "notes": "Win-back campaign"
      }
    },
    // ... more coupons
  ]
}
```

---

## 3. Get Global Coupon Details

**Endpoint:** `GET /api/publicApi/coupons/global/:code`

**Description:** Returns public information about a global coupon (no sensitive data).

**When to Use:**
- Display coupon terms and conditions
- Show campaign landing page details
- Marketing pages with coupon info

**URL Parameter:**
```typescript
code: string;  // Coupon code (case-insensitive)

// Example
GET /api/publicApi/coupons/global/SUMMER2025
```

**Response (200 OK):**
```typescript
interface GetGlobalCouponResponse {
  success: true;
  data: {
    code: string;
    name: string;
    description: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    validFrom: string;              // ISO date
    validUntil: string;             // ISO date
    minOrderAmount: number;
    firstOrderOnly: boolean;
    applicableProducts?: string[];
    applicableCategories?: string[];
  };
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "code": "SUMMER2025",
    "name": "Summer Sale 2025",
    "description": "Special summer discount for all customers",
    "discountType": "percentage",
    "discountValue": 15,
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validUntil": "2025-03-31T23:59:59.999Z",
    "minOrderAmount": 500,
    "firstOrderOnly": false,
    "applicableProducts": [],
    "applicableCategories": []
  }
}
```

**Error Response (404):**
```typescript
interface CouponNotFoundResponse {
  success: false;
  message: "Coupon not found or inactive";
}
```

---

## 4. Check Auto-Apply Coupon

**Endpoint:** `POST /api/publicApi/coupons/auto-apply`

**Description:** Finds and returns the best auto-apply coupon available for a customer.

**When to Use:**
- Automatically apply best coupon on page load
- Show "Best discount available" banner
- One-click coupon application

**Request Body:**
```typescript
interface AutoApplyCouponRequest {
  customerPhone: string;         // Customer's 11-digit phone number
  orderTotal: number;            // Current cart total
  products?: Array<{             // Optional products array
    productId: string;
    category?: string;
    quantity: number;
  }>;
}

// Example Request
{
  "customerPhone": "01712345678",
  "orderTotal": 1500,
  "products": [
    {
      "productId": "507f1f77bcf86cd79943911",
      "category": "electronics",
      "quantity": 2
    }
  ]
}
```

**Response (200 OK) - Coupon Found:**
```typescript
interface AutoApplySuccessResponse {
  success: true;
  message: "Auto-apply coupon found";
  data: {
    code: string;                  // "SUMMER2025"
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    discountAmount: number;          // 225
    maxUses: number;                // Remaining uses
    validUntil: string;
  };
}
```

**Response (200 OK) - No Coupon:**
```typescript
interface NoAutoApplyResponse {
  success: true;
  message: "No auto-apply coupons available";
  data: null;
}
```

**Example Response (Coupon Found):**
```json
{
  "success": true,
  "message": "Auto-apply coupon found",
  "data": {
    "code": "SUMMER2025",
    "discountType": "percentage",
    "discountValue": 15,
    "discountAmount": 225,
    "maxUses": 3,
    "validUntil": "2025-03-31T23:59:59.999Z"
  }
}
```

---

## Frontend Integration Examples

### React + TypeScript

**1. Install Axios**
```bash
npm install axios
```

**2. Create API Client**
```typescript
// src/services/couponApi.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  discountAmount: number;
  maxUses?: number;
  validUntil: string;
}

export interface ValidateCouponResponse {
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    coupon?: Coupon;
    error?: string;
  };
}

export const couponApi = {
  // Validate coupon before order
  async validateCoupon(
    couponCode: string,
    customerPhone: string,
    orderTotal: number,
    products?: Array<{ productId: string; category?: string; quantity: number }>
  ): Promise<ValidateCouponResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/publicApi/coupons/validate`,
        {
          couponCode: couponCode.toUpperCase(),
          customerPhone,
          orderTotal,
          products
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error validating coupon',
        data: {
          valid: false,
          error: error.response?.data?.message || 'Network error'
        }
      };
    }
  },

  // Get customer's coupons
  async getMyCoupons(phone: string): Promise<any> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/publicApi/coupons/my/${phone}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching coupons',
        data: []
      };
    }
  },

  // Check auto-apply coupon
  async checkAutoApply(
    customerPhone: string,
    orderTotal: number,
    products?: Array<any>
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/publicApi/coupons/auto-apply`,
        {
          customerPhone,
          orderTotal,
          products
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error checking auto-apply',
        data: null
      };
    }
  },

  // Get global coupon details
  async getCouponDetails(code: string): Promise<any> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/publicApi/coupons/global/${code}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Coupon not found'
      };
    }
  }
};
```

**3. React Component - Checkout Form**
```typescript
// src/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { couponApi } from '../services/couponApi';

interface CheckoutFormProps {
  customerPhone: string;
  orderTotal: number;
  products: any[];
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerPhone,
  orderTotal,
  products
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myCoupons, setMyCoupons] = useState<any[]>([]);

  // Load customer's coupons on mount
  useEffect(() => {
    const loadCoupons = async () => {
      const response = await couponApi.getMyCoupons(customerPhone);
      if (response.success) {
        setMyCoupons(response.data);
      }
    };
    loadCoupons();
  }, [customerPhone]);

  // Validate coupon on input change
  const handleCouponChange = async (code: string) => {
    setCouponCode(code);
    setError('');

    if (code.length >= 3) {
      setLoading(true);
      const response = await couponApi.validateCoupon(
        code,
        customerPhone,
        orderTotal,
        products
      );
      setLoading(false);

      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
      } else {
        setError(response.data.error || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    }
  };

  // Apply coupon from "My Coupons" list
  const applyCoupon = (coupon: any) => {
    setCouponCode(coupon.code);
    setAppliedCoupon(coupon);
  };

  // Calculate discount
  const discount = appliedCoupon?.discountAmount || 0;
  const newTotal = Math.max(0, orderTotal - discount);

  return (
    <div className="checkout-form">
      {/* Coupon Input */}
      <div className="coupon-section">
        <label>Apply Coupon Code</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => handleCouponChange(e.target.value)}
          placeholder="Enter coupon code"
          disabled={loading}
        />
        {loading && <span className="loading">Validating...</span>}
        {error && <span className="error">{error}</span>}
        {appliedCoupon && (
          <div className="applied-coupon">
            ✓ Coupon applied: {appliedCoupon.code}
            (Save {appliedCoupon.discountAmount} BDT)
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div>Subtotal: {orderTotal} BDT</div>
        <div>Discount: -{discount} BDT</div>
        <div className="total">Total: {newTotal} BDT</div>
      </div>

      {/* My Coupons Dropdown */}
      {myCoupons.length > 0 && (
        <div className="my-coupons">
          <h3>My Available Coupons</h3>
          {myCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="coupon-item"
              onClick={() => applyCoupon(coupon)}
            >
              <span>{coupon.code}</span>
              <span>
                {coupon.discountType === 'fixed'
                  ? `${coupon.discountValue} BDT off`
                  : `${coupon.discountValue}% off`}
              </span>
              <span>{coupon.remainingUses} uses left</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**4. React Hook - Auto-Apply Coupon**
```typescript
// src/hooks/useAutoApplyCoupon.ts
import { useState, useEffect } from 'react';
import { couponApi } from '../services/couponApi';

export const useAutoApplyCoupon = (
  customerPhone: string,
  orderTotal: number,
  products?: any[]
) => {
  const [autoCoupon, setAutoCoupon] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkAutoApply = async () => {
      if (!customerPhone || orderTotal === 0) return;

      setChecking(true);
      const response = await couponApi.checkAutoApply(
        customerPhone,
        orderTotal,
        products
      );
      setChecking(false);

      if (response.success && response.data) {
        setAutoCoupon(response.data);
      }
    };

    checkAutoApply();
  }, [customerPhone, orderTotal]);

  const removeAutoCoupon = () => {
    setAutoCoupon(null);
  };

  return { autoCoupon, checking, removeAutoCoupon };
};
```

---

## Order Creation Integration

### Including Coupon in Order Request

When creating an order, include the `couponCode` field:

```typescript
interface CreateOrderRequest {
  customerInformation: {
    customer: {
      name: string;
      email?: string;
      phoneNumber: string;        // Must match coupon's customer phone
    };
  };
  transectionData: {
    totalPrice: number;            // Before discount
    discount: number;              // Will be adjusted by backend
    deliveryCharge: number;
    paid: number;
  };
  products: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  couponCode?: string;              // ← ADD THIS FIELD
}

// Example
const orderRequest: CreateOrderRequest = {
  customerInformation: {
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "01712345678"
    }
  },
  transectionData: {
    totalPrice: 1500,
    discount: 0,               // Backend will add coupon discount
    deliveryCharge: 60,
    paid: 0
  },
  products: [
    {
      id: "prod1",
      productId: "507f1f77bcf86cd79943911",
      name: "Product A",
      quantity: 2,
      unitPrice: 750,
      totalPrice: 1500
    }
  ],
  couponCode: "SUMMER2025"    // ← Applied coupon code
};

// Send order creation request
await fetch('/api/publicApi/order/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderRequest)
});
```

### What Happens Backend

1. **Pre-Validation:**
   - Coupon code validated before order creation
   - Returns error if invalid
   - Prevents failed orders

2. **Discount Application:**
   - Coupon discount added to existing discount
   - Order total recalculated
   - Applied coupon info stored in order

3. **Order Creation:**
   - Order created with applied coupon details
   - SMS sent (coupon usage or regular)

4. **Usage Tracking:**
   - Coupon marked as used
   - Usage count incremented
   - Usage log created

---

## UI/UX Best Practices

### 1. Real-Time Validation

✅ **DO:** Validate coupon as user types (debounced)
```typescript
const debouncedValidate = useMemo(
  () => debounce(async (code) => {
    const response = await couponApi.validateCoupon(code, phone, total);
    // Show result
  }, 500),
  [phone, total]
);
```

❌ **DON'T:** Wait until form submission

---

### 2. Clear Error Messages

✅ **DO:** Clear errors when user starts typing
```typescript
const handleInputChange = (value: string) => {
  setCouponCode(value);
  setError('');  // Clear previous errors
};
```

❌ **DON'T:** Keep old error messages

---

### 3. Show Remaining Uses

✅ **DO:** Display how many uses are left
```typescript
<CouponItem>
  {coupon.code} - {coupon.remainingUses} of {coupon.maxUses} uses remaining
</CouponItem>
```

❌ **DON'T:** Hide usage information

---

### 4. Handle Auto-Apply Gracefully

✅ **DO:** Show loading state while checking
```typescript
{checkingAutoApply ? (
  <Spinner />  // Checking for best coupon...
) : (
  <CouponBanner coupon={autoCoupon} />
)}
```

❌ **DON'T:** Block UI while checking

---

### 5. Mobile-Friendly Input

✅ **DO:** Use uppercase and auto-focus
```typescript
<input
  type="text"
  value={couponCode.toUpperCase()}
  placeholder="ENTER CODE"
  autoFocus={true}
/>
```

❌ **DON'T:** Use case-sensitive input

---

## Testing Scenarios

### Test Case 1: Valid Global Coupon

```typescript
// Input
couponCode: "SUMMER2025"
customerPhone: "01712345678"
orderTotal: 1500

// Expected Response
{
  "success": true,
  "data": {
    "valid": true,
    "coupon": {
      "code": "SUMMER2025",
      "discountType": "percentage",
      "discountValue": 15,
      "discountAmount": 225    // 15% of 1500
    }
  }
}
```

---

### Test Case 2: Expired Coupon

```typescript
// Input
couponCode: "EXPIRED2024"
customerPhone: "01712345678"

// Expected Response
{
  "success": false,
  "data": {
    "valid": false,
    "error": "Invalid or expired coupon code"
  }
}
```

---

### Test Case 3: Usage Limit Reached

```typescript
// If customer already used coupon 3 times (max uses)
couponCode: "LIMITED2025"
customerPhone: "01712345678"

// Expected Response
{
  "success": false,
  "data": {
    "valid": false,
    "error": "You have already used this coupon 3 time(s)"
  }
}
```

---

### Test Case 4: Minimum Order Not Met

```typescript
// Coupon requires min 500, order total is 300
couponCode: "MIN500"
customerPhone: "01712345678"
orderTotal: 300

// Expected Response
{
  "success": false,
  "data": {
    "valid": false,
    "error": "Minimum order amount of 500 BDT is required"
  }
}
```

---

## Rate Limiting

All endpoints are rate-limited:
```
10 requests per minute per IP address
```

Headers included in response:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640975200000
```

When limit exceeded:
```typescript
interface RateLimitResponse {
  success: false;
  message: "Too many requests. Please try again later.";
}
```

---

## Error Handling

### Common Error Codes

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Invalid or expired coupon code" | Coupon doesn't exist or is expired | Check coupon code and expiry date |
| "This coupon has reached its maximum usage limit" | Total usage limit exceeded | No longer available |
| "You have already used this coupon X time(s)" | Customer exceeded per-customer limit | Cannot use again |
| "This coupon is only valid for first orders" | First-order restriction | Only for new customers |
| "Minimum order amount of X BDT is required" | Order total below minimum | Add more items |
| "This coupon is not applicable to any products in your cart" | Product/category restrictions | Cart doesn't match |

---

## Network Error Handling

```typescript
const validateCoupon = async (
  couponCode: string,
  customerPhone: string,
  orderTotal: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/publicApi/coupons/validate`,
      { couponCode, customerPhone, orderTotal }
    );
    return response.data;
  } catch (error: any) {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    }
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: 'Request timeout. Please try again.'
      };
    }
    // Handle rate limit
    if (error.response?.status === 429) {
      return {
        success: false,
        message: 'Too many requests. Please wait a moment.'
      };
    }
    // Handle other errors
    return {
      success: false,
      message: 'Unable to validate coupon. Please try again.'
    };
  }
};
```

---

## Support & Contact

For API integration support:
- **Email:** integration-support@priorbd.com
- **Documentation:** https://docs.priorbd.com/api
- **Status Page:** https://status.priorbd.com
- **GitHub Issues:** https://github.com/your-org/priorbd-api/issues
