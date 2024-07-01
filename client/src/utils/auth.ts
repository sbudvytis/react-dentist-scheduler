import type { AuthUser } from "@mono/server/src/shared/entities";

const TOKEN_KEY = "token";

const getStoredAccessToken = (storage: Storage): string | null => {
  return storage.getItem(TOKEN_KEY);
};

const clearStoredAccessToken = (storage: Storage) => {
  storage.removeItem(TOKEN_KEY);
};

const clearSelectedId = (storage: Storage) => {
  storage.removeItem("selectedScheduleId");
};

const storeAccessToken = (storage: Storage, token: string) => {
  storage.setItem(TOKEN_KEY, token);
};

const getUserFromToken = (token: string): AuthUser => {
  return JSON.parse(atob(token.split(".")[1])).user;
};

const getUserIdFromToken = (token: string) => {
  return getUserFromToken(token).id;
};

export {
  getStoredAccessToken,
  clearStoredAccessToken,
  clearSelectedId,
  storeAccessToken,
  getUserFromToken,
  getUserIdFromToken,
};
