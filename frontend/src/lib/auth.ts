/**
 * JWT utility helpers for the frontend.
 * Full implementation in Phase 11.
 */

export interface DecodedToken {
  sub: string;
  role: "SYS_ADMIN" | "TAX_ADMIN";
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

/**
 * Decode a JWT payload (no signature verification — server validates).
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Check whether a JWT access token is expired.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // exp is in seconds; Date.now() in ms
  return decoded.exp * 1000 < Date.now();
}
