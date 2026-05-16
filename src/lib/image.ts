export function avatarUrl(seed: string, size = 256): string {
  if (/^https?:\/\//i.test(seed)) return seed;
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`;
}

export function photoUrl(seed: string, width = 640, height = 800): string {
  if (/^https?:\/\//i.test(seed)) return seed;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
