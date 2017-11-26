import _ from 'underscore';
import rarities from '../json/rarities';

const sum = arr => _.reduce(arr, (memo, num) => memo + num, 0);

export default function kittyRarity({ cattributes }) {
  return sum(cattributes.map(cattribute => Math.log10(rarities[ cattribute ] || 1))) / cattributes.length;
}