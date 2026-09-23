export const DESK_IDS = ['own', 'run', 'lease', 'finance', 'buy', 'sell'] as const;
export type DeskId = (typeof DESK_IDS)[number];
export const DESKS: Record<DeskId, { label: string; blurb: string }> = {
  own: { label: 'Own', blurb: 'Title, plat, parking, entities, constraints.' },
  run: { label: 'Run', blurb: 'Dates, rent roll, vacancy, maintenance.' },
  lease: { label: 'Lease', blurb: 'Rent, exclusives, anchors, variance.' },
  finance: { label: 'Finance', blurb: 'Underwriting, debt, recoveries.' },
  buy: { label: 'Buy', blurb: 'Diligence, access, names that do not match.' },
  sell: { label: 'Sell', blurb: 'What a buyer audits.' },
};
