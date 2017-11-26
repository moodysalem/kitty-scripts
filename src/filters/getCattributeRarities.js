import getAllFullKitties from '../util/client/getAllFullKitties';
import _ from 'underscore';

export default async function getCattributeRarities() {
  const kitties = await getAllFullKitties();

  const rarities = {};

  _.each(
    kitties,
    ({ cattributes }) =>
      _.each(
        cattributes,
        cattribute => rarities[ cattribute ] = (rarities[ cattribute ] || 0) + 1
      )
  );

  return rarities;
}