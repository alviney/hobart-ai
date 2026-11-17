import { beforeEach, describe, expect, it } from 'vitest';
import { api } from './api';
import { openNodeDb } from './store-node';
import type { Db } from './store';
import { DEMO_HERE } from './seed';

let db: Db;
let app: ReturnType<typeof api>;
const get = async (path: string) => (await app.request(path)).json() as Promise<any>;
const send = async (method: string, path: string, body?: unknown) => {
  const res = await app.request(path, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: (await res.json()) as any };
};

beforeEach(async () => { db = await openNodeDb(':memory:'); app = api(db); });

describe('timeline', () => {
  it('shows pings from subscribed Stations only, newest first', async () => {
    const t = await get('/timeline');
    const stations = new Set(t.map((p: any) => p.stationId));
    expect(stations.has('netball')).toBe(true);
    expect(stations.has('elm')).toBe(false); // not subscribed
    const times = t.map((p: any) => Date.parse(p.createdAt));
    expect([...times].sort((a, b) => b - a)).toEqual(times);
  });
  it('marks who would be notified', async () => {
    const t = await get('/timeline');
    const pfUrgent = t.find((p: any) => p.stationId === 'pf' && p.urgent);
    const pfNormal = t.find((p: any) => p.stationId === 'pf' && !p.urgent);
    expect(pfUrgent.notified).toBe(true); // urgent only, and this one is urgent
    expect(pfNormal.notified).toBe(false);
    expect(t.filter((p: any) => p.stationId === 'landcare').every((p: any) => !p.notified)).toBe(true); // AI only
  });
});

describe('subscribing', () => {
  it('adds and removes a Station from the timeline', async () => {
    expect((await send('PUT', '/stations/elm/subscription', { level: 'all', via: 'email' })).status).toBe(200);
    expect((await get('/timeline')).some((p: any) => p.stationId === 'elm')).toBe(true);
    await send('DELETE', '/stations/elm/subscription');
    expect((await get('/timeline')).some((p: any) => p.stationId === 'elm')).toBe(false);
  });
});

describe('running a Station', () => {
  it('creates a Station, sends a ping, and counts who it reaches', async () => {
    const created = await send('POST', '/stations', { name: 'Lenna St neighbours', category: 'home', access: 'invite' });
    expect(created.status).toBe(201);
    expect(created.json.owner).toBe(true);
    const sent = await send('POST', `/stations/${created.json.id}/pings`, { body: 'Bins move to Wednesday', urgent: false });
    expect(sent.status).toBe(201);
    expect(sent.json.notified).toBe(0); // nobody has subscribed yet
    const t = await get('/timeline');
    expect(t[0].body).toBe('Bins move to Wednesday');
    expect(t[0].own).toBe(true);
  });
  it("won't let you ping from someone else's Station", async () => {
    expect((await send('POST', '/stations/netball/pings', { body: 'hi' })).status).toBe(403);
  });
  it('rejects a Station with no name', async () => {
    expect((await send('POST', '/stations', { name: '  ', category: 'home', access: 'invite' })).status).toBe(400);
  });
});

describe('nearby', () => {
  it("finds the Station you're standing at and leaves out invite-only ones", async () => {
    const n = await get(`/nearby?lat=${DEMO_HERE.lat}&lng=${DEMO_HERE.lng}`);
    expect(n.here.station.id).toBe('school');
    expect(n.pings.some((p: any) => p.stationId === 'bodycorp')).toBe(false);
    expect(n.pings.some((p: any) => p.stationId === 'pantry')).toBe(false); // too faint
  });
  it('searches names, info and recent pings', async () => {
    const n = await get(`/nearby?lat=${DEMO_HERE.lat}&lng=${DEMO_HERE.lng}&q=good%20bagels`);
    expect(n.results[0].station.id).toBe('bagels');
  });
});

describe('reset', () => {
  it('puts the sample data back', async () => {
    await send('POST', '/stations', { name: 'Temporary', category: 'group', access: 'invite' });
    await send('POST', '/dev/reset');
    const subs = await get('/subs');
    expect(subs.own).toEqual([]);
    expect(subs.following.length).toBeGreaterThan(3);
    expect((await get('/timeline')).some((p: any) => !p.read)).toBe(true);
  });
});
