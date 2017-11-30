import kittyUrl from './kittyUrl';
import kittyRarity from './kittyRarity';
import rarities from '../json/rarities';
import _ from 'underscore';
import fromWei from './fromWei';

// parses a full kitty
export default function humanReadableKitty(kitty) {
  const { status, owner: { nickname, address }, auction: { type, current_price }, cattributes, name, id, children, color, generation } = kitty;
  return {
    id,
    kittyUrl: kittyUrl(id),
    name,
    owner: nickname || address,
    numChildren: children.length,
    color,
    generation,
    auction: type ? `${type} for ETH${fromWei(current_price)}` : null,
    is_ready: status ? status.is_ready : null,
    cattributes: _.sortBy(cattributes, cattribute => rarities[ cattribute ] || 1).join(', '),
    rarity: kittyRarity(kitty)
  };
}