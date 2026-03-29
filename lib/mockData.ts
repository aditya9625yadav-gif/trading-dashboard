export type Verdict = "best" | "trade" | "marginal" | "avoid";
export type Session = "London" | "New York";

export interface SlotData {
  slot: number; label: string;
  dstOn: string; dstOff: string;
  mktHr: number; session: Session;
  tp: number; sl: number; be: number;
  wr: number; verdict: Verdict;
}

export interface DayData {
  day: string; tp: number; sl: number; be: number;
  wr: number; filteredWr: number;
}

export const SLOTS: SlotData[] = [
  { slot:2,  label:"S2",  dstOn:"14:00–14:30", dstOff:"15:00–15:30", mktHr:1,  session:"London",   tp:9,  sl:12, be:1,  wr:42.9, verdict:"marginal" },
  { slot:3,  label:"S3",  dstOn:"14:30–15:00", dstOff:"15:30–16:00", mktHr:2,  session:"London",   tp:15, sl:31, be:3,  wr:32.6, verdict:"avoid"    },
  { slot:4,  label:"S4",  dstOn:"15:00–15:30", dstOff:"16:00–16:30", mktHr:2,  session:"London",   tp:23, sl:30, be:13, wr:43.4, verdict:"trade"    },
  { slot:5,  label:"S5",  dstOn:"15:30–16:00", dstOff:"16:30–17:00", mktHr:3,  session:"London",   tp:26, sl:30, be:10, wr:46.4, verdict:"trade"    },
  { slot:6,  label:"S6",  dstOn:"16:00–16:30", dstOff:"17:00–17:30", mktHr:3,  session:"London",   tp:24, sl:51, be:13, wr:32.0, verdict:"avoid"    },
  { slot:7,  label:"S7",  dstOn:"16:30–17:00", dstOff:"17:30–18:00", mktHr:4,  session:"London",   tp:14, sl:50, be:6,  wr:21.9, verdict:"avoid"    },
  { slot:8,  label:"S8",  dstOn:"17:00–17:30", dstOff:"18:00–18:30", mktHr:4,  session:"London",   tp:23, sl:41, be:8,  wr:35.9, verdict:"marginal" },
  { slot:9,  label:"S9",  dstOn:"17:30–18:00", dstOff:"18:30–19:00", mktHr:5,  session:"London",   tp:21, sl:41, be:5,  wr:33.9, verdict:"marginal" },
  { slot:10, label:"S10", dstOn:"18:00–18:30", dstOff:"19:00–19:30", mktHr:5,  session:"London",   tp:13, sl:16, be:3,  wr:44.8, verdict:"trade"    },
  { slot:11, label:"S11", dstOn:"18:30–19:00", dstOff:"19:30–20:00", mktHr:6,  session:"London",   tp:21, sl:17, be:6,  wr:55.3, verdict:"best"     },
  { slot:12, label:"S12", dstOn:"19:00–19:30", dstOff:"20:00–20:30", mktHr:6,  session:"London",   tp:19, sl:25, be:4,  wr:43.2, verdict:"trade"    },
  { slot:13, label:"S13", dstOn:"19:30–20:00", dstOff:"20:30–21:00", mktHr:7,  session:"London",   tp:13, sl:14, be:2,  wr:48.1, verdict:"trade"    },
  { slot:14, label:"S14", dstOn:"20:00–20:30", dstOff:"21:00–21:30", mktHr:7,  session:"London",   tp:8,  sl:7,  be:1,  wr:53.3, verdict:"best"     },
  { slot:15, label:"S15", dstOn:"20:30–21:00", dstOff:"21:30–22:00", mktHr:8,  session:"New York", tp:6,  sl:8,  be:1,  wr:42.9, verdict:"trade"    },
  { slot:16, label:"S16", dstOn:"21:00–21:30", dstOff:"22:00–22:30", mktHr:8,  session:"New York", tp:15, sl:28, be:10, wr:34.9, verdict:"marginal" },
  { slot:17, label:"S17", dstOn:"21:30–22:00", dstOff:"22:30–23:00", mktHr:9,  session:"New York", tp:22, sl:30, be:9,  wr:42.3, verdict:"trade"    },
  { slot:18, label:"S18", dstOn:"22:00–22:30", dstOff:"23:00–23:30", mktHr:9,  session:"New York", tp:15, sl:28, be:10, wr:34.9, verdict:"marginal" },
  { slot:19, label:"S19", dstOn:"22:30–23:00", dstOff:"23:30–00:00", mktHr:10, session:"New York", tp:19, sl:39, be:22, wr:32.8, verdict:"avoid"    },
  { slot:20, label:"S20", dstOn:"23:00–23:30", dstOff:"00:00–00:30", mktHr:10, session:"New York", tp:27, sl:36, be:12, wr:42.9, verdict:"trade"    },
  { slot:21, label:"S21", dstOn:"23:30–00:00", dstOff:"00:30–01:00", mktHr:11, session:"New York", tp:21, sl:33, be:11, wr:38.9, verdict:"marginal" },
  { slot:22, label:"S22", dstOn:"00:00–00:30", dstOff:"01:00–01:30", mktHr:11, session:"New York", tp:16, sl:34, be:10, wr:32.0, verdict:"avoid"    },
  { slot:23, label:"S23", dstOn:"00:30–01:00", dstOff:"01:30–02:00", mktHr:12, session:"New York", tp:22, sl:25, be:8,  wr:46.8, verdict:"trade"    },
  { slot:24, label:"S24", dstOn:"01:00–01:30", dstOff:"02:00–02:30", mktHr:12, session:"New York", tp:18, sl:26, be:7,  wr:40.9, verdict:"marginal" },
];

export const DAYS: DayData[] = [
  { day:"Mon", tp:82,  sl:159, be:48, wr:34.2, filteredWr:37.7 },
  { day:"Tue", tp:72,  sl:122, be:38, wr:37.1, filteredWr:39.0 },
  { day:"Wed", tp:82,  sl:116, be:26, wr:41.4, filteredWr:43.3 },
  { day:"Thu", tp:92,  sl:130, be:41, wr:41.7, filteredWr:44.5 },
  { day:"Fri", tp:81,  sl:126, be:24, wr:39.1, filteredWr:42.1 },
];

export const MONTHLY: Record<number, number[]> = {
  2021: [38,42,35,40,33,38,36,41,44,38,32,30],
  2022: [28,31,25,30,27,24,28,32,30,26,22,28],
  2023: [35,38,30,36,34,38,40,35,32,38,34,36],
  2024: [36,40,38,34,32,38,40,36,34,38,32,36],
  2025: [40,44,38,42,45,44,38,42,46,40,38,36],
};
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const YEARS  = [2021,2022,2023,2024,2025];

export const DONUT = [
  { name:"TP",  value:411, color:"var(--accent-lime)" },
  { name:"SL",  value:652, color:"var(--status-red)" },
  { name:"BE",  value:177, color:"var(--text-faint)" },
];

export const SESSIONS = [
  { name:"London",   tp:231, sl:372, be:78,  wr:38.3, filtered:44.0 },
  { name:"New York", tp:180, sl:280, be:99,  wr:39.1, filtered:38.9 },
];

export const KPI_DATA = [
  { label:"Total Trades",  value:"1,240",  sub:"Jan 2021–Mar 2026",     trend:"up" as const,   state:"neutral" as const },
  { label:"Base Win Rate", value:"38.7%",  sub:"All trades excl. BE",   trend:"flat" as const, state:"amber" as const },
  { label:"DST Filtered",  value:"41.9%",  sub:"Remove HHSlots 6,7,19,22",trend:"up" as const, state:"lime" as const },
  { label:"Best Slot",     value:"55.3%",  sub:"S11 · London Hr 6",     trend:"up" as const,   state:"lime" as const },
  { label:"Worst Slot",    value:"21.9%",  sub:"S7 · London Hr 4",      trend:"down" as const, state:"red" as const },
];
