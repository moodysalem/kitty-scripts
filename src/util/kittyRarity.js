import _ from 'underscore';
import getRarityIndex from './rarityIndex';

const rarities = getRarityIndex();

const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

export default function kittyRarity({ cattributes }) {
  if (cattributes.length === 0) {
    return Infinity;
  }

  return sum(cattributes.map(cattribute => Math.log10(rarities[ cattribute ] || 1))) / cattributes.length;
}

export function readableRarity(kitty) {
  return `1 in ${Math.round(Math.pow(kittyRarity(kitty), 10))}`;
}