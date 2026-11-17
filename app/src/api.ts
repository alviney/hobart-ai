import type { Category, Level, Strength, Via } from '../../shared/domain';

export interface Station {
  id: string; name: string; short: string; category: Category; access: 'invite' | 'public';
  owner: boolean; verifiedDays: number; strength: Strength; subscribers: number;
  sub: { level: Level; via: Via; paused: boolean } | null; dist: number | null;
}
export interface Ping {
  id: number; stationId: string; stationName: string; stationShort: string; category: Category;
  urgent: boolean; title: string | null; body: string; createdAt: string; read: boolean; own: boolean; notified: boolean;
  dist?: number;
}
export interface StationPage { station: Station; docs: { id: number; title: string; body: string }[]; pings: Ping[]; audience: { level: Level; via: Via; n: number }[] }
export interface Nearby {
  here: { station: Station; latest: Ping | null } | null;
  pings: Ping[];
  results: { station: Station; match: string; from: 'ping' | 'info' | 'name' }[];
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, { method, headers: body ? { 'content-type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Something went wrong. Try again.');
  return data as T;
}

export const api = {
  timeline: () => call<Ping[]>('GET', '/timeline'),
  summary: () => call<{ text: string | null; urgent?: boolean; pingId?: number }>('GET', '/summary'),
  ping: (id: number) => call<{ ping: Ping; station: Station }>('GET', `/pings/${id}`),
  subs: () => call<{ own: Station[]; following: Station[] }>('GET', '/subs'),
  station: (id: string) => call<StationPage>('GET', `/stations/${id}`),
  nearby: (lat: number, lng: number, q = '') => call<Nearby>('GET', `/nearby?lat=${lat}&lng=${lng}&q=${encodeURIComponent(q)}`),
  ask: (question: string) => call<{ answers: { station: string; text: string; source: string }[] }>('POST', '/ask', { question }),
  subscribe: (id: string, s: Partial<{ level: Level; via: Via; paused: boolean }>) => call<Station>('PUT', `/stations/${id}/subscription`, s),
  unsubscribe: (id: string) => call('DELETE', `/stations/${id}/subscription`),
  createStation: (s: { name: string; category: Category; access: 'invite' | 'public'; lat?: number; lng?: number }) => call<Station>('POST', '/stations', s),
  sendPing: (id: string, p: { body: string; title?: string; urgent: boolean }) => call<{ id: number; notified: number; waiting: number }>('POST', `/stations/${id}/pings`, p),
  verify: (id: string) => call<Station>('POST', `/stations/${id}/verify`),
  addDoc: (id: string, d: { title: string; body: string }) => call('POST', `/stations/${id}/docs`, d),
  reset: () => call('POST', '/dev/reset'),
  age: (id: string) => call<Station>('POST', `/dev/age/${id}`),
};
