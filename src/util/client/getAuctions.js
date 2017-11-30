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

const MAX_PAGE_SIZE = 100;

export async function getAllAuctions({ status = 'open', ...rest } = {}) {
  const { total } = await getAuctions({ ...rest, limit: 0, offset: 0, status });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, MAX_PAGE_SIZE),
    offset => getAuctions({ ...rest, limit: MAX_PAGE_SIZE, offset, status })
      .then(({ auctions }) => auctions)
  );


  // return all the page results
  const result = _.flatten(await Promise.all(promises));

  if (result.length !== total) {
    throw new Error('not expected number of results');
  }

  return result;
}
