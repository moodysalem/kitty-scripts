import kittyUrl from './kittyUrl';

// parses a full kitty
export default function humanReadableKitty({ owner: { nickname, address }, name, id, children, color, generation }) {
  return {
    id,
    kittyUrl: kittyUrl(id),
    name,
    owner: nickname || address,
    numChildren: children.length,
    color,
    generation
  };
}