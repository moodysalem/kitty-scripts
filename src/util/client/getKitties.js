import qs from 'qs';
import _ from 'underscore';
import { callApi } from '../client';

export function getKitties(params) {
  return callApi(`/kitties?${qs.stringify(params)}`);
}

export async function getAllKitties(params) {
  const { total } = await getKitties({ ...params, limit: 0, offset: 0 });

  // fetch all the expected pages of kitties
  const promises = _.map(
    _.range(0, total, 1000),
    offset => getKitties({ ...params, limit: 1000, offset })
      .then(({ kitties }) => kitties)
  );

  // return all the page results
  const allKitties = _.flatten(await Promise.all(promises));
  if (allKitties.length !== total) {
    throw new Error('invalid num of kitties');
  }

  return allKitties;
}
