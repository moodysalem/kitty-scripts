import { getAllKitties } from './getKitties';
import { getKittyWithCache } from './getKittyWithCache';

export default async function getAllFullKitties() {
  const kitties = await getAllKitties();
  return await Promise.all(
    kitties.map(({ id }) => getKittyWithCache(id))
  );
}