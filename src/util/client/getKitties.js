import qs from 'qs';
import _ from 'underscore';
import { callApi, MAX_PAGE_SIZE } from '../client';

export function getKitties(params) {
  return callApi(`/kitties?${qs.stringify(params)}`);
}

export async function getAllKitties(params) {
  const { total } = await getKitties({ ...params, limit: 1, offset: 0 });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, MAX_PAGE_SIZE),
    offset => getKitties({ ...params, limit: MAX_PAGE_SIZE, offset })
      .then(({ kitties }) => kitties)
  );

  // return all the page results
  const allKitties = _.flatten(await Promise.all(promises));
  if (allKitties.length !== total) {
    console.error(`getAllKitties: invalid num of kitties.. got ${allKitties.length}, expected ${total}`);
  }

  return allKitties;
}
