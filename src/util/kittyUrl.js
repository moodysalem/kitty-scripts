export default function kittyUrl(id) {
  return `https://www.cryptokitties.co/kitty/${id}`;
}

export function withKittyUrl(kitty) {
  return { ...kitty, kittyUrl: kittyUrl(kitty.id) };
}