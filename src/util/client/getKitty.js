import { callApi } from '../client';

export function getKitty(id) {
  return callApi(`/kitties/${id}`);
}
