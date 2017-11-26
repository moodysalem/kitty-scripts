import { getAllAuctions, getKitty } from '../util/client';
import _ from 'underscore';
import rarities from '../json/rarities';

const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

// get all sales of gen 0 kitties that are below 0.003 eth
export default async function () {
  const auctions = await getAllAuctions({ type: 'sale' });

  // get all the cattributes
  const kitties = await Promise.all(
    auctions.map(({ kitty: { id } }) => getKitty(id))
  );

  const scoredKitties = _.map(
    kitties,
    ({ cattributes, ...rest }) => ({
      cattributes,
      ...rest,
      rarity: sum(cattributes.map(cattribute => rarities[ cattribute ] || 1))
    })
  );

  return _.first(_.sortBy(scoredKitties, ({ rarity }) => rarity), 10).map(({ kittyUrl }) => kittyUrl);
}
