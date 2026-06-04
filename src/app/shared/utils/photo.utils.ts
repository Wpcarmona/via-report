import { Capacitor } from '@capacitor/core';

export function getDisplayPhotoUrl(photoUrl: string | null): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http')) return photoUrl;
  return Capacitor.convertFileSrc(photoUrl);
}
