export default function canBreed({ id: id1, matron: matron1, sire: sire1, status: { is_ready: is_ready1 } },
                                 { id: id2, matron: matron2, sire: sire2, status: { is_ready: is_ready2 } }) {
  return id1 !== id2 &&
    is_ready1 && is_ready2 &&
    (!matron1 || matron1.id !== id2) &&
    (!matron2 || matron2.id !== id1) &&
    (!sire1 || sire1.id !== id2) &&
    (!sire2 || sire2.id !== id1) &&
    (!sire1 || !sire2 || sire1.id !== sire2.id) &&
    (!matron1 || !matron2 || matron1.id !== matron2.id);
}
