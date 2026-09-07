// Auth data lives in localStorage when "Remember me" is checked (survives
// closing the browser) or sessionStorage when it isn't (cleared once the
// tab/browser closes). Every reader/writer of these keys should go through
// here instead of hard-coding one storage or the other.

export const AUTH_KEYS = ["token", "user", "email", "role", "phone"];

export const getAuthItem = (key) => sessionStorage.getItem(key) ?? localStorage.getItem(key);

export const setAuthData = (fields, remember) => {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null) return;
    target.setItem(key, value);
    other.removeItem(key); // avoid a stale copy lingering in the other storage
  });
};

export const clearAuthData = () => {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};
