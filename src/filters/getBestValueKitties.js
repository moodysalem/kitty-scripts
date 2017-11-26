import { getAllAuctions } from '../util/client/getAuctions';
import { getKittyWithCache } from '../util/client/getKittyWithCache';
import kittyRarity from '../util/kittyRarity';
import _ from 'underscore';
import humanReadableKitty from '../util/humanReadableKitty';
import fromWei from '../util/fromWei';

export default async function getBestValueKitties() {
  const sales = await getAllAuctions({ type: 'sire' });

  const kitties = await Promise.all(sales.map(({ kitty }) => getKittyWithCache(kitty.id)));

  return _.chain(kitties)
    .filter(({ auction: { current_price } }) => fromWei(current_price) <= 0.004)
    .sortBy(kittyRarity)
    .first(10)
    .sortBy(({ auction: { current_price } }) => fromWei(current_price))
    .map(humanReadableKitty)
    .value();
}