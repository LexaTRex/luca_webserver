export const bytesToBase64Url = data => {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const base64UrlToBytes = data => {
  return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
};
