// Product rules shared by the server and the app. See work/decisions/.

export const DAY_MS = 86_400_000;

export type Level = 'all' | 'urgent';
export type Via = 'email' | 'ai' | 'webhook' | 'sms';
export type Strength = 0 | 1 | 2 | 3 | 4;

export const CATEGORIES = ['school', 'sport', 'food', 'coffee', 'nature', 'home', 'music', 'shop', 'group'] as const;
export type Category = (typeof CATEGORIES)[number];

/** Whole days between an ISO time and now (never negative). */
export function daysSince(iso: string, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - Date.parse(iso)) / DAY_MS));
}

/** Ping strength from how recently a Station's owner confirmed its details (D-009). */
export function strength(days: number): Strength {
  if (days <= 7) return 4;
  if (days <= 30) return 3;
  if (days <= 90) return 2;
  if (days <= 180) return 1;
  return 0;
}

export const STRENGTH_LABEL: Record<Strength, string> = {
  4: 'Strong ping', 3: 'Good ping', 2: 'Weak ping', 1: 'Faint ping', 0: 'Too faint to show',
};

export interface SubSettings { level: Level; via: Via; paused: boolean }

/**
 * Does this ping notify this person? (D-011: urgent or not.)
 * Your own Station's pings, paused subscriptions and AI-only subscriptions never notify.
 */
export function notifies(sub: SubSettings | null, urgent: boolean, isOwner: boolean): boolean {
  if (isOwner || !sub) return false;
  if (sub.paused || sub.via === 'ai') return false;
  return sub.level === 'all' || urgent;
}

/** Suggest whether a draft ping is urgent. A hint for the sender, who can change it. */
export function suggestUrgent(text: string): { urgent: boolean; why: string } | null {
  const t = text.toLowerCase();
  if (!t.trim()) return null;
  if (/(cancel|closed|close |emergency|urgent|today only|evacuat|not on|postpone)/.test(t)) {
    return { urgent: true, why: 'it cancels or closes something people were counting on' };
  }
  return { urgent: false, why: 'people can catch up on it when they next look' };
}

export interface LatLng { lat: number; lng: number }

/** Distance in metres between two points (haversine). */
export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6_371_000, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The point `metres` away from `from` on a compass bearing. Used to place sample Stations. */
export function offset(from: LatLng, metres: number, bearingDeg: number): LatLng {
  const R = 6_371_000, rad = Math.PI / 180, d = metres / R, b = bearingDeg * rad;
  const lat1 = from.lat * rad, lng1 = from.lng * rad;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b));
  const lng2 = lng1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 / rad, lng: lng2 / rad };
}

/** Timeline group for a ping, by calendar day in the viewer's time zone (D-014). */
export function dayLabel(iso: string, now: Date = new Date()): 'Today' | 'Yesterday' | 'Earlier this week' | 'Older' {
  const d = new Date(iso);
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(now) - start(d)) / DAY_MS);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff <= 7) return 'Earlier this week';
  return 'Older';
}

/** Short time for a ping: "8:15am" today, "Yesterday", "Mon", or "29 Oct". */
export function shortTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso), label = dayLabel(iso, now);
  if (label === 'Today') return d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }).replace(' ', '').toLowerCase();
  if (label === 'Yesterday') return 'Yesterday';
  if (label === 'Earlier this week') return d.toLocaleDateString('en-AU', { weekday: 'short' });
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

/** Words worth searching for: three letters or more, with a trailing "s" dropped. */
export function searchWords(q: string): string[] {
  return (q.toLowerCase().match(/[a-z0-9]{3,}/g) || []).map((w) => w.replace(/s$/, ''));
}

/** How many of the search words appear in a text. */
export function matchCount(words: string[], text: string): number {
  const low = text.toLowerCase();
  return words.filter((w) => low.includes(w)).length;
}
