import getAllFullKitties from '../util/client/getAllFullKitties';
import canBreed from '../util/canBreed';
import humanReadableKitty from '../util/humanReadableKitty';
import _ from 'underscore';
import kittyRarity, { readableRarity } from '../util/kittyRarity';

export default async function bestSires(ownerAddress) {
  if (typeof ownerAddress !== 'string') {
    throw new Error('ownerAddress must be string');
  }

  const ownersKitties = await getAllFullKitties({ owner_wallet_address: ownerAddress }, true);

  const pairs = _.flatten(
    _.map(
      ownersKitties,
      (kitty1, index) =>
        _.map(
          ownersKitties.slice(index),
          kitty2 => [ kitty1, kitty2 ]
        )
    ),
    true
  );

  const breedablePairs = _.filter(
    pairs,
    ([ kitty1, kitty2 ]) => canBreed(kitty1, kitty2)
  );

  return _.chain(breedablePairs)
    .map(([ k1, k2 ]) => ({
      k1,
      k2,
      sharedAttributes: _.intersection(k1.cattributes, k2.cattributes),
      sharedRarity: kittyRarity({ cattributes: k1.cattributes.concat(k2.cattributes) }),
      readableRarity: readableRarity({ cattributes: k1.cattributes.concat(k2.cattributes) }),
      generationChild: Math.max(k1.generation, k2.generation) + 1
    }))
    .map(({ k1, k2, ...rest }) => ({ k1: humanReadableKitty(k1), k2: humanReadableKitty(k2), ...rest }))
    .sortBy(({ sharedRarity }) => sharedRarity)
    .sortBy(({ sharedAttributes }) => sharedAttributes.length)
    .sortBy(({ generationChild }) => generationChild)
    .first(5)
    .value();
}