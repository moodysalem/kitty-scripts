import kittyCache from '../../json/kittyCache';
import { getKitty } from './getKitty';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';

const kittyCachePath = path.join(__dirname, '..', '..', 'json', 'kittyCache.json');
const flushCache = _.throttle(
  () => fs.writeFileSync(kittyCachePath, JSON.stringify(kittyCache)),
  10000
);

const TWENTY_FOUR_HOURS_MS = 1000 * 60 * 60 * 24;

export async function getKittyWithCache(id, refresh = false) {
  if (!refresh && kittyCache[ '' + id ]) {
    const cacheTimestamp = kittyCache[ '' + id ].cacheTimestamp;
    if (cacheTimestamp && cacheTimestamp > (new Date()).getTime() - TWENTY_FOUR_HOURS_MS) {
      return kittyCache[ '' + id ];
    }
  }

  const kitty = await getKitty(id);

  kittyCache[ kitty.id ] = kitty;

  flushCache();

  return kitty;
}