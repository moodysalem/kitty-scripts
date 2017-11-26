import kittyUrl from './kittyUrl';
import kittyRarity from './kittyRarity';
import rarities from '../json/rarities';
import _ from 'underscore';

// parses a full kitty
export default function humanReadableKitty(kitty) {
  const { owner: { nickname, address }, cattributes, name, id, children, color, generation } = kitty;
  return {
    id,
    kittyUrl: kittyUrl(id),
    name,
    owner: nickname || address,
    numChildren: children.length,
    color,
    generation,
    cattributes: _.sortBy(cattributes, cattribute => rarities[ cattribute ] || 1).join(', '),
    rarity: kittyRarity(kitty)
  };
}