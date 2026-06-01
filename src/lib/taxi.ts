export function yandexGoUrl(lat: number, lng: number): string {
  return `yandextaxi://route?end-lat=${lat}&end-lon=${lng}`;
}

export function yandexGoWebUrl(lat: number, lng: number): string {
  return `https://3.redirect.appmetrica.yandex.com/route?end-lat=${lat}&end-lon=${lng}&appmetrica_tracking_id=0`;
}

export function letzUrl(lat: number, lng: number, label: string): string {
  const q = encodeURIComponent(label);
  return `geo:${lat},${lng}?q=${q}`;
}

export function formatFare(min: number, max: number): string {
  return `${min}–${max} MDL (est.)`;
}
