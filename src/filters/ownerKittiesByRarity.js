import { getAllKitties } from '../util/client/getKitties';
import { getKittyWithCache } from '../util/client/getKittyWithCache';
import humanReadableKitty from '../util/humanReadableKitty';
import kittyRarity from '../util/kittyRarity';
import _ from 'underscore';

export default async function ownerKittiesByRarity(ownerAddress) {
  if (typeof ownerAddress !== 'string') {
    throw new Error('invalid owner address');
  }

  const kitties = await getAllKitties({ owner_wallet_address: ownerAddress });

  const fullKitties = await Promise.all(kitties.map(({ id }) => getKittyWithCache(id)));

  return _.chain(fullKitties)
    .sortBy(kittyRarity)
    .map(humanReadableKitty)
    .value();
}