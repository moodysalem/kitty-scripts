import { getKitty } from '../util/client/getKitty';
import getAllFullKitties from '../util/client/getAllFullKitties';
import canBreed from '../util/canBreed';
import humanReadableKitty from '../util/humanReadableKitty';
import _ from 'underscore';
import { getCheapGenKitties } from './cheapGen0Kitties';

export default async function bestSires(kittyId, maxPrice = 0.005) {
  const targetKitty = await getKitty(kittyId);

  const { owner: { address }, cattributes, generation } = targetKitty;

  if (typeof kittyId !== 'string' || typeof address !== 'string') {
    throw new Error('failed to get kitty with ID ' + kittyId);
  }

  const cheapGenKitties = await getCheapGenKitties(generation, 0.003, 'sire');

  const ownersKitties = await getAllFullKitties({ owner_wallet_address: address }, true);

  return _.chain(ownersKitties.concat(cheapGenKitties))
    .filter(kitty2 => kitty2.generation <= generation)
    .filter(kitty2 => canBreed(targetKitty, kitty2))
    .sortBy(({ cattributes: cattributes2 }) => _.intersection(cattributes, cattributes2).length)
    .map(kitty2 => ({
      ...humanReadableKitty(kitty2),
      numSharedAttributes: _.intersection(cattributes, kitty2.cattributes).length
    }))
    .value();
}