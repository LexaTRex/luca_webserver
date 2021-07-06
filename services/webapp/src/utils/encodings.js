export const bytesToBase64Url = data => {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
