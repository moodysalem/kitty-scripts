import { getAllAuctions } from '../util/client/getAuctions';
import { getKittyWithCache } from '../util/client/getKittyWithCache';
import kittyRarity from '../util/kittyRarity';
import _ from 'underscore';
import humanReadableKitty from '../util/humanReadableKitty';
import fromWei from '../util/fromWei';

export default async function getBestValueKitties() {
  const sales = await getAllAuctions();

  const kitties = await Promise.all(sales.map(({ kitty }) => getKittyWithCache(kitty.id)));

  return _.chain(kitties)
    .filter(({ auction: { current_price } }) => fromWei(current_price) < 0.002)
    .first(10)
    .sortBy(kittyRarity)
    .map(humanReadableKitty)
    .value();
}