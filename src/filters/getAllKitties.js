import { getAllKitties } from '../util/client/getKitties';
import { getKittyWithCache } from '../util/client/getKittyWithCache';

// refresh the kitty cache
export default async function getAuctionKitties() {
  const kitties = await getAllKitties();

  let fetched = 0;

  while (kitties.length > 0) {
    const next = kitties.splice(0, 10);

    await Promise.all(
      next.map(
        ({ id }) =>
          getKittyWithCache(id)
            .then(() => fetched++)
            .catch(() => null)
      )
    );
  }

  return { total: kitties.length, fetched };
}