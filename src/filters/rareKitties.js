import { getAllAuctions, getKitty } from '../util/client';
import _ from 'underscore';
import rarities from '../json/rarities';

const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

function kittyRarity({ cattributes }) {
  return sum(cattributes.map(cattribute => rarities[ cattribute ] || 1));
}

// get all sales of gen 0 kitties that are below 0.003 eth
export default async function () {
  const auctions = await getAllAuctions({ type: 'sale' });

  // get all the cattributes
  const kitties = await Promise.all(
    auctions.map(({ kitty: { id } }) => getKitty(id))
  );

  return _.chain(kitties)
    .sortBy(kittyRarity)
    .first(10)
    .map(({ kittyUrl, owner: { nickname }, name, children, generation }) => ({
      name,
      kittyUrl,
      owner: nickname,
      numChildren: children.length,
      generation
    }));
}
