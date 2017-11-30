import { getKitty } from '../util/client/getKitty';
import getAllFullKitties from '../util/client/getAllFullKitties';
import canBreed from '../util/canBreed';
import humanReadableKitty from '../util/humanReadableKitty';
import _ from 'underscore';

export default async function bestSires(kittyId) {
  const kitty = await
    getKitty(kittyId);

  const { owner: { address }, cattributes } = kitty;

  if (typeof kittyId !== 'string' || typeof address !== 'string') {
    throw new Error('failed to get kitty with ID ' + kittyId);
  }

  const allKitties = await getAllFullKitties({ owner_wallet_address: address }, true);

  return _.chain(allKitties)
    .filter(kitty2 => canBreed(kitty, kitty2))
    .sortBy(({ cattributes: cattributes2 }) => _.intersection(cattributes, cattributes2).length)
    .map(kitty2 => ({
      ...humanReadableKitty(kitty2),
      numSharedAttributes: _.intersection(cattributes, kitty2.cattributes).length
    }))
    .value();
}