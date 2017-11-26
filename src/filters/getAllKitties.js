import { getAllAuctions, getKitty } from '../util/client';
import kittyCache from '../json/kittyCache';
import _ from 'underscore';

// refresh the kitty cache
export default async function getAuctionKitties() {
  const sales = await getAllAuctions({ type: 'sale' });
  const sires = await getAllAuctions({ type: 'sire' });

  const kittyIds = sales.map(({ kitty: { id } }) => id)
    .concat(sires.map(({ kitty: { id } }) => id));

  const kitties = await Promise.all(
    kittyIds.map(
      id => getKitty(id).catch(error => null)
    )
  );

  const noErrors = kitties.filter(kitty => kitty !== null);

  const byId = _.indexBy(noErrors, ({ id }) => id);

  return Object.assign(kittyCache, byId);
}