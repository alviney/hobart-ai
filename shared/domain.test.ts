import { describe, expect, it } from 'vitest';
import { dayLabel, daysSince, distanceM, matchCount, notifies, offset, searchWords, strength, suggestUrgent } from './domain';

describe('strength', () => {
  it('follows the D-009 bands', () => {
    expect(strength(0)).toBe(4);
    expect(strength(7)).toBe(4);
    expect(strength(8)).toBe(3);
    expect(strength(30)).toBe(3);
    expect(strength(31)).toBe(2);
    expect(strength(90)).toBe(2);
    expect(strength(91)).toBe(1);
    expect(strength(180)).toBe(1);
    expect(strength(181)).toBe(0);
  });
  it('counts whole days and never goes negative', () => {
    const now = Date.parse('2026-11-17T12:00:00Z');
    expect(daysSince('2026-11-14T12:00:00Z', now)).toBe(3);
    expect(daysSince('2026-11-18T12:00:00Z', now)).toBe(0);
  });
});

describe('notifies', () => {
  const sub = (o: Partial<{ level: 'all' | 'urgent'; via: 'email' | 'ai'; paused: boolean }>) => ({ level: 'all' as const, via: 'email' as const, paused: false, ...o });
  it('everything: every ping notifies', () => {
    expect(notifies(sub({}), false, false)).toBe(true);
    expect(notifies(sub({}), true, false)).toBe(true);
  });
  it('urgent only: only urgent pings notify', () => {
    expect(notifies(sub({ level: 'urgent' }), false, false)).toBe(false);
    expect(notifies(sub({ level: 'urgent' }), true, false)).toBe(true);
  });
  it('paused, AI-only, own Station and no subscription never notify', () => {
    expect(notifies(sub({ paused: true }), true, false)).toBe(false);
    expect(notifies(sub({ via: 'ai' }), true, false)).toBe(false);
    expect(notifies(sub({}), true, true)).toBe(false);
    expect(notifies(null, true, false)).toBe(false);
  });
});

describe('suggestUrgent', () => {
  it('flags cancellations and closures', () => {
    expect(suggestUrgent('Training is cancelled tonight')?.urgent).toBe(true);
    expect(suggestUrgent('School closed Friday')?.urgent).toBe(true);
  });
  it('leaves ordinary news as not urgent, and empty drafts alone', () => {
    expect(suggestUrgent('Croissants are out')?.urgent).toBe(false);
    expect(suggestUrgent('   ')).toBeNull();
  });
});

describe('distance', () => {
  it('round-trips with offset', () => {
    const here = { lat: -42.8893, lng: 147.319 };
    for (const m of [20, 460, 2100, 7400]) expect(Math.abs(distanceM(here, offset(here, m, 135)) - m)).toBeLessThan(1);
  });
});

describe('dayLabel', () => {
  const now = new Date(2026, 10, 27, 11, 0);
  it('groups by calendar day', () => {
    expect(dayLabel(new Date(2026, 10, 27, 7, 0).toISOString(), now)).toBe('Today');
    expect(dayLabel(new Date(2026, 10, 26, 23, 0).toISOString(), now)).toBe('Yesterday');
    expect(dayLabel(new Date(2026, 10, 23, 9, 0).toISOString(), now)).toBe('Earlier this week');
    expect(dayLabel(new Date(2026, 10, 1, 9, 0).toISOString(), now)).toBe('Older');
  });
});

describe('search', () => {
  it('matches plurals and ignores short words', () => {
    const w = searchWords('good bagels at it');
    expect(w).toEqual(['good', 'bagel']);
    expect(matchCount(w, 'Everything bagels are back')).toBe(1);
  });
});
