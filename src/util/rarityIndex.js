import rarities from '../json/rarities';
import _ from 'underscore';

export default function getRarityIndex() {
  return _.mapObject(
    _.indexBy(
      rarities,
      'attribute'
    ),
    ({ count }) => count
  );
}