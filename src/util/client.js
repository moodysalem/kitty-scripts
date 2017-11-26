import fetch from 'isomorphic-fetch';
import qs from 'qs';
import _ from 'underscore';
import kittyCache from '../json/kittyCache';

const api = `https://api.cryptokitties.co`;

function kittyUrl(id) {
  return `https://private.cryptokitties.co/kitty/${id}`;
}

export function getKitty(id) {
  if (kittyCache[ '' + id ]) {
    return Promise.resolve({ ...kittyCache[ '' + id ], kittyUrl: kittyUrl(id) });
  }

  return fetch(`${api}/kitties/${id}`)
    .then(response => response.json())
    .then(kitty => ({ ...kitty, kittyUrl: kittyUrl(id) }));
}

export function getAuctions(params) {
  return fetch(`${api}/auctions?${qs.stringify(params)}`)
    .then(response => response.json())
    .then(
      ({ auctions, ...rest }) =>
        ({
          auctions: auctions.map(
            ({ kitty, ...rest }) => ({
              kittyUrl: kittyUrl(kitty.id),
              kitty,
              ...rest
            })
          ),
          ...rest
        })
    );
}

export async function getAllAuctions({ type = 'sale', status = 'open' }) {
  const { total } = await getAuctions({ limit: 0, offset: 0, type, status });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, 1000),
    offset => getAuctions({ limit: 1000, offset, type, status })
      .then(({ auctions }) => auctions)
  );

  // return all the page results
  return _.flatten(await Promise.all(promises));
}

export function fromWei(num) {
  return num / Math.pow(10, 18);
}
