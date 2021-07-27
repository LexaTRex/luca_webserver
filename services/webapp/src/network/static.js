const PUBLIC_URL_PATH = process.env.PUBLIC_URL;

export const getLicenses = () => {
  return fetch(`${PUBLIC_URL_PATH}/licenses.json`, {
    method: 'GET',
  }).then(response => response.json());
};

// Version
export const getVersion = () =>
  fetch(`${PUBLIC_URL_PATH}/version.json`).then(response => response.json());
