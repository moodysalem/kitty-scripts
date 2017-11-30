import { getAllKitties } from './getKitties';
import { getKittyWithCache } from './getKittyWithCache';

export default async function getAllFullKitties(params) {
  const kitties = await getAllKitties(params);

  return await Promise.all(
    kitties.map(({ id }) => getKittyWithCache(id))
  );
}