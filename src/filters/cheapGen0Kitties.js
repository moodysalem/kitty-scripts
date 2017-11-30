import _ from 'underscore';
import { getAllAuctions } from '../util/client/getAuctions';
import fromWei from '../util/fromWei';
import humanReadableKitty from '../util/humanReadableKitty';
import { getKittyWithCache } from '../util/client/getKittyWithCache';
import kittyRarity from '../util/kittyRarity';

export async function getCheapGenKitties(maxGeneration = 2, maxPrice = 0.005, type) {
  const lowGenCheapAuctions = _.filter(
    await getAllAuctions({ type }),
    ({ current_price, kitty: { generation } }) => fromWei(current_price) < maxPrice && generation <= maxGeneration
  );

  const kittyIds = lowGenCheapAuctions.map(({ kitty: { id } }) => id);

  // get full kitty objects for each of them
  const kittiesById = _.indexBy(
    await Promise.all(kittyIds.map(id => getKittyWithCache(id, false))),
    'id'
  );

  return _.chain(lowGenCheapAuctions)
  // swap the auction and kitty
    .map(({ kitty: { id }, ...rest }) => ({ ...kittiesById[ id ], auction: rest }))
    .value();
}

// get all sales of low gen kitties that are below 0.005 eth
export default async function cheapGen0Kitties(maxGeneration, maxPrice) {
  return _.chain(await getCheapGenKitties(null, maxGeneration, maxPrice))
  // swap the auction and kitty
    .sortBy(kittyRarity)
    .map(humanReadableKitty)
    .value();
}
