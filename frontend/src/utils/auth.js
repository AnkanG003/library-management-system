// Utility functions for decoding and verifying user session and roles from JWT

export function getStoredToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
}

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Extracts the user role directly from the signed JWT access token.
 * This prevents client-side tampering of localStorage.role from granting unauthorized UI access.
 */
export function getUserRole() {
  const token = getStoredToken();
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload || !payload.role) return null;

  // Spring Security outputs authorities like "ROLE_ADMIN" or "ROLE_MEMBER"
  return payload.role.startsWith("ROLE_")
    ? payload.role.substring(5)
    : payload.role;
}

export function getUsername() {
  const token = getStoredToken();
  if (!token) return localStorage.getItem("username") || null;

  const payload = parseJwt(token);
  return payload?.sub || localStorage.getItem("username") || null;
}
