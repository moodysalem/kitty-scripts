import _ from 'underscore';
import rarities from '../json/rarities';
import getAllFullKitties from '../util/client/getAllFullKitties';
import humanReadableKitty from '../util/humanReadableKitty';

const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

function kittyRarity({ cattributes }) {
  return sum(
    cattributes.map(cattribute => rarities[ cattribute ] || 1)
  );
}

// get all sales of gen 0 kitties that are below 0.003 eth
export default async function () {
  const allKitties = await getAllFullKitties();

  return _.chain(allKitties)
    .sortBy(kittyRarity)
    .first(10)
    .map(humanReadableKitty)
    .value();
}
