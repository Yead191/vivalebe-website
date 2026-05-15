export function avatarUrl(seed: string, size = 256): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`;
}

export function photoUrl(seed: string, width = 640, height = 800): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
