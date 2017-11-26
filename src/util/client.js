import fetch from 'isomorphic-fetch';

const API_URL = `https://api.cryptokitties.co`;

export function callApi(path, ...args) {
  return fetch(`${API_URL}${path.startsWith('/') ? '' : '/'}${path}`, ...args)
    .then(response => response.json());
}


