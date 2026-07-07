# Express Backend CAPI Implementation Guide

## Overview

This guide provides the server-side Facebook Conversions API (CAPI) implementation for your Express backend. It handles Purchase and CompleteRegistration events, with idempotency protection to prevent duplicate orders.

## Files to Create

### 1. `services/facebookCapi.js` — CAPI Event Service

```javascript
const crypto = require("crypto");

class FacebookCapiService {
  constructor() {
    this.pixelId = process.env.FB_PIXEL_ID;
    this.accessToken = process.env.FB_CAPI_ACCESS_TOKEN;
    this.graphUrl = `https://graph.facebook.com/v19.0/${this.pixelId}/events`;
  }

  /**
   * Hash user data for Advanced Matching
   * Meta requires SHA-256 hashing of PII fields
   */
  hashData(data) {
    if (!data) return undefined;
    return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
  }

  /**
   * Send event to Meta Conversions API
   * @param {Object} eventData - The event data
   * @param {string} eventData.eventName - Event name (Purchase, CompleteRegistration, etc.)
   * @param {Object} eventData.userData - User data with optional fbc, fbp, email, phone
   * @param {Object} eventData.customData - Event-specific data (value, currency, etc.)
   * @param {string} eventData.eventId - Event ID for deduplication with Pixel
   * @param {string} eventData.clientIpAddress - Client's IP address
   * @param {string} eventData.clientUserAgent - Client's user agent
   * @param {number} [eventData.eventTime] - Unix timestamp (default: now)
   */
  async sendEvent({
    eventName,
    userData = {},
    customData = {},
    eventId,
    clientIpAddress,
    clientUserAgent,
    eventTime,
  }) {
    if (!this.pixelId || !this.accessToken) {
      console.warn("[CAPI] Missing FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN");
      return { success: false, error: "Missing configuration" };
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime || Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          user_data: {
            // Advanced Matching - hashed PII
            ...(userData.email && { em: this.hashData(userData.email) }),
            ...(userData.phone && { ph: this.hashData(userData.phone) }),
            // Browser IDs for matching
            ...(userData.fbc && { fbc: userData.fbc }),
            ...(userData.fbp && { fbp: userData.fbp }),
            // Client info
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
          },
          custom_data: {
            currency: customData.currency || "BDT",
            value: customData.value || 0,
            ...customData,
          },
        },
      ],
    };

    try {
      const response = await fetch(this.graphUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          access_token: this.accessToken,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`[CAPI] ${eventName} sent successfully`, {
          eventId,
          eventsReceived: result.events_received,
        });
        return { success: true, data: result };
      } else {
        console.error(`[CAPI] ${eventName} failed`, result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error(`[CAPI] ${eventName} error`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Purchase event
   */
  async sendPurchase({
    orderId,
    value,
    currency = "BDT",
    items = [],
    userData,
    eventId,
    clientIpAddress,
    clientUserAgent,
  }) {
    return this.sendEvent({
      eventName: "Purchase",
      eventId,
      userData,
      clientIpAddress,
      clientUserAgent,
      customData: {
        value,
        currency,
        content_type: "product",
        content_ids: items.map((item) => item.item_id || item.sku),
        num_items: items.length,
        order_id: orderId,
      },
    });
  }

  /**
   * Send CompleteRegistration event
   */
  async sendCompleteRegistration({
    userData,
    eventId,
    clientIpAddress,
    clientUserAgent,
  }) {
    return this.sendEvent({
      eventName: "CompleteRegistration",
      eventId,
      userData,
      clientIpAddress,
      clientUserAgent,
      customData: {
        content_name: "User Registration",
        status: "completed",
      },
    });
  }
}

module.exports = new FacebookCapiService();
```

### 2. `middleware/idempotency.js` — Duplicate Order Prevention

```javascript
const crypto = require("crypto");

/**
 * In-memory idempotency store
 * For production, use Redis with TTL
 */
const idempotencyStore = new Map();

// Clean up old keys every hour
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  for (const [key, value] of idempotencyStore.entries()) {
    if (value.timestamp < oneHourAgo) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

/**
 * Idempotency middleware
 * Prevents duplicate order creation within a time window
 *
 * Usage: router.post("/order/create", idempotencyMiddleware, createOrder)
 */
function idempotencyMiddleware(req, res, next) {
  const idempotencyKey = req.body?.idempotencyKey;

  if (!idempotencyKey) {
    // No idempotency key — allow but warn
    console.warn("[Idempotency] No idempotency key provided");
    return next();
  }

  // Check if this key was already used
  if (idempotencyStore.has(idempotencyKey)) {
    const existing = idempotencyStore.get(idempotencyKey);
    console.warn("[Idempotency] Duplicate request blocked", {
      idempotencyKey,
      originalTimestamp: new Date(existing.timestamp).toISOString(),
      responseData: existing.response,
    });

    // Return the original response
    return res.status(200).json({
      success: true,
      data: existing.response,
      message: "Order already processed (idempotent)",
    });
  }

  // Store this key with a 24-hour TTL
  idempotencyStore.set(idempotencyKey, {
    timestamp: Date.now(),
    response: null, // Will be updated after order creation
  });

  // Patch res.json to capture the response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (body?.success && body?.data) {
      const stored = idempotencyStore.get(idempotencyKey);
      if (stored) {
        stored.response = body.data;
      }
    }
    return originalJson(body);
  };

  next();
}

module.exports = { idempotencyMiddleware, idempotencyStore };
```

### 3. `routes/order.js` — Modified Order Route (example)

```javascript
const express = require("express");
const router = express.Router();
const { idempotencyMiddleware } = require("../middleware/idempotency");
const facebookCapi = require("../services/facebookCapi");

// Existing order creation logic...
const createOrderHandler = async (req, res) => {
  try {
    const { customerInformation, products, transectionData, _capi, idempotencyKey } = req.body;

    // ... your existing order creation logic ...
    const order = await OrderModel.create({
      // ... order data
    });

    // Fire CAPI Purchase event after successful order creation
    if (_capi) {
      const clientIpAddress =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
      const clientUserAgent = _capi.userAgent || req.headers["user-agent"];

      // Fire CAPI event asynchronously (don't block the response)
      facebookCapi
        .sendPurchase({
          orderId: order.orderNumber || order.id,
          value: transectionData?.totalPrice || 0,
          currency: "BDT",
          items: products.map((p) => ({
            item_id: p.sku || p.id,
            item_name: p.name,
            price: p.unitPrice,
            quantity: p.quantity,
          })),
          userData: {
            email: customerInformation?.customer?.email,
            phone: customerInformation?.customer?.phoneNumber,
            fbc: _capi.fbc,
            fbp: _capi.fbp,
          },
          eventId: _capi.eventId, // For deduplication with Pixel
          clientIpAddress,
          clientUserAgent,
        })
        .catch((err) => console.error("[CAPI] Purchase event failed:", err));
    }

    res.json({
      success: true,
      data: {
        order,
        orderId: order.id,
      },
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  }
};

// Apply idempotency middleware to prevent duplicate orders
router.post("/order/create", idempotencyMiddleware, createOrderHandler);

module.exports = router;
```

## Environment Variables

Add to your Express backend `.env`:

```env
# Facebook CAPI Configuration
FB_PIXEL_ID=your_pixel_id_here
FB_CAPI_ACCESS_TOKEN=your_access_token_here
```

### Getting the Access Token

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager** → **Settings**
3. Under **Conversions API**, click **Generate Access Token**
4. Copy the token to your `.env` file

## How It Works

### Flow Diagram

```
Client Browser                    Express Backend
─────────────                     ──────────────
1. User clicks "Place Order"
2. Generate idempotencyKey
3. Hash email/phone (SHA-256)
4. Capture fbc/fbp cookies
5. Generate event_id
6. POST /order/create ──────────▶ 7. Check idempotency key
   {                                8. If duplicate → return cached response
     products,                      9. Create order in DB
     customerInformation,          10. Store response with key
     idempotencyKey,               11. Fire CAPI Purchase event
     _capi: {                         (with same event_id as Pixel)
       fbc, fbp,                   12. Return success response
       email, phone,
       userAgent
     }
   }
                                  ┌─────────────────────────┐
   ◀──────────────────────────────│  Meta Graph API         │
   13. Redirect to thank-you      │  POST /events           │
                                   │  event_id: "abc123"     │
                                   │  user_data: {           │
                                   │    em: sha256(email)    │
                                   │    ph: sha256(phone)    │
                                   │    fbc: "..."           │
                                   │    fbp: "..."           │
                                   │  }                      │
                                   │  custom_data: {         │
                                   │    value: 1500          │
                                   │    currency: "BDT"      │
                                   │    content_ids: [...]   │
                                   │  }                      │
                                   └─────────────────────────┘

Meta receives BOTH events:
- From Pixel (client): event_id = "abc123"
- From CAPI (server): event_id = "abc123"

Meta deduplicates → counts as ONE Purchase event
```

## Idempotency Protection

### How It Works

1. **Frontend** generates a UUID (`idempotencyKey`) before each order attempt
2. **Backend** checks if this key exists in the store
3. If **duplicate** → returns the original response (no double order)
4. If **new** → processes order and stores the response

### Example Scenario

```
User clicks "Place Order" (slow network)
  → Frontend sends request with key "uuid-123"
  → Backend creates order, stores response with "uuid-123"

User clicks again (frustrated)
  → Frontend sends request with NEW key "uuid-456"
  → Backend creates second order (different key = different request)

⚠️ PROBLEM: Two orders created because each click generates a new key
```

### Better Protection: Persist Key on Click

To truly prevent duplicates, generate the key BEFORE the click and reuse it:

```javascript
// In checkout page, generate key on mount or before button render
const [idempotencyKey] = useState(() => crypto.randomUUID());

// Use the same key for all attempts
const orderData = {
  // ...
  idempotencyKey,
};
```

This is already implemented in the checkout page changes above.

## Testing

### 1. Test CAPI Connection

```bash
curl -X POST https://graph.facebook.com/v19.0/{YOUR_PIXEL_ID}/events \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "event_name": "TestEvent",
      "event_time": 1234567890,
      "action_source": "website",
      "user_data": {
        "client_ip_address": "1.2.3.4",
        "client_user_agent": "test"
      },
      "custom_data": {
        "value": 100,
        "currency": "BDT"
      }
    }],
    "access_token": "YOUR_ACCESS_TOKEN"
  }'
```

### 2. Test Idempotency

```bash
# First request - creates order
curl -X POST http://localhost:3000/prior/order/create \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey": "test-key-1", "products": [...]}'

# Second request with same key - returns cached response
curl -X POST http://localhost:3000/prior/order/create \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey": "test-key-1", "products": [...]}'
```

### 3. Verify in Facebook Events Manager

1. Go to **Events Manager** → **Test Events**
2. Place a test order on your website
3. Verify both Pixel and CAPI events appear with the same event_id
4. Check that they're deduplicated (shown as 1 event, not 2)

## Monitoring

Add logging to track CAPI health:

```javascript
// In your order route, after CAPI call
console.log("[CAPI] Event sent", {
  eventName: "Purchase",
  orderId: order.id,
  eventId: _capi.eventId,
  success: capiResult.success,
});
```

## Troubleshooting

### Common Issues

1. **"Invalid Access Token"**
   - Check `FB_CAPI_ACCESS_TOKEN` in .env
   - Token may have expired — regenerate in Events Manager

2. **"No matching events"**
   - Ensure `event_id` matches between Pixel and CAPI
   - Check that Pixel fires with `event_id` in options

3. **"Deduplication not working"**
   - Verify same `event_id` is sent from both client and server
   - Events must have same `event_name` and `event_time` (within tolerance)

4. **High duplicate rate**
   - Ensure idempotency key is generated once per checkout session
   - Check if browser is sending duplicate requests

## Production Recommendations

1. **Use Redis for idempotency store** (instead of in-memory Map)
2. **Set up error monitoring** for failed CAPI events
3. **Monitor deduplication rate** in Events Manager
4. **Keep access token secure** — never expose in client-side code
5. **Set up alerts** for CAPI failures
