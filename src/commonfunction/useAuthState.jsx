import { useSyncExternalStore } from "react";
import { getAuthItem } from "./authStorage";

// Reading localStorage directly in a render body is an "impure" read of
// external mutable state — React (especially with the React Compiler's
// auto-memoization) can skip re-running that read on a re-render triggered
// by something else, leaving components like the header stuck showing a
// stale logged-out/logged-in view until an unrelated remount forces a fresh
// read. useSyncExternalStore is the correct way to subscribe to state that
// lives outside React, so every consumer reliably updates the moment auth
// changes, not just on their next full mount.

const AUTH_EVENT = "embellis:auth-changed";

// Call this right after any code writes/clears the auth-related
// localStorage keys (token/user/email/role/phone) so every subscribed
// component re-reads and re-renders immediately.
export const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const subscribe = (callback) => {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback); // keeps other tabs in sync too
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

export const useIsLoggedIn = () =>
  useSyncExternalStore(subscribe, () => Boolean(getAuthItem("token") || getAuthItem("user")));

export const useIsAdmin = () =>
  useSyncExternalStore(subscribe, () => getAuthItem("role") === "admin");
