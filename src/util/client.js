import fetch from 'isomorphic-fetch';
import PQueue from 'p-queue';

const API_URL = `https://api.cryptokitties.co`;

// only 25 requests at a time
const Q = new PQueue({ concurrency: 25 });

function retry(action, times = 3) {
  return action()
    .catch(
      error => {
        if (times > 0) {
          console.error('failed... trying again', error);
          return retry(action, times - 1);
        } else {
          console.error('failed again!!!', error);
          throw error;
        }
      }
    );
}

const retryFetch = (...args) => retry(() => fetch(...args), 3);

export function callApi(path, ...args) {
  const url = `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  return Q.add(
    () => {
      console.log(`fetching: ${url}`);

      return retryFetch(url, ...args)
        .then(response => response.json())
        .then(json => {
          console.log(`fetched: ${url}`);
          return json;
        })
        .catch(error => {
          console.error(`Got error from callApi`, error);
          throw error;
        });
    }
  );
}


