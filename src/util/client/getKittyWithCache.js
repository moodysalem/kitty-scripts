import kittyCache from '../../json/kittyCache';
import { getKitty } from './getKitty';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';

const flushCache = _.debounce(
  () => {
    fs.writeFileSync(path.join(__dirname, '..', '..', 'json', 'kittyCache.json'), JSON.stringify(kittyCache));
  },
  1000
);

export async function getKittyWithCache(id, refresh = false) {
  if (!refresh && kittyCache[ '' + id ]) {
    return kittyCache[ '' + id ];
  }

  const kitty = await getKitty(id);

  kittyCache[ kitty.id ] = kitty;

  flushCache();

  return kitty;
}