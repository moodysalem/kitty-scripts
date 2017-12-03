import _ from 'underscore';
import getRarityIndex from './rarityIndex';

const rarities = getRarityIndex();


const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

const totalAttributes = sum(_.map(rarities, count => count));

const rarityBase = Math.log10(totalAttributes);

export default function kittyRarity({ cattributes }) {
  if (cattributes.length === 0) {
    return Infinity;
  }

  return sum(
    cattributes.map(
      cattribute => Math.log10(rarities[ cattribute ] || 1) / rarityBase
    )
  ) / cattributes.length;
}

export function readableRarity(kitty) {
  return `1 in ${Math.round(kittyRarity(kitty) * 10000) / 100}`;
}