export function getFirstName(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'Guest';
  const trimmed = name.trim();
  if (!trimmed) return 'Guest';
  return trimmed.split(' ')[0] || 'Guest';
}
