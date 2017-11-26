import qs from 'qs';
import kittyUrl from '../kittyUrl';
import _ from 'underscore';
import { callApi } from '../client';

export function getAuctions(params) {
  return callApi(`/auctions?${qs.stringify(params)}`)
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

export async function getAllAuctions({ type = 'sale', status = 'open', ...rest }) {
  const { total } = await getAuctions({ ...rest, limit: 0, offset: 0, type, status });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, 1000),
    offset => getAuctions({ ...rest, limit: 1000, offset, type, status })
      .then(({ auctions }) => auctions)
  );

  // return all the page results
  return _.flatten(await Promise.all(promises));
}
