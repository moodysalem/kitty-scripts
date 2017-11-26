export default function kittyUrl(id) {
  return `https://private.cryptokitties.co/kitty/${id}`;
}

export function withKittyUrl(kitty) {
  return { ...kitty, kittyUrl: kittyUrl(kitty.id) };
}