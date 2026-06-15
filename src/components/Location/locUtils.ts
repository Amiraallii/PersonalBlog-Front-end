let earthRadius = 6371000;

export interface GeoPoint {
  lat: number;
  lng: number;
  radius?: number; 
}

/**
 * رشته مختصات رو به آبجکت تبدیل می‌کنه
 * @param {string} value - "lat,lng" یا "lat,lng,radius"
 * @returns {{ lat: number, lng: number, radius: number } | null}
 */
export function parseLocation(value: string | null | undefined): GeoPoint | null {
  if (!value) return null;
  const parts = value.split(",").map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return null;

  return {
    lat: parts[0],
    lng: parts[1],
    radius: parts[2] ?? 0,
  };
}

/**
 * آبجکت مختصات رو به رشته تبدیل می‌کنه
 * @param {{ lat: number, lng: number, radius?: number }} location
 * @returns {string}
 */
export function formatLocation({ lat, lng, radius = 0 }: GeoPoint): string {
  const r = Number(radius);
  return r > 0 ? `${lat},${lng},${r}` : `${lat},${lng}`;
}

/**
 * فاصله بین دو نقطه جغرافیایی رو حساب می‌کنه (متر)
 * فرمول Haversine - برای فیلتر کردن آبجکت‌های نزدیک قابل استفاده‌ست
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number} فاصله به متر
 */
export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const R = earthRadius;
  const toRad = (deg : number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const x =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/**
 * چک می‌کنه آیا یه نقطه داخل شعاع یه لوکیشن هست یا نه
 * مثال استفاده: فیلتر کردن پروژه‌ها یا آبجکت‌های نزدیک
 * @param {{ lat: number, lng: number }} point - نقطه‌ای که چک می‌کنیم
 * @param {{ lat: number, lng: number, radius: number }} location - لوکیشن مرکزی
 * @returns {boolean}
 */
export function isWithinRadius(point: GeoPoint, location: GeoPoint & { radius: number }): boolean {
  if (!location.radius || location.radius <= 0) return true;
  return haversineDistance(point, location) <= location.radius;
}
