import { PRIVATE_KEY_MODAL_SEEN_STORAGE_KEY } from 'constants/storage';

export const setHasSeenPrivateKeyModal = value => {
  sessionStorage.setItem(PRIVATE_KEY_MODAL_SEEN_STORAGE_KEY, value.toString());
};
export const hasSeenPrivateKeyModal = () => {
  return sessionStorage.getItem(PRIVATE_KEY_MODAL_SEEN_STORAGE_KEY);
};
export const clearHasSeenPrivateKeyModal = () =>
  sessionStorage.removeItem(PRIVATE_KEY_MODAL_SEEN_STORAGE_KEY);
