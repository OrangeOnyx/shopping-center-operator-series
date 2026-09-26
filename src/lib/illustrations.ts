// Editorial line illustrations (Brand Standards 2.3: "editorial line illustration for diagrams").
// Drawn in one 840 x 300 frame. No colors live here: classes map to tokens in site.css.
//   k  ink stroke        t  soft hairline        a  plate-ink accent stroke
//   f  paper-deep fill   w  plate-ink wash fill  af plate-ink solid fill
//   o / m / tr  olive, mustard, terra strokes   wo / wm / wt / wi  their washes   fo / fm / ft  solid
//   Palette meaning inside a drawing: olive = done or healthy, mustard = needs attention,
//   terra = structure, plate ink (a) = what this part is about. Oxblood never appears.
//   dash  dashed stroke (fades in rather than drawing)
// Every group carries a step (--s) so the draw-in reads in order: structure, detail, accent.
// Drawings are illustrative. They show kinds of things, never facts about a specific property.

import { SURVEY_UNITS, SURVEY_STALLS } from './survey-geometry';

type Step = 0 | 1 | 2 | 3 | 4;

const n = (v: number) => Math.round(v * 10) / 10;
const L = (x1: number, y1: number, x2: number, y2: number, c = 'k') =>
  `<line class="${c}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/>`;
const R = (x: number, y: number, w: number, h: number, c = 'k') =>
  `<rect class="${c}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/>`;
const RF = (x: number, y: number, w: number, h: number, fill = 'f', stroke = 'k') => R(x, y, w, h, fill) + R(x, y, w, h, stroke);
const C = (cx: number, cy: number, r: number, c = 'k') => `<circle class="${c}" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"/>`;
const P = (d: string, c = 'k') => `<path class="${c}" d="${d}"/>`;
const G = (s: Step, ...parts: string[]) => `<g style="--s:${s}">${parts.join('')}</g>`;
const each = (count: number, fn: (i: number) => string) => Array.from({ length: count }, (_, i) => fn(i)).join('');
const lines = (x: number, y: number, w: number, count: number, gap: number, c = 't') =>
  each(count, (i) => L(x, y + i * gap, x + w * (i % 3 === 2 ? 0.62 : 1), y + i * gap, c));
const sig = (x: number, y: number, c = 'a') =>
  P(`M${x} ${y} c8 -14 14 -14 16 0 s6 12 14 -4 s10 -10 12 2 s8 8 18 -6 s12 4 20 0`, c);

export interface Illustration { svg: string; label: string; viewBox?: string; cls?: string }

const owning = [
  G(0,
    L(30, 250, 810, 250),
    P('M120 250 V150 H300 V122 H380 V150 H600 V250'),
    P('M640 250 V170 H770 V250'),
  ),
  G(1,
    RF(120, 172, 480, 10, 'wt', 'tr'),
    R(640, 190, 130, 8, 'f'), R(640, 190, 130, 8),
    each(11, (i) => L(160 + i * 40, 182, 160 + i * 40, 250, 't')),
    each(3, (i) => L(683 + i * 30, 198, 683 + i * 30, 250, 't')),
    each(6, (i) => R(134 + i * 78, 156, 56, 11, ['fo', 'fm', 'ft'][i % 3]) + R(134 + i * 78, 156, 56, 11, 't')),
    L(80, 250, 80, 150),
    RF(52, 88, 56, 62),
    each(3, (i) => L(58, 110 + i * 12, 102, 110 + i * 12, 't')),
  ),
  G(2,
    L(628, 250, 628, 128, 't'), L(628, 128, 646, 128, 'm'), C(646, 132, 3, 'fm'),
    L(792, 250, 792, 214), C(792, 194, 22, 'wo'), C(792, 194, 22, 'o'),
    L(30, 264, 810, 264, 't'),
    each(18, (i) => L(118 + i * 36, 268, 104 + i * 36, 290, 't')),
  ),
  G(3,
    R(52, 88, 56, 16, 'af'),
    P('M40 296 H800', 'a dash'),
    L(40, 288, 40, 300, 'a'), L(800, 288, 800, 300, 'a'),
  ),
].join('');

const acquiring = [
  G(0,
    RF(120, 62, 420, 70),
    RF(580, 74, 116, 58, 'wo'),
  ),
  G(1,
    each(11, (i) => L(155 + i * 35, 62, 155 + i * 35, 132, 't')),
    each(3, (i) => L(609 + i * 29, 74, 609 + i * 29, 132, 't')),
    each(24, (i) => L(130 + i * 18, 162, 130 + i * 18, 190, 't')),
    each(24, (i) => L(130 + i * 18, 204, 130 + i * 18, 232, 't')),
    L(130, 190, 544, 190, 't'), L(130, 204, 544, 204, 't'),
    R(662, 188, 66, 52, 't dash'),
  ),
  G(2,
    C(468, 176, 60, 'w'),
    C(468, 176, 60), C(468, 176, 66, 't'),
    P('M515 223 L566 274', 'k heavy'),
  ),
  G(3,
    P('M84 40 H708 L760 262 H84 Z', 'a dash'),
    each(4, (i) => L(436 + i * 18, 162, 436 + i * 18, 190, 'a')),
    R(418, 204, 90, 28, 'wm'), R(418, 204, 90, 28, 'm'),
  ),
].join('');

const financing = [
  G(0,
    L(80, 250, 400, 250), L(80, 250, 80, 50, 't'),
    RF(130, 80, 74, 170, 'fo', 'o'),
    RF(250, 136, 74, 114, 'fm', 'm'),
  ),
  G(1,
    each(6, (i) => L(250, 150 + i * 18, 324, 150 + i * 18, 't')),
    each(5, (i) => L(76, 80 + i * 40, 84, 80 + i * 40, 't')),
    L(470, 250, 780, 250),
    P('M500 250 V160 H620 V140 H680 V160 H760 V250'),
    each(6, (i) => L(520 + i * 40, 176, 520 + i * 40, 250, 't')),
  ),
  G(2,
    RF(560, 60, 150, 120),
    R(690, 60, 20, 26, 'ft'),
    lines(578, 82, 114, 4, 16),
    L(578, 158, 650, 158, 't'),
  ),
  G(3,
    P('M214 80 H234 V136 H214', 'tr'),
    P('M244 108 H236', 'tr'),
    sig(582, 150),
  ),
].join('');

const leasing = [
  G(0,
    L(60, 262, 470, 262),
    P('M90 262 V60 H440 V262'),
  ),
  G(1,
    R(110, 80, 310, 34, 'wm'),
    RF(110, 140, 310, 122, 'wt'),
    L(100, 128, 430, 128),
    L(190, 140, 190, 262, 't'), L(340, 140, 340, 262, 't'),
    R(236, 160, 58, 102, 'wo'), R(236, 160, 58, 102, 'o'), L(282, 208, 282, 220, 'o'),
  ),
  G(2,
    R(540, 36, 200, 236, 't'),
    RF(522, 50, 200, 236),
    L(546, 78, 640, 78),
    lines(546, 100, 152, 5, 16),
    R(542, 182, 150, 16, 'wm'), L(546, 190, 610, 190, 'm'),
    lines(546, 210, 152, 3, 16),
    L(546, 268, 660, 268, 't'),
  ),
  G(3,
    R(110, 80, 310, 34, 'm'),
    sig(556, 262),
    R(716, 92, 20, 34, 'af'),
  ),
].join('');

const operating = [
  G(0,
    R(80, 44, 680, 212),
    R(92, 56, 656, 188, 't'),
  ),
  G(1,
    P('M92 56 L200 150 L92 244', 't'), P('M748 56 L640 150 L748 244', 't'),
    L(200, 150, 640, 150, 't'),
    each(5, (i) => C(170 + i * 125, 150, 5, 'o')),
  ),
  G(2,
    ...[[150, 84, 'wo'], [300, 176, 'wo'], [470, 84, 'wm']].map(([x, y, w]) => RF(x as number, y as number, 64, 44, w as string) + C((x as number) + 32, (y as number) + 22, 13, 't')),
    RF(600, 180, 64, 44, 'w'),
    R(116, 196, 28, 28),
    P('M130 196 V150 H182', 'm dash'), P('M214 150 H332 V176', 'm dash'),
  ),
  G(3,
    C(632, 202, 13, 'a'),
    R(594, 174, 76, 56, 'a'),
    L(632, 202, 640, 194, 'a'),
  ),
].join('');

const financial = [
  G(0,
    R(80, 36, 680, 232, 't'),
    L(80, 62, 760, 62, 't'),
    L(110, 240, 730, 240),
  ),
  G(1,
    RF(130, 80, 64, 160, 'fo', 'o'),
    RF(230, 80, 64, 18, 'fm', 'm'),
    RF(330, 98, 64, 46, 'ft', 'tr'),
    RF(430, 144, 64, 18, 'fm', 'm'),
    RF(530, 162, 64, 12, 'ft', 'tr'),
  ),
  G(2,
    ...[[194, 80], [294, 98], [394, 144], [494, 162], [594, 174]].map(([x, y]) => L(x, y, x + 36, y, 't dash')),
    each(6, (i) => L(146 + i * 100, 250, 178 + i * 100, 250, 't')),
    L(100, 49, 190, 49, 't'),
  ),
  G(3,
    R(630, 174, 64, 66, 'af'),
    R(630, 174, 64, 66, 'a'),
  ),
].join('');

const marketing = [
  G(0,
    L(30, 270, 810, 270), L(30, 292, 810, 292, 't'),
    L(376, 270, 376, 190), L(464, 270, 464, 190),
    RF(346, 36, 148, 154),
  ),
  G(1,
    each(5, (i) => R(360, 76 + i * 22, 120, 14, ['ft', 'fo', 'fm', 'fo', 'ft'][i]) + R(360, 76 + i * 22, 120, 14, 't')),
    P('M40 262 V178 H290 V262', 't'), each(5, (i) => L(80 + i * 42, 196, 80 + i * 42, 262, 't')),
    P('M540 262 V170 H800 V262', 't'), each(6, (i) => L(576 + i * 38, 188, 576 + i * 38, 262, 't')),
    R(40, 178, 250, 12, 'wo'), R(540, 170, 260, 12, 'wm'), L(40, 190, 290, 190, 't'), L(540, 182, 800, 182, 't'),
  ),
  G(2,
    P('M30 281 H810', 't dash'),
  ),
  G(3,
    R(360, 48, 120, 20, 'af'),
    P('M180 281 L352 120', 'a dash'), P('M660 281 L488 120', 'a dash'),
  ),
].join('');

const selling = [
  G(0,
    R(176, 44, 230, 234, 't'),
    RF(150, 30, 234, 246),
  ),
  G(1,
    RF(186, 60, 170, 92, 'wo'),
    RF(206, 76, 90, 30, 'f', 't'), RF(306, 82, 36, 24, 'f', 't'),
    each(7, (i) => L(206 + i * 14, 118, 206 + i * 14, 138, 't')),
    L(186, 176, 330, 176), lines(186, 196, 150, 3, 16),
  ),
  G(2,
    C(560, 150, 30),
    C(604, 196, 17), L(620, 204, 716, 250),
    P('M690 237 L684 250 M702 243 L696 256', 't'),
    C(522, 196, 14), L(514, 208, 468, 264),
    P('M476 254 L466 248 M486 244 L476 238', 't'),
  ),
  G(3,
    R(150, 30, 16, 246, 'af'),
    P('M560 120 L560 96', 'm'), R(544, 60, 32, 36, 'fm'), R(544, 60, 32, 36, 'm'),
  ),
].join('');

const fieldnotes = [
  G(0,
    RF(190, 34, 440, 250),
  ),
  G(1,
    each(13, (i) => C(220 + i * 32, 34, 6)),
    lines(214, 74, 392, 9, 22),
  ),
  G(2,
    P('M300 214 L330 182 M330 214 L360 182 M360 214 L390 182 M390 214 L420 182', 'k'),
    P('M440 198 C470 170 500 170 520 186', 'o'), P('M512 176 L522 188 L508 192', 'o'),
    P('M664 250 L776 70 L792 80 L680 260 L660 272 Z', 'wm'), P('M664 250 L776 70 L792 80 L680 260 L660 272 Z'),
    L(776, 70, 792, 80, 't'),
  ),
  G(3,
    L(250, 60, 250, 280, 'tr'),
    P('M296 234 H430', 'a'),
  ),
].join('');

const systems = [
  G(0,
    RF(70, 116, 124, 68, 'wt', 'tr'),
    RF(272, 52, 132, 60, 'wm', 'm'), RF(272, 188, 132, 60, 'wm', 'm'),
    RF(484, 116, 136, 68, 'w'),
    RF(694, 116, 90, 68, 'wo', 'o'), R(700, 122, 78, 56, 't'),
  ),
  G(1,
    P('M194 150 C230 150 236 82 272 82'), P('M194 150 C230 150 236 218 272 218'),
    P('M404 82 C440 82 448 150 484 150'), P('M404 218 C440 218 448 150 484 150'),
    L(620, 150, 694, 150),
    P('M262 76 L272 82 L262 88'), P('M262 212 L272 218 L262 224'), P('M474 144 L484 150 L474 156'), P('M684 144 L694 150 L684 156'),
    lines(88, 136, 88, 3, 14), lines(290, 70, 96, 2, 14), lines(290, 206, 96, 2, 14), lines(712, 138, 54, 2, 14),
  ),
  G(3,
    R(484, 116, 136, 68, 'a'),
    C(552, 140, 10, 'a'), P('M532 172 C536 156 568 156 572 172', 'a'),
  ),
].join('');

const checklists = [
  G(0,
    RF(280, 26, 280, 262),
    RF(372, 14, 96, 26),
  ),
  G(1,
    ...Array.from({ length: 6 }, (_, i) => R(308, 64 + i * 36, 18, 18) + L(342, 73 + i * 36, i % 2 ? 488 : 530, 73 + i * 36, 't')),
    RF(614, 86, 156, 150),
    each(4, (i) => L(614, 116 + i * 30, 770, 116 + i * 30, 't')),
    each(4, (i) => L(645 + i * 31, 116, 645 + i * 31, 236, 't')),
    R(614, 86, 156, 16, 't'),
  ),
  G(3,
    ...[0, 1, 2].map((i) => P(`M311 ${74 + i * 36} L317 ${79 + i * 36} L329 ${65 + i * 36}`, 'o')),
    R(308, 136, 18, 18, 'wm'), R(308, 136, 18, 18, 'm'),
    R(676, 146, 31, 30, 'fm'), R(645, 116, 31, 30, 'wo'), R(707, 176, 31, 30, 'wo'),
    R(372, 14, 96, 26, 'af'),
  ),
].join('');

const contracts = [
  G(0,
    P('M250 64 L452 34 L486 264 L284 294 Z', 't'),
    R(300, 44, 220, 240, 't'),
    RF(320, 30, 220, 244),
  ),
  G(1,
    L(344, 58, 450, 58),
    lines(344, 82, 172, 4, 15), L(344, 150, 420, 150), lines(344, 170, 172, 4, 15),
    L(344, 246, 430, 246, 't'),
    P('M380 18 V44 C380 52 396 52 396 44 V26'),
  ),
  G(2,
    R(540, 70, 22, 28, 'fo'), R(540, 150, 22, 28, 'fm'), R(540, 190, 22, 28, 'ft'),
  ),
  G(3,
    R(540, 110, 26, 28, 'af'),
    P('M334 142 H330 V160 H334', 'tr'), R(342, 144, 132, 12, 'wt'),
  ),
].join('');

const portfolio = [
  G(0,
    L(40, 232, 800, 232),
    P('M80 232 V170 H220 V232 Z', 'ft'), P('M80 232 V170 H220 V232'),
    P('M300 232 V96 H400 V232 Z', 'fo'), P('M300 232 V96 H400 V232'),
    P('M470 232 V180 H640 V232 Z', 'fm'), P('M470 232 V180 H640 V232'),
    P('M690 232 V168 L745 136 L800 168 V232 Z', 'wi'), P('M690 232 V168 L745 136 L800 168 V232'),
  ),
  G(1,
    L(80, 184, 220, 184, 't'), each(3, (i) => L(115 + i * 35, 184, 115 + i * 35, 232, 't')),
    each(4, (r) => each(3, (c) => R(314 + c * 28, 112 + r * 28, 16, 16, 't'))),
    L(470, 192, 640, 192, 't'), each(4, (i) => L(504 + i * 34, 192, 504 + i * 34, 232, 't')),
    R(720, 196, 50, 36, 't'),
  ),
  G(2,
    P('M150 262 C260 290 300 250 350 262 S500 290 555 262 S700 250 745 262', 'a dash'),
  ),
  G(3,
    ...[150, 350, 555, 745].map((x) => C(x, 262, 7, 'af')),
  ),
].join('');

const governed = [
  G(0,
    R(96, 50, 200, 220, 'k dash'),
    RF(544, 50, 200, 220),
  ),
  G(1,
    lines(120, 82, 150, 6, 18),
    lines(568, 82, 150, 6, 18),
    L(568, 238, 690, 238, 't'),
    P('M310 160 H396'), P('M444 160 H528'), P('M518 152 L528 160 L518 168'),
  ),
  G(3,
    L(420, 30, 420, 128, 'tr'), L(420, 192, 420, 290, 'tr'),
    L(410, 128, 430, 128, 'tr'), L(410, 192, 430, 192, 'tr'),
    R(96, 50, 200, 220, 'wm'),
    sig(578, 232),
    C(702, 214, 20, 'wo'), C(702, 214, 20, 'o'), P('M692 214 L699 221 L712 206', 'o'),
  ),
].join('');

// On The Blvd as the plat draws it. Geometry is traced (see survey-geometry.ts); every label is an
// approved public-record fact. Plan is rotated like Sheet A-1: true north points right.
const T = (x: number, y: number, text: string, c = 'lbl', anchor = 'middle') =>
  `<text class="${c}" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
const CORNERS: [number, number][] = [[1313.7, 662], [295.2, 662], [295.2, 473.3], [71.9, 473.3], [70, 155.5], [125.5, 96], [1313.7, 96], [1360, 143.2], [1360, 614.8]];
// Each monument gets --t, its fraction of the way around the boundary, so it lands as the traverse reaches it.
const TRAVERSE = (() => {
  const pts = [...CORNERS, CORNERS[0]];
  const segs = pts.slice(1).map(([x, y], i) => Math.hypot(x - pts[i][0], y - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let run = 0;
  return CORNERS.map(([x, y], i) => { const t = i === 0 ? 0 : (run += segs[i - 1]) / total; return { x, y, t: Math.round(t * 1000) / 1000 }; });
})();
const unitsIn = (pick: (u: [number, number, number, number]) => boolean) => SURVEY_UNITS.filter(pick);
const bbox = (us: [number, number, number, number][]) => {
  const x = Math.min(...us.map((u) => u[0])), y = Math.min(...us.map((u) => u[1]));
  return [x, y, Math.max(...us.map((u) => u[0] + u[2])) - x, Math.max(...us.map((u) => u[1] + u[3])) - y];
};
const longBldg = unitsIn((u) => u[1] < 140 && u[0] < 1140);
const shortBldg = unitsIn((u) => u[0] >= 1140);
const survey = [
  G(0,
    L(40, 662, 1400, 662), L(40, 700, 1400, 700, 't'),
    T(700, 690, 'ARNOULD BLVD'),
  ),
  G(1,
    P('M 1313.71 661.99 L 295.16 661.99 L 295.16 473.33 L 71.85 473.33 A 3466.82 3532.59 0 0 0 70 155.48 A 55.55 56.6 0 0 1 125.47 96 L 1313.71 96 A 46.29 47.17 0 0 1 1360 143.17 L 1360 614.83 A 46.29 47.17 0 0 1 1313.71 662 Z', 'a traverse'),
    ...TRAVERSE.map(({ x, y, t }) => `<circle class="af mon" style="--t:${t}" cx="${x}" cy="${y}" r="7"/>`),
  ),
  G(2,
    ...[longBldg, shortBldg].map((us) => { const [x, y, w, h] = bbox(us); return R(x, y, w, h, 'f'); }),
    ...SURVEY_UNITS.map(([x, y, w, h]) => R(x, y, w, h, 't')),
    ...[longBldg, shortBldg].map((us) => { const [x, y, w, h] = bbox(us); return R(x, y, w, h); }),
  ),
  G(3,
    P(SURVEY_STALLS, 't'),
    R(139.3, 558.4, 116.6, 76.4, 'wi'), R(139.3, 558.4, 116.6, 76.4, 't dash'),
    T(180, 535, 'NOT A PART', 'lbl lbl-sm'),
  ),
  G(4,
    P('M 3.96 337.68 L 86.02 350.49 L 1186.64 350.49 A 322.35 328.46 0 0 0 1471.09 176.56', 'm dash'),
    T(700, 338, 'LIQUOR LINE · CHURCH EASEMENT', 'lbl lbl-m'),
    T(700, 540, '324 PROVIDED · 344 REQUIRED', 'lbl lbl-strong'),
    L(1250, 72, 1310, 72, 'k'), P('M1296 62 L1312 72 L1296 82', 'k'), T(1330, 82, 'N', 'lbl', 'start'),
  ),
].join('');

const ILLUSTRATIONS: Record<string, Illustration> = {
  survey:      { svg: survey,      viewBox: '40 50 1360 660', cls: 'illo-survey', label: 'Survey drawing of On The Blvd traced from the recorded plat: the parcel line with the excluded bank corner marked not a part, two buildings divided into bays, the striped parking field with 324 spaces provided against 344 required, and the church easement liquor line crossing the lot. True north points right.' },
  owning:      { svg: owning,      label: 'Line drawing: the front elevation of a multi-tenant strip center, pylon sign at the drive, a dashed property line along the lot.' },
  acquiring:   { svg: acquiring,   label: 'Line drawing: a site plan with building footprints and parking rows, a magnifying lens over one row, the parcel boundary dashed.' },
  financing:   { svg: financing,   label: 'Line drawing: two bars compared with a bracket between them, beside a building elevation and a signed loan note.' },
  leasing:     { svg: leasing,     label: 'Line drawing: a storefront bay with a blank sign band beside a lease document and its signature line.' },
  operating:   { svg: operating,   label: 'Line drawing: a roof plan with rooftop units, drains, and a walk path, one unit flagged.' },
  financial:   { svg: financial,   label: 'Line drawing: a waterfall chart stepping from gross rents down to net operating income.' },
  marketing:   { svg: marketing,   label: 'Line drawing: a pylon sign between two storefront rows, sight lines running up from the road.' },
  selling:     { svg: selling,     label: 'Line drawing: a bound offering memorandum with a site plan on its cover, and a ring of keys with a tag.' },
  fieldnotes:  { svg: fieldnotes,  label: 'Line drawing: a spiral notebook with a margin rule and a quick sketch of parking stripes, a pen alongside.' },
  systems:     { svg: systems,     label: 'Line drawing: a workflow of connected steps converging on a review step marked with a person, ending in a record.' },
  checklists:  { svg: checklists,  label: 'Line drawing: a clipboard checklist with the first items checked, beside a calendar grid with one day marked.' },
  contracts:   { svg: contracts,   label: 'Line drawing: a stack of contracts with a paper clip and index tabs, one tab marked.' },
  portfolio:   { svg: portfolio,   label: 'Line drawing: four small properties of different types joined by one dashed route.' },
  governed:    { svg: governed,    label: 'Line drawing: a dashed draft on one side, a signed and stamped document on the other, a written boundary between them.' },
};

const PART_KEYS: Record<string, string> = {
  'Owning': 'owning',
  'Acquiring': 'acquiring',
  'Financing': 'financing',
  'Leasing': 'leasing',
  'Operating': 'operating',
  'Financial Management': 'financial',
  'Marketing & Tenant Success': 'marketing',
  'Selling': 'selling',
  'Field Notes from On The Blvd': 'fieldnotes',
  'AI & Operating Systems': 'systems',
  'Tools & Checklists': 'checklists',
};

const COLLECTION_KEYS: Record<string, string> = {
  'shopping-center': 'owning',
  'field-notes': 'fieldnotes',
  'operating-systems': 'systems',
  'owners-contracts': 'contracts',
  'small-portfolio': 'portfolio',
  'governed-ai': 'governed',
};

export function illustrationFor(opts: { part?: string; collection?: string }): string | undefined {
  if (opts.part && PART_KEYS[opts.part]) return PART_KEYS[opts.part];
  if (opts.collection && COLLECTION_KEYS[opts.collection]) return COLLECTION_KEYS[opts.collection];
  return undefined;
}

// pathLength="1" lets one keyframe draw every stroke regardless of its real length.
export function illustration(key: string): Illustration | undefined {
  const il = ILLUSTRATIONS[key];
  if (!il) return undefined;
  return { ...il, svg: il.svg.replace(/<(line|rect|circle|path)\b/g, '<$1 pathLength="1"') };
}
