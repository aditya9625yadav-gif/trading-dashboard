"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList, ReferenceLine,
} from "recharts";
import {
  LayoutDashboard, BarChart2, Clock, Target, TrendingUp,
  TrendingDown, Activity, Zap, AlertTriangle, CheckCircle,
  MinusCircle, Settings, Bell, Search, SlidersHorizontal,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
type Verdict = "best" | "trade" | "marginal" | "avoid";
type Session = "London" | "New York";

interface SlotData {
  slot: number; label: string;
  dstOn: string; dstOff: string;
  mktHr: number; session: Session;
  tp: number; sl: number; be: number;
  wr: number; verdict: Verdict;
}
interface DayData {
  day: string; tp: number; sl: number; be: number;
  wr: number; filteredWr: number;
}

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS — dark card + lime accent matching the video
// ─────────────────────────────────────────────────────────────────
const T = {
  bg:        "#161618",
  card:      "#1e1f21",
  cardHi:    "#252628",
  lime:      "#c8ff00",
  limeDim:   "#8ab300",
  limeFade:  "rgba(200,255,0,0.10)",
  red:       "#ff4d4d",
  redFade:   "rgba(255,77,77,0.12)",
  amber:     "#f5a623",
  slate:     "#4a4d52",
  slateHi:   "#6b7280",
  border:    "rgba(255,255,255,0.06)",
  borderHi:  "rgba(255,255,255,0.12)",
  text:      "#ffffff",
  textSub:   "#9ca3af",
  textFaint: "rgba(255,255,255,0.22)",
  sidebar:   "#111214",
  radius:    "20px",
  radiusLg:  "24px",
  radiusSm:  "12px",
} as const;

// ─────────────────────────────────────────────────────────────────
// DATA — all WR values exclude BE (Score = 0), DST-corrected
// ─────────────────────────────────────────────────────────────────
const SLOTS: SlotData[] = [
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

// DST-CORRECT filtered WR — removes HHSlots 6, 7, 19, 22
const DAYS: DayData[] = [
  { day:"Mon", tp:82,  sl:159, be:48, wr:34.2, filteredWr:37.7 },
  { day:"Tue", tp:72,  sl:122, be:38, wr:37.1, filteredWr:39.0 },
  { day:"Wed", tp:82,  sl:116, be:26, wr:41.4, filteredWr:43.3 },
  { day:"Thu", tp:92,  sl:130, be:41, wr:41.7, filteredWr:44.5 },
  { day:"Fri", tp:81,  sl:126, be:24, wr:39.1, filteredWr:42.1 },
];

const MONTHLY: Record<number, number[]> = {
  2021: [38,42,35,40,33,38,36,41,44,38,32,30],
  2022: [28,31,25,30,27,24,28,32,30,26,22,28],
  2023: [35,38,30,36,34,38,40,35,32,38,34,36],
  2024: [36,40,38,34,32,38,40,36,34,38,32,36],
  2025: [40,44,38,42,45,44,38,42,46,40,38,36],
};
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = [2021,2022,2023,2024,2025];

const DONUT = [
  { name:"TP",  value:411, color:T.lime  },
  { name:"SL",  value:652, color:T.red   },
  { name:"BE",  value:177, color:T.slate },
];
const SESSIONS = [
  { name:"London",   tp:231, sl:372, be:78,  wr:38.3, filtered:44.0 },
  { name:"New York", tp:180, sl:280, be:99,  wr:39.1, filtered:38.9 },
];

// ─────────────────────────────────────────────────────────────────
// VERDICT HELPERS
// ─────────────────────────────────────────────────────────────────
const vColor = (v: Verdict): string => ({ best:T.lime, trade:T.limeDim, marginal:T.slateHi, avoid:T.red }[v]);
const vBg    = (v: Verdict): string => ({ best:T.limeFade, trade:"rgba(138,179,0,0.09)", marginal:"rgba(107,114,128,0.11)", avoid:T.redFade }[v]);
const hColor = (wr: number): string => wr>=50?T.lime:wr>=43?T.limeDim:wr>=38?T.slateHi:wr>=33?T.slate:T.red;
const hBg    = (wr: number): string => wr>=50?"rgba(200,255,0,0.14)":wr>=43?"rgba(138,179,0,0.10)":wr>=38?"rgba(107,114,128,0.09)":wr>=33?"rgba(74,77,82,0.12)":"rgba(255,77,77,0.11)";

// ─────────────────────────────────────────────────────────────────
// REUSABLE CARD
// ─────────────────────────────────────────────────────────────────
const Card: React.FC<{ children:React.ReactNode; style?:React.CSSProperties; className?:string; hover?:boolean }> = ({ children, style={}, className="", hover=false }) => {
  const [h, setH] = useState(false);
  return (
    <div className={className}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: h ? T.cardHi : T.card,
        border: `1px solid ${h ? T.borderHi : T.border}`,
        borderRadius: T.radius,
        transition: "background 0.2s, border-color 0.2s, transform 0.2s",
        transform: h && hover ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────
const NAV = [
  { icon:<LayoutDashboard size={18}/>, id:"dash"  },
  { icon:<BarChart2       size={18}/>, id:"chart" },
  { icon:<Clock           size={18}/>, id:"clock" },
  { icon:<Target          size={18}/>, id:"target"},
  { icon:<Activity        size={18}/>, id:"act"   },
  { icon:<SlidersHorizontal size={18}/>, id:"filt"},
];

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("dash");
  return (
    <div style={{ width:72, minHeight:"100vh", background:T.sidebar, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 0", gap:6, position:"fixed", left:0, top:0, zIndex:50 }}>
      <div style={{ width:40, height:40, borderRadius:12, background:T.lime, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
        <Zap size={20} color="#000" strokeWidth={2.5}/>
      </div>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setActive(n.id)} style={{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none", transition:"all 0.2s", background: active===n.id ? T.limeFade : "transparent", color: active===n.id ? T.lime : T.slateHi }}>
          {n.icon}
        </button>
      ))}
      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:6, alignItems:"center" }}>
        <button style={{ width:44, height:44, borderRadius:12, background:"transparent", border:"none", color:T.slateHi, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Bell size={18}/></button>
        <button style={{ width:44, height:44, borderRadius:12, background:"transparent", border:"none", color:T.slateHi, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Settings size={18}/></button>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${T.border}`, marginTop:4, fontSize:12, fontWeight:700, color:"#fff" }}>AU</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────
const Header: React.FC<{ isDst:boolean; toggle:()=>void }> = ({ isDst, toggle }) => (
  <div style={{ height:68, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", borderBottom:`1px solid ${T.border}` }}>
    <div>
      <div style={{ color:T.text, fontSize:17, fontWeight:700, letterSpacing:"-0.01em" }}>XAUUSD Analytics</div>
      <div style={{ color:T.textSub, fontSize:11, marginTop:1 }}>Backtest · 2021–2026 · 1,240 trades · WR excl. BE</div>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bg, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, padding:"7px 13px" }}>
        <Search size={13} color={T.slateHi}/>
        <span style={{ color:T.slateHi, fontSize:12 }}>Search slots...</span>
      </div>
      <button onClick={toggle} style={{ display:"flex", alignItems:"center", gap:8, background: isDst ? T.limeFade : T.bg, border:`1px solid ${isDst ? T.lime+"40" : T.border}`, borderRadius:T.radiusSm, padding:"7px 14px", cursor:"pointer", transition:"all 0.2s", color: isDst ? T.lime : T.slateHi, fontSize:12, fontWeight:600 }}>
        <Clock size={13}/>
        DST {isDst?"ON":"OFF"}
        <span style={{ fontSize:10, padding:"2px 6px", borderRadius:6, background: isDst ? T.lime : T.slate, color: isDst ? "#000" : "#fff", fontWeight:700 }}>
          {isDst?"13:30":"14:30"}
        </span>
      </button>
      <div style={{ position:"relative" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:T.bg, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Bell size={15} color={T.slateHi}/>
        </div>
        <div style={{ position:"absolute", top:7, right:7, width:7, height:7, borderRadius:"50%", background:T.lime, border:`2px solid ${T.card}` }}/>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TOOLTIPS
// ─────────────────────────────────────────────────────────────────
const SlotTip: React.FC<{ active?:boolean; payload?:any[] }> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as SlotData;
  if (!d) return null;
  return (
    <div style={{ background:"#1a1b1d", border:`1px solid ${T.borderHi}`, borderRadius:14, padding:"12px 16px", minWidth:200, boxShadow:"0 8px 32px rgba(0,0,0,0.6)" }}>
      <div style={{ color:vColor(d.verdict), fontSize:11, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>{d.label} · {d.session} · Hr {d.mktHr}</div>
      {[["DST ON",d.dstOn],["DST OFF",d.dstOff],["Win Rate",`${d.wr.toFixed(1)}%`],["TP/SL/BE",`${d.tp}/${d.sl}/${d.be}`]].map(([k,v])=>(
        <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:20, marginBottom:4 }}>
          <span style={{ color:T.textSub, fontSize:11 }}>{k}</span>
          <span style={{ color:T.text, fontSize:11, fontWeight:600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

const DayTip: React.FC<{ active?:boolean; payload?:any[]; label?:string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as DayData;
  return (
    <div style={{ background:"#1a1b1d", border:`1px solid ${T.borderHi}`, borderRadius:12, padding:"10px 14px" }}>
      <div style={{ color:T.lime, fontSize:12, fontWeight:700, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:11, color:T.textSub }}>Base: <span style={{ color:T.amber, fontWeight:600 }}>{d?.wr.toFixed(1)}%</span></div>
      <div style={{ fontSize:11, color:T.textSub }}>Filtered: <span style={{ color:T.lime, fontWeight:600 }}>{d?.filteredWr.toFixed(1)}%</span></div>
      <div style={{ fontSize:11, color:T.textSub }}>TP/SL/BE: <span style={{ color:T.text }}>{d?.tp}/{d?.sl}/{d?.be}</span></div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// BAR TOP LABEL — safe null checks
// ─────────────────────────────────────────────────────────────────
const BarLabel: React.FC<any> = (props) => {
  const { x, y, width, index } = props;
  if (x == null || y == null || width == null || width < 14 || index == null) return null;
  const d = SLOTS[index];
  if (!d) return null;
  const cx = x + width / 2;
  return (
    <g>
      <text x={cx} y={y-18} textAnchor="middle" fill={vColor(d.verdict)} fontSize={8} fontWeight={700} letterSpacing="0.04em">{d.tp}W/{d.sl}L</text>
      <text x={cx} y={y-7}  textAnchor="middle" fill={vColor(d.verdict)} fontSize={9} fontWeight={800}>{d.wr.toFixed(0)}%</text>
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────
// HALF-HOURLY HERO CHART
// ─────────────────────────────────────────────────────────────────
const HalfHourlyChart: React.FC = () => (
  <Card style={{ padding:"22px 24px" }} className="anim-c">
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
      <div>
        <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:5 }}>HALF-HOURLY CONSISTENCY GRID</div>
        <div style={{ color:T.text, fontSize:15, fontWeight:700 }}>DST-Adjusted Win Rate <span style={{ color:T.lime }}>· Excl. BE</span></div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
        {(["best","trade","marginal","avoid"] as Verdict[]).map(v=>(
          <div key={v} style={{ display:"flex", alignItems:"center", gap:4, background:vBg(v), borderRadius:999, padding:"3px 9px", border:`1px solid ${vColor(v)}20` }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:vColor(v) }}/>
            <span style={{ color:vColor(v), fontSize:8, fontWeight:700, letterSpacing:"0.12em" }}>{v.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>

    <ResponsiveContainer width="100%" height={255}>
      <BarChart data={SLOTS} margin={{ top:30, right:4, bottom:4, left:-24 }} barCategoryGap="24%">
        <XAxis dataKey="label" tick={{ fill:T.textSub, fontSize:9, fontWeight:500 }} axisLine={{ stroke:T.border }} tickLine={false}/>
        <YAxis domain={[0,65]} tick={{ fill:T.textSub, fontSize:9 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
        <Tooltip content={<SlotTip/>} cursor={{ fill:"rgba(255,255,255,0.025)", radius:6 }}/>
        <ReferenceLine y={38.7} stroke={T.amber} strokeDasharray="4 3" strokeWidth={1} label={{ value:"BASE 38.7%", fill:T.amber, fontSize:8, fontWeight:700, dx:4 }}/>
        <ReferenceLine y={50}   stroke="rgba(200,255,0,0.18)" strokeDasharray="2 4" strokeWidth={1}/>
        <Bar dataKey="wr" radius={[8,8,8,8]} maxBarSize={26}>
          {SLOTS.map((s,i)=><Cell key={i} fill={vColor(s.verdict)} fillOpacity={0.88}/>)}
          <LabelList content={<BarLabel/>}/>
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    <div style={{ display:"flex", gap:16, marginTop:6, paddingLeft:4 }}>
      {[{label:"LONDON · S2–S14",color:T.lime},{label:"NEW YORK · S15–S24",color:T.amber}].map(x=>(
        <div key={x.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:18, height:2, background:x.color, borderRadius:1 }}/>
          <span style={{ color:T.textSub, fontSize:9, fontWeight:600, letterSpacing:"0.1em" }}>{x.label}</span>
        </div>
      ))}
      <div style={{ marginLeft:"auto", color:T.textFaint, fontSize:9 }}>WR EXCL. BE · 5Y · 1,240 TRADES</div>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────
// DONUT CHART
// ─────────────────────────────────────────────────────────────────
const OutcomeSplit: React.FC = () => {
  const total = DONUT.reduce((s,d)=>s+d.value,0);
  return (
    <Card style={{ padding:"22px 24px" }} className="anim-c">
      <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:16 }}>OUTCOME SPLIT</div>
      <div style={{ position:"relative" }}>
        <ResponsiveContainer width="100%" height={148}>
          <PieChart>
            <Pie data={DONUT} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {DONUT.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <div style={{ color:T.lime, fontSize:21, fontWeight:900, letterSpacing:"-0.02em" }}>38.7%</div>
          <div style={{ color:T.textSub, fontSize:8, fontWeight:700, letterSpacing:"0.14em" }}>WIN RATE</div>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
        {DONUT.map(d=>(
          <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:7, height:7, borderRadius:2, background:d.color }}/>
              <span style={{ color:T.textSub, fontSize:12 }}>{d.name}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:T.text, fontSize:12, fontWeight:600 }}>{d.value}</span>
              <span style={{ color:d.color, fontSize:11, fontWeight:700, background:`${d.color}14`, padding:"2px 6px", borderRadius:6 }}>
                {((d.value/total)*100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// SESSION YIELD
// ─────────────────────────────────────────────────────────────────
const SessionYield: React.FC = () => (
  <Card style={{ padding:"22px 24px" }} className="anim-c">
    <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:18 }}>SESSION YIELD</div>
    {SESSIONS.map((s,i)=>{
      const tot = s.tp+s.sl+s.be;
      return (
        <div key={s.name} style={{ marginBottom:i<SESSIONS.length-1?20:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ color:T.text, fontSize:13, fontWeight:700 }}>{s.name}</span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:T.textSub, fontSize:11 }}>{s.wr.toFixed(1)}%</span>
              <span style={{ color:T.textFaint, fontSize:10 }}>→</span>
              <span style={{ color:T.lime, fontSize:12, fontWeight:700, background:T.limeFade, padding:"2px 7px", borderRadius:6 }}>{s.filtered.toFixed(1)}%</span>
            </div>
          </div>
          <div style={{ height:9, borderRadius:999, overflow:"hidden", display:"flex", background:T.slate }}>
            <div style={{ width:`${(s.tp/tot)*100}%`, background:T.lime, transition:"width 0.8s ease" }}/>
            <div style={{ width:`${(s.be/tot)*100}%`, background:T.slateHi }}/>
            <div style={{ width:`${(s.sl/tot)*100}%`, background:T.red }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            <span style={{ color:T.textFaint, fontSize:10 }}>{tot} trades</span>
            <span style={{ color:T.textFaint, fontSize:10 }}>TP {s.tp} · BE {s.be} · SL {s.sl}</span>
          </div>
        </div>
      );
    })}
  </Card>
);

// ─────────────────────────────────────────────────────────────────
// DAILY ACCURACY — pill bar chart
// ─────────────────────────────────────────────────────────────────
const DailyAccuracy: React.FC = () => (
  <Card style={{ padding:"22px 24px" }} className="anim-c">
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
      <div>
        <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:4 }}>DAILY ACCURACY</div>
        <div style={{ color:T.text, fontSize:14, fontWeight:700 }}>Before vs After Filter</div>
      </div>
      <div style={{ background:T.limeFade, border:`1px solid ${T.lime}30`, borderRadius:8, padding:"3px 9px", color:T.lime, fontSize:10, fontWeight:700 }}>DST-Correct</div>
    </div>
    <ResponsiveContainer width="100%" height={188}>
      <BarChart data={DAYS} margin={{ top:8, right:4, bottom:0, left:-22 }} barGap={5}>
        <XAxis dataKey="day" tick={{ fill:T.textSub, fontSize:11, fontWeight:500 }} axisLine={{ stroke:T.border }} tickLine={false}/>
        <YAxis domain={[28,50]} tick={{ fill:T.textSub, fontSize:9 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
        <Tooltip content={<DayTip/>} cursor={{ fill:"rgba(255,255,255,0.02)" }}/>
        <ReferenceLine y={38.7} stroke={T.amber} strokeDasharray="3 3" strokeWidth={1}/>
        <Bar dataKey="wr"         fill={T.slate}  fillOpacity={0.5} radius={[8,8,8,8]} maxBarSize={22}/>
        <Bar dataKey="filteredWr" fill={T.lime}   fillOpacity={0.9} radius={[8,8,8,8]} maxBarSize={22}/>
      </BarChart>
    </ResponsiveContainer>
    <div style={{ display:"flex", gap:14, marginTop:12 }}>
      {[{c:T.slate,o:0.5,l:"BASE WR"},{c:T.lime,o:1,l:"FILTERED WR"}].map(x=>(
        <div key={x.l} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:9, height:9, borderRadius:2, background:x.c, opacity:x.o }}/>
          <span style={{ color:T.textSub, fontSize:9, fontWeight:600, letterSpacing:"0.1em" }}>{x.l}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────
// MONTHLY MATRIX
// ─────────────────────────────────────────────────────────────────
const MonthlyMatrix: React.FC = () => {
  const [hov, setHov] = useState<{y:number;m:number}|null>(null);
  return (
    <Card style={{ padding:"22px 24px" }} className="anim-c">
      <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:4 }}>MONTHLY YIELD MATRIX</div>
      <div style={{ color:T.text, fontSize:14, fontWeight:700, marginBottom:16 }}>Win Rate % · Year × Month</div>
      <div style={{ overflowX:"auto" }}>
        <div style={{ minWidth:500 }}>
          <div style={{ display:"grid", gridTemplateColumns:"46px repeat(12,1fr)", gap:3, marginBottom:3 }}>
            <div/>
            {MONTHS.map(m=><div key={m} style={{ color:T.textSub, fontSize:9, fontWeight:600, textAlign:"center" }}>{m}</div>)}
          </div>
          {YEARS.map(yr=>(
            <div key={yr} style={{ display:"grid", gridTemplateColumns:"46px repeat(12,1fr)", gap:3, marginBottom:3 }}>
              <div style={{ color:T.textSub, fontSize:10, fontWeight:600, display:"flex", alignItems:"center" }}>{yr}</div>
              {MONTHLY[yr].map((wr,mi)=>{
                const isH = hov?.y===yr&&hov?.m===mi;
                return (
                  <div key={mi} onMouseEnter={()=>setHov({y:yr,m:mi})} onMouseLeave={()=>setHov(null)}
                    style={{ height:30, borderRadius:7, background:isH?hBg(wr):`${hBg(wr)}80`, border:`1px solid ${isH?hColor(wr)+"50":T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"default", transition:"all 0.14s", transform:isH?"scale(1.07)":"scale(1)" }}>
                    <span style={{ color:hColor(wr), fontSize:9, fontWeight:700 }}>{wr}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12, flexWrap:"wrap" }}>
        <span style={{ color:T.textFaint, fontSize:9, marginRight:4 }}>WR%</span>
        {[["<33",T.red],["33–38",T.slate],["38–43",T.slateHi],["43–50",T.limeDim],["50+",T.lime]].map(([l,c])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:4, marginRight:6 }}>
            <div style={{ width:9, height:9, borderRadius:2, background:c as string }}/>
            <span style={{ color:T.textFaint, fontSize:8 }}>{l}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// HOURLY EXECUTION TABLE
// ─────────────────────────────────────────────────────────────────
const VTag: React.FC<{ v:Verdict }> = ({ v }) => {
  const ic = { best:<CheckCircle size={9}/>, trade:<TrendingUp size={9}/>, marginal:<MinusCircle size={9}/>, avoid:<AlertTriangle size={9}/> };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:vBg(v), color:vColor(v), fontSize:9, fontWeight:700, letterSpacing:"0.1em", padding:"3px 8px", borderRadius:999, border:`1px solid ${vColor(v)}28` }}>
      {ic[v]}{v.toUpperCase()}
    </span>
  );
};

const HourlyTable: React.FC = () => {
  const [sortWr, setSortWr] = useState(false);
  const [sess, setSess] = useState<Session|"ALL">("ALL");
  const rows = useMemo(()=>{
    let r = SLOTS.filter(d=>sess==="ALL"||d.session===sess);
    if(sortWr) r=[...r].sort((a,b)=>b.wr-a.wr);
    return r;
  },[sortWr,sess]);

  const th = (s:string,w?:string) => (
    <th style={{ padding:"9px 13px", textAlign:"left", color:T.textSub, fontSize:9, fontWeight:700, letterSpacing:"0.16em", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap", width:w }}>{s}</th>
  );
  const td = (children:React.ReactNode, extra?:React.CSSProperties) => (
    <td style={{ padding:"8px 13px", borderBottom:`1px solid ${T.border}`, fontSize:11, verticalAlign:"middle", ...extra }}>{children}</td>
  );

  return (
    <Card style={{ padding:"22px 24px" }} className="anim-c">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.1em", marginBottom:4 }}>HOURLY EXECUTION MATRIX</div>
          <div style={{ color:T.text, fontSize:14, fontWeight:700 }}>All Slots · DST-Adjusted · WR Excl. BE</div>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          {(["ALL","London","New York"] as const).map(f=>(
            <button key={f} onClick={()=>setSess(f)} style={{ padding:"5px 13px", borderRadius:999, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.2s", border:"none", background:sess===f?T.lime:T.bg, color:sess===f?"#000":T.slateHi, outline:sess===f?"none":`1px solid ${T.border}` }}>{f}</button>
          ))}
          <button onClick={()=>setSortWr(s=>!s)} style={{ padding:"5px 13px", borderRadius:999, fontSize:11, fontWeight:600, cursor:"pointer", border:"none", transition:"all 0.2s", background:sortWr?T.limeFade:T.bg, color:sortWr?T.lime:T.slateHi, outline:`1px solid ${sortWr?T.lime+"40":T.border}`, display:"flex", alignItems:"center", gap:5 }}>
            <BarChart2 size={11}/>{sortWr?"By Slot":"Sort WR"}
          </button>
        </div>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:620 }}>
          <thead>
            <tr>{th("SLOT")}{th("SESSION · HR")}{th("DST ON")}{th("DST OFF")}{th("WIN RATE","180px")}{th("TP / SL / BE")}{th("VERDICT")}</tr>
          </thead>
          <tbody>
            {rows.map((d,i)=>(
              <tr key={d.slot}
                style={{ background:i%2===0?"transparent":"rgba(255,255,255,0.011)", cursor:"default" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(200,255,0,0.022)")}
                onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.011)")}>
                {td(<span style={{ color:T.text, fontWeight:700 }}>{d.label}</span>)}
                {td(<><span style={{ marginRight:5 }}>{d.session==="London"?"🇬🇧":"🇺🇸"}</span><span style={{ color:T.textSub }}>{d.session} · </span><span style={{ color:T.text, fontWeight:600 }}>Hr {d.mktHr}</span></>)}
                {td(<span style={{ color:T.text }}>{d.dstOn}</span>)}
                {td(<span style={{ color:T.textSub }}>{d.dstOff}</span>)}
                {td(
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:4, background:T.bg, borderRadius:999, overflow:"hidden" }}>
                      <div style={{ width:`${d.wr}%`, height:"100%", background:vColor(d.verdict), borderRadius:999, transition:"width 0.6s ease" }}/>
                    </div>
                    <span style={{ color:vColor(d.verdict), fontSize:12, fontWeight:800, minWidth:38 }}>{d.wr.toFixed(1)}%</span>
                  </div>
                )}
                {td(<><span style={{ color:T.lime }}>{d.tp}</span><span style={{ color:T.textSub }}> / </span><span style={{ color:T.red }}>{d.sl}</span><span style={{ color:T.textSub }}> / </span><span style={{ color:T.slateHi }}>{d.be}</span></>)}
                {td(<VTag v={d.verdict}/>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// ROOT DASHBOARD
// ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [isDst, setIsDst] = useState(true);
  const startMinutes = isDst ? 810 : 870;

  const KPI = [
    { label:"Total Trades",  value:"1,240",  sub:"Jan 2021–Mar 2026",     trend:"up",   color:T.text  },
    { label:"Base Win Rate", value:"38.7%",  sub:"All trades excl. BE",   trend:"flat", color:T.amber },
    { label:"DST Filtered",  value:"41.9%",  sub:"Remove HHSlots 6,7,19,22",trend:"up", color:T.lime  },
    { label:"Best Slot",     value:"55.3%",  sub:"S11 · London Hr 6",     trend:"up",   color:T.lime  },
    { label:"Worst Slot",    value:"21.9%",  sub:"S7 · London Hr 4",      trend:"down", color:T.red   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:${T.bg}; min-height:100vh; }
        body { font-family:'Geist','DM Sans',system-ui,sans-serif; color:${T.text}; }
        button { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }

        @keyframes cardIn {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-c { animation:cardIn 0.45s ease both; }

        @media (max-width:1100px) {
          .sb   { display:none!important; }
          .wrap { margin-left:0!important; }
          .kg   { grid-template-columns:repeat(2,1fr)!important; }
          .mg   { grid-template-columns:1fr!important; }
          .rg   { grid-template-columns:1fr!important; }
          .rc   { display:none!important; }
        }
        @media (max-width:640px) {
          .kg { grid-template-columns:1fr!important; }
        }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:T.bg, color:T.text }}>
        {/* Sidebar */}
        <div className="sb" style={{ position:"fixed", left:0, top:0, zIndex:50, height:"100vh" }}><Sidebar/></div>

        {/* Main content */}
        <div className="wrap" style={{ marginLeft:72, flex:1, padding:16, display:"flex", flexDirection:"column" }}>

          {/* Outer shell card — the big rounded panel from the video */}
          <div style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:T.radiusLg, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            <Header isDst={isDst} toggle={()=>setIsDst(d=>!d)}/>

            <div style={{ flex:1, overflowY:"auto", padding:"18px 18px 26px" }}>

              {/* KPI row */}
              <div className="kg" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:14 }}>
                {KPI.map((s,i)=>(
                  <Card key={i} hover style={{ padding:"17px 18px", animationDelay:`${i*55}ms` }} className="anim-c">
                    <div style={{ color:T.textSub, fontSize:10, fontWeight:600, letterSpacing:"0.07em", marginBottom:7 }}>{s.label.toUpperCase()}</div>
                    <div style={{ color:s.color, fontSize:22, fontWeight:900, letterSpacing:"-0.02em", marginBottom:5 }}>{s.value}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      {s.trend==="up"   && <TrendingUp  size={11} color={T.lime}/>}
                      {s.trend==="down" && <TrendingDown size={11} color={T.red}/>}
                      <span style={{ color:T.textFaint, fontSize:10 }}>{s.sub}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Row 1: Hero + sidebar */}
              <div className="mg" style={{ display:"grid", gridTemplateColumns:"1fr 252px", gap:12, marginBottom:12 }}>
                <HalfHourlyChart/>
                <div className="rc" style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <OutcomeSplit/>
                  <SessionYield/>
                </div>
              </div>

              {/* Row 2: Daily + Monthly */}
              <div className="rg" style={{ display:"grid", gridTemplateColumns:"1fr 1.65fr", gap:12, marginBottom:12 }}>
                <DailyAccuracy/>
                <MonthlyMatrix/>
              </div>

              {/* Row 3: Table */}
              <HourlyTable/>

              {/* Footer */}
              <div style={{ marginTop:16, textAlign:"center" }}>
                <span style={{ color:T.textFaint, fontSize:9, letterSpacing:"0.18em" }}>
                  ALL WIN RATES EXCLUDE BE (SCORE=0) · DST HHSlot FILTER · SESSION START {isDst?"13:30":"14:30"} IST ({startMinutes} MIN)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
