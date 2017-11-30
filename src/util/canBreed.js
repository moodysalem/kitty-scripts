export default function canBreed({ id: id1, matron: matron1, sire: sire1, status: { is_ready1 } },
                                 { id: id2, matron: matron2, sire: sire2, status: { is_ready2 } }) {
  return id1 !== id2 &&
    is_ready2 && is_ready1 &&
    (!matron1 || !matron2 || matron1.id !== matron2.id) &&
    (!sire1 || !sire2 || sire1.id !== sire2.id);
}
