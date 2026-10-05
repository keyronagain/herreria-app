export function upsertPorId<T extends { id: string }>(
  lista: T[],
  item: T,
  posicion: 'inicio' | 'final' = 'final',
): T[] {
  if (lista.some((x) => x.id === item.id)) {
    return lista.map((x) => (x.id === item.id ? item : x));
  }
  return posicion === 'inicio' ? [item, ...lista] : [...lista, item];
}

export function quitarPorId<T extends { id: string }>(lista: T[], id: string): T[] {
  return lista.filter((x) => x.id !== id);
}
