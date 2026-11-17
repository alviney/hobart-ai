import type { Category } from '../../shared/domain';

const P = (d: string, extra: Record<string, string | number> = {}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...extra} dangerouslySetInnerHTML={{ __html: d }} />
);

export const Icon = {
  menu: () => P('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: () => P('<path d="M6 6l12 12M18 6L6 18"/>', { strokeWidth: 2.6 }),
  radar: () => P('<circle cx="12" cy="12" r="9" opacity=".45"/><circle cx="12" cy="12" r="5" opacity=".7"/><path d="M12 12 18.4 5.6"/><circle cx="16" cy="9" r="1.3" fill="currentColor" stroke="none"/>'),
  chest: () => P('<path d="M4 11h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 11V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M10.5 11v3h3v-3"/>'),
  plus: () => P('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  scan: () => P('<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8"/>'),
  plug: () => P('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>'),
  reset: () => P('<path d="M4 4v6h6M20 20v-6h-6"/><path d="M5.5 15a7 7 0 0 0 12.4 2M18.5 9A7 7 0 0 0 6.1 7"/>'),
};

const CAT_PATHS: Record<Category, [string, string]> = {
  school: ['School', '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5v4c2 2 10 2 12 0v-4M22 9v5"/>'],
  sport: ['Sport', '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8"/>'],
  food: ['Food', '<path d="M7 3v18M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M17 21v-9c-2.2-2-2.2-7 0-9"/>'],
  coffee: ['Coffee', '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v3M12 3v3"/>'],
  nature: ['Nature', '<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8"/>'],
  home: ['Home', '<path d="M4 11l8-7 8 7M6 10v10h12V10"/>'],
  music: ['Music', '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'],
  shop: ['Shop', '<path d="M6 8h12l1 12H5zM9 8V6a3 3 0 0 1 6 0v2"/>'],
  group: ['Group', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/>'],
};
export const catLabel = (c: Category) => CAT_PATHS[c][0];
export const CatIcon = ({ c }: { c: Category }) => P(CAT_PATHS[c][1]);
