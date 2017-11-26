import _ from 'underscore';
import getAllFullKitties from '../util/client/getAllFullKitties';
import humanReadableKitty from '../util/humanReadableKitty';
import kittyRarity from '../util/kittyRarity';

// get all sales of gen 0 kitties that are below 0.003 eth
export default async function () {
  const allKitties = await getAllFullKitties();

  return _.chain(allKitties)
    .sortBy(kittyRarity)
    .first(10)
    .map(humanReadableKitty)
    .value();
}
