/**
 * SHA-256 hashing utility for Facebook CAPI Advanced Matching
 * Meta requires PII (email, phone) to be SHA-256 hashed before sending
 */

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): Promise<string> {
  const digits = phone.replace(/\D/g, "");
  return sha256(digits);
}

export async function hashEmail(email?: string): Promise<string | undefined> {
  if (!email) return undefined;
  return sha256(normalizeEmail(email));
}

export async function hashPhone(phone?: string): Promise<string | undefined> {
  if (!phone) return undefined;
  return normalizePhone(phone);
}

export async function hashUserData(data: {
  email?: string;
  phone?: string;
}): Promise<{ em?: string; ph?: string }> {
  const [em, ph] = await Promise.all([
    data.email ? hashEmail(data.email) : Promise.resolve(undefined),
    data.phone ? hashPhone(data.phone) : Promise.resolve(undefined),
  ]);
  return { em, ph };
}
