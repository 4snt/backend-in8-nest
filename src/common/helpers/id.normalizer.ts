export function normalizeProductId(
  provider: 'br' | 'eu',
  rawId: string | number,
): string {
  return `${provider.toUpperCase()}-${String(rawId).toUpperCase()}`;
}

export function parseProductId(id: string): {
  provider: 'br' | 'eu';
  rawId: string;
} {
  const [prov, ...rest] = id.toLowerCase().split('-');
  const rawId = rest.join('-');

  if (!['br', 'eu'].includes(prov)) {
    throw new Error(`Invalid provider: ${prov}`);
  }

  if (!rawId) {
    throw new Error(`Invalid id: ${id}`);
  }

  return { provider: prov as 'br' | 'eu', rawId };
}
