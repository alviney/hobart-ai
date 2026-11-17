import type { DatabaseSync } from 'node:sqlite';
import { offset } from '../shared/domain';

// Sample data carried over from the prototype. Times are relative to "now" so the
// timeline always looks fresh. "You" are standing at Lansdowne Primary School.
export const ME = 'me';
export const DEMO_HERE = { lat: -42.8893, lng: 147.319 };

type StationSeed = {
  id: string; name: string; short: string; category: string; access?: 'public' | 'invite';
  verifiedDays: number; dist: number; bearing: number;
  sub?: { level: 'all' | 'urgent'; via: 'email' | 'ai'; paused?: boolean };
  docs: [string, string][];
};

const STATIONS: StationSeed[] = [
  { id: 'netball', name: 'South Hobart Netball U12s', short: 'Netball U12s', category: 'sport', verifiedDays: 3, dist: 1200, bearing: 165, sub: { level: 'all', via: 'email' },
    docs: [['Season overview', 'Games are on Saturday mornings at the Domain courts. Arrive 20 minutes before your game. Bring a water bottle and your bib.'],
      ['Wet weather plan', "If it's raining at 7am, check for an urgent ping by 7:30am. No ping means we play."],
      ['Uniforms and canteen', 'Navy skirt or shorts with the club top. Two families run the canteen each week; canteen families arrive at 8:30am.']] },
  { id: 'pf', name: 'Lansdowne Primary P&F', short: 'Lansdowne P&F', category: 'school', verifiedDays: 20, dist: 800, bearing: 80, sub: { level: 'urgent', via: 'email' },
    docs: [['Term dates', 'Term 4 runs until Friday 18 December.'], ['Before and after care', 'Runs 7:30–8:45am and 3:00–6:00pm in the hall, including pupil-free days. Book through the office.']] },
  { id: 'school', name: 'Lansdowne Primary School', short: 'Lansdowne Primary', category: 'school', verifiedDays: 1, dist: 15, bearing: 20,
    docs: [['Office hours', 'The office is open 8:15am to 3:45pm on school days. Late arrivals sign in at the office.'], ['Term dates', 'Term 4 runs until Friday 18 December.']] },
  { id: 'landcare', name: 'Mt Stuart Landcare', short: 'Mt Stuart Landcare', category: 'nature', verifiedDays: 60, dist: 2100, bearing: 255, sub: { level: 'all', via: 'ai' },
    docs: [['Working bees', 'Second Sunday of every month, 9am at the Mt Stuart Rd gate. Bring gloves, water and sturdy shoes. Tools and morning tea provided.']] },
  { id: 'bodycorp', name: 'Waterside Body Corporate', short: 'Waterside Body Corp', category: 'home', access: 'invite', verifiedDays: 140, dist: 120, bearing: 320, sub: { level: 'urgent', via: 'email', paused: true },
    docs: [['Bin days', 'General waste Tuesday night, recycling every second Thursday.']] },
  { id: 'pressed', name: 'Pressed Coffee', short: 'Pressed Coffee', category: 'coffee', verifiedDays: 0, dist: 180, bearing: 75, sub: { level: 'all', via: 'email' },
    docs: [['Hours', 'Weekdays 6:30am to 3pm, weekends 7:30am to 2pm.']] },
  { id: 'tidal', name: 'Tidal Bakery', short: 'Tidal Bakery', category: 'food', verifiedDays: 0, dist: 610, bearing: 15, sub: { level: 'all', via: 'email' },
    docs: [['Bake times', 'Sourdough out at 7am, croissants at 7:30am, a second croissant batch around 11am.']] },
  { id: 'elm', name: 'Elm St Bakehouse', short: 'Elm St Bakehouse', category: 'food', verifiedDays: 2, dist: 350, bearing: 35,
    docs: [['Opening hours', 'Tuesday to Sunday, 7am to 3pm. Closed Mondays and public holidays.'], ['Pre-orders', 'Order whole loaves and hot cross buns by 2pm the day before. Pick up from 7am.']] },
  { id: 'bagels', name: 'Rise & Roll Bagels', short: 'Rise & Roll', category: 'food', verifiedDays: 4, dist: 460, bearing: 60,
    docs: [['Menu', 'Boiled and baked every morning: plain, sesame, everything, rye and cinnamon raisin. Vegan cream cheese available.']] },
  { id: 'coffee', name: 'Kunanyi Coffee Cart', short: 'Kunanyi Coffee', category: 'coffee', verifiedDays: 9, dist: 230, bearing: 290,
    docs: [['Where we park', 'Weekdays outside the Lenna Ave shops from 6:30am. Weekends at the rivulet track entrance.']] },
  { id: 'garden', name: 'Lenna Ave Community Garden', short: 'Lenna Ave Garden', category: 'nature', verifiedDays: 12, dist: 620, bearing: 205,
    docs: [['Plots and watering', 'Plots are $20 a year. The watering roster is on the shed door; take one evening a fortnight.']] },
  { id: 'records', name: 'Back Alley Records', short: 'Back Alley Records', category: 'music', verifiedDays: 45, dist: 950, bearing: 300,
    docs: [['Opening hours', 'Thursday to Saturday, 11am to 5pm.']] },
  { id: 'rivulet', name: 'Rivulet Track Friends', short: 'Rivulet Track Friends', category: 'nature', verifiedDays: 120, dist: 1500, bearing: 120,
    docs: [['Clean-up days', 'We meet at the Molle St end, first Saturday of the month.']] },
  { id: 'swim', name: 'Long Beach Swim Group', short: 'Long Beach Swim', category: 'sport', verifiedDays: 5, dist: 3900, bearing: 150,
    docs: [['When we swim', 'Every morning at 6:30am from the pontoon. All paces welcome; bring a bright cap.']] },
  { id: 'pantry', name: 'Corner Pantry', short: 'Corner Pantry', category: 'shop', verifiedDays: 230, dist: 400, bearing: 140, docs: [] },
];

// [station, minutes ago, urgent, title, body, read]
const H = 60, D = 24 * 60;
const PINGS: [string, number, boolean, string | null, string, boolean][] = [
  ['netball', 2 * H, false, 'Finals day: everything you need to know', "We made the grand final! It's on Saturday at the Domain courts, court 3, at 10:20am. Please have players there by 9:50 for warm-up.\n\nUniforms: full club kit, including the navy socks. If your child has lost theirs, we have spares at the canteen.\n\nWin or lose, it's been a brilliant season. Thanks for every early morning, every lift and every orange quarter.", false],
  ['netball', 2 * H + 35, false, null, 'Saturday games move to 9am at the Domain courts. Same team sheet.', false],
  ['tidal', 3 * H, false, null, 'Croissants are out, including almond.', false],
  ['school', 4 * H, false, null, 'The swimming carnival has moved to Thursday 4 December at the Aquatic Centre.', true],
  ['bagels', 5 * H, false, 'Everything bagels are back', 'Our everything bagels are back after the sesame shortage. Hot from 7am; they usually sell out by 10.', true],
  ['pf', D + 2 * H, true, "Friday closure: what's open and what isn't", "School is closed this Friday while Aurora upgrades the power to the new building.\n\nBefore-care and after-care are still running in the hall from 7:30am to 6pm. Book through the office by Thursday at 3pm.\n\nThe canteen is closed, so pack lunch if your child is in care.", false],
  ['landcare', D + 4 * H, false, 'The creek, one year on', 'A year ago the bank along Mt Stuart Rd was blackberry and broken glass. Since then 41 of you have planted 1,860 natives over eleven working bees.\n\nThis Sunday is a matting day: gloves and sturdy shoes, 9am at the gate.', false],
  ['pressed', D + 5 * H, false, null, 'Oat milk is back in stock.', true],
  ['coffee', D + 6 * H, false, null, 'Parked at the rivulet track entrance all weekend. Bagels from Rise & Roll on the counter while they last.', true],
  ['elm', D + 7 * H, false, null, 'Hot cross buns are back from Monday. Pre-orders open now.', true],
  ['pf', 3 * D, false, null, 'Second-hand uniform sale next Wednesday after school.', false],
  ['bodycorp', 3 * D + 2 * H, false, null, 'Gardeners are in on Thursday morning.', true],
  ['netball', 3 * D + 4 * H, false, null, 'Photos from last week are up in the club gallery.', true],
  ['records', 2 * D, false, null, 'Crate of 70s Australian pressings just in. Saturday listening session from 2pm.', true],
  ['garden', 8 * D, false, null, 'Tomato seedlings are ready to plant out. Help yourself from the shed.', true],
  ['rivulet', 26 * D, false, null, 'Thanks to the 23 people who came to the clean-up. 14 bags of rubbish out of the rivulet.', true],
  ['swim', 5 * H, false, null, 'Water is 14 degrees this morning. Sunrise swim and coffee on Saturday.', true],
];

export function seed(db: DatabaseSync, now: number = Date.now()): void {
  const iso = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();
  db.exec('BEGIN');
  try {
    db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(ME, 'You');
    db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run('others', 'Other Hobart people');
    const st = db.prepare('INSERT INTO stations (id, name, short, category, access, owner_id, lat, lng, verified_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const doc = db.prepare('INSERT INTO docs (station_id, title, body) VALUES (?, ?, ?)');
    const sub = db.prepare('INSERT INTO subscriptions (user_id, station_id, level, via, paused, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    for (const s of STATIONS) {
      const at = offset(DEMO_HERE, s.dist, s.bearing);
      st.run(s.id, s.name, s.short, s.category, s.access ?? 'public', 'others', at.lat, at.lng, iso(s.verifiedDays * D), iso(400 * D));
      for (const [t, b] of s.docs) doc.run(s.id, t, b);
      if (s.sub) sub.run(ME, s.id, s.sub.level, s.sub.via, s.sub.paused ? 1 : 0, iso(30 * D));
    }
    const ping = db.prepare('INSERT INTO pings (station_id, urgent, title, body, created_at) VALUES (?, ?, ?, ?, ?)');
    const read = db.prepare('INSERT INTO reads (user_id, ping_id) VALUES (?, ?)');
    for (const [stationId, ago, urgent, title, body, isRead] of [...PINGS].sort((a, b) => b[1] - a[1])) {
      const r = ping.run(stationId, urgent ? 1 : 0, title, body, iso(ago));
      if (isRead) read.run(ME, Number(r.lastInsertRowid));
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
