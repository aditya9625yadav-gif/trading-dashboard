"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList, ReferenceLine,
} from "recharts";
import { MONTHS, YEARS, DayData, SlotData, Verdict } from "@/lib/mockData";

// Tooltips
const vColor = (v: Verdict): string => ({ best: "var(--accent-lime)", trade: "var(--accent-lime-dim)", marginal: "var(--text-faint)", avoid: "var(--status-red)" }[v] || "var(--text-main)");
const vBg = (v: Verdict): string => ({ best: "var(--accent-lime-fade)", trade: "rgba(157, 199, 0, 0.12)", marginal: "rgba(255, 255, 255, 0.05)", avoid: "var(--status-red-fade)" }[v] || "transparent");
const hColor = (wr: number): string => wr >= 50 ? "var(--accent-lime)" : wr >= 43 ? "var(--accent-lime-dim)" : wr >= 38 ? "var(--text-muted)" : wr >= 33 ? "var(--text-faint)" : "var(--status-red)";
const hBg = (wr: number): string => wr >= 50 ? "rgba(200, 255, 0, 0.15)" : wr >= 43 ? "rgba(157, 199, 0, 0.12)" : wr >= 38 ? "rgba(255, 255, 255, 0.08)" : wr >= 33 ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 74, 74, 0.12)";

const SlotTip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass-panel" style={{ padding: "12px 16px", minWidth: "220px", borderRadius: "12px" }}>
      <div style={{ color: vColor(d.verdict), fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px" }}>{d.label} · {d.session} · Hr {d.mktHr}</div>
      {[["DST ON", d.dstOn], ["DST OFF", d.dstOff], ["Win Rate", `${d.wr.toFixed(1)}%`], ["TP / SL / BE", `${d.tp} / ${d.sl} / ${d.be}`]].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "6px" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{k}</span>
          <span style={{ color: "var(--text-main)", fontSize: "12px", fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

const DayTip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="glass-panel" style={{ padding: "12px 16px", minWidth: "160px", borderRadius: "12px" }}>
      <div style={{ color: "var(--accent-lime)", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Win Rate: <span style={{ color: "var(--accent-lime)", fontWeight: 600 }}>{d?.wr.toFixed(1)}%</span></div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>TP/SL/BE: <span style={{ color: "var(--text-main)" }}>{d?.tp}/{d?.sl}/{d?.be}</span></div>
    </div>
  );
};

const BarLabel: React.FC<any> = (props) => {
  const { x, y, width, index, data } = props;
  if (x == null || y == null || width == null || width < 14 || index == null || !data) return null;
  const d = data[index];
  if (!d) return null;
  const cx = x + width / 2;
  return (
    <g>
      <text x={cx} y={y - 18} textAnchor="middle" fill={vColor(d.verdict)} fontSize={9} fontWeight={600} letterSpacing="0.04em">{d.tp}W/{d.sl}L</text>
      <text x={cx} y={y - 6} textAnchor="middle" fill={vColor(d.verdict)} fontSize={10} fontWeight={800}>{d.wr.toFixed(0)}%</text>
    </g>
  );
};

export const HalfHourlyChart = ({ slots }: { slots: SlotData[] }) => {
  const baseAvg = slots.length > 0 ? slots.reduce((s, a) => s + a.wr, 0) / slots.length : 38.7;
  return (
    <div className="glass-card animate-fade-in stagger-3" style={{ padding: "24px", height: "100%" }}>
      <div className="flex-between" style={{ marginBottom: "24px", alignItems: "flex-start" }}>
        <div>
          <div className="label-sm" style={{ marginBottom: "6px" }}>HALF-HOURLY CONSISTENCY GRID</div>
          <div className="h2">DST-Adjusted Win Rate <span style={{ color: "var(--accent-lime)", fontWeight: 400 }}>· Excl. BE</span></div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(["best", "trade", "marginal", "avoid"] as Verdict[]).map(v => (
            <div key={v} className="badge" style={{ background: vBg(v), color: vColor(v), border: `1px solid ${vColor(v)}30` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: vColor(v) }} />
              {v}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={slots} margin={{ top: 30, right: 0, bottom: 0, left: -24 }} barCategoryGap="20%">
            <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 500 }} axisLine={{ stroke: "var(--border-medium)" }} tickLine={false} />
            <YAxis domain={[0, 65]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<SlotTip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 8 }} />
            <ReferenceLine y={baseAvg} stroke="var(--status-amber)" strokeDasharray="4 4" strokeWidth={1} label={{ value: `BASE ${baseAvg.toFixed(1)}%`, fill: "var(--status-amber)", fontSize: 10, fontWeight: 600, position: "insideTopLeft", dx: 10, dy: -10 }} />
            <ReferenceLine y={50} stroke="rgba(200,255,0,0.2)" strokeDasharray="2 4" strokeWidth={1} />
            <Bar dataKey="wr" radius={[6, 6, 6, 6]} maxBarSize={32} animationDuration={1200}>
              {slots.map((s, i) => <Cell key={i} fill={vColor(s.verdict)} fillOpacity={0.9} />)}
              <LabelList content={(p: any) => <BarLabel {...p} data={slots} />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-between" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          {[{ label: "LONDON", color: "var(--accent-lime)" }, { label: "NEW YORK", color: "var(--status-amber)" }].map(x => (
            <div key={x.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 24, height: 3, background: x.color, borderRadius: 2 }} />
              <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>{x.label}</span>
            </div>
          ))}
        </div>
        <div style={{ color: "var(--text-faint)", fontSize: 10, letterSpacing: "0.05em" }}>WR EXCL. BE</div>
      </div>
    </div>
  );
};

export const OutcomeSplit = ({ donut }: { donut: { name: string; value: number; color?: string }[] }) => {
  const total = donut.reduce((s, d) => s + d.value, 0);
  const winRate = total > 0 ? (donut.find(d => d.name === "TP")?.value || 0) / (donut.find(d => d.name === "TP")?.value! + donut.find(d => d.name === "SL")?.value!) * 100 : 0;
  
  return (
    <div className="glass-card animate-fade-in stagger-4" style={{ padding: "24px", flex: 1 }}>
      <div className="label-sm" style={{ marginBottom: "20px" }}>OUTCOME SPLIT</div>
      <div style={{ position: "relative", height: "160px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={donut} cx="50%" cy="50%" innerRadius={54} outerRadius={76} paddingAngle={4} dataKey="value" strokeWidth={0} animationDuration={1000}>
              {donut.map((d, i) => <Cell key={i} fill={d.color || "var(--text-muted)"} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-center flex-col" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div className="outfit" style={{ color: "var(--accent-lime)", fontSize: "24px", fontWeight: 700 }}>{winRate.toFixed(1)}%</div>
          <div style={{ color: "var(--text-muted)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", marginTop: "2px" }}>WIN RATE</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
        {donut.map(d => (
          <div key={d.name} className="flex-between">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "3px", background: d.color || "var(--text-muted)" }} />
              <span className="text-sub">{d.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "var(--text-main)", fontSize: "13px", fontWeight: 600 }}>{d.value}</span>
              <span style={{ color: d.color || "--text-muted", fontSize: "11px", fontWeight: 700, background: `color-mix(in srgb, ${d.color || "white"} 15%, transparent)`, padding: "2px 8px", borderRadius: "6px" }}>
                {total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SessionYield = ({ sessions }: { sessions: { name: string; tp: number; sl: number; be: number; wr: number }[] }) => (
  <div className="glass-card animate-fade-in stagger-4" style={{ padding: "24px", flex: 1 }}>
    <div className="label-sm" style={{ marginBottom: "20px" }}>SESSION YIELD</div>
    {sessions.map((s, i) => {
      const tot = s.tp + s.sl + s.be;
      return (
        <div key={s.name} style={{ marginBottom: i < sessions.length - 1 ? "24px" : 0 }}>
          <div className="flex-between" style={{ marginBottom: "12px" }}>
            <span style={{ color: "var(--text-main)", fontSize: "14px", fontWeight: 600 }}>{s.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--accent-lime)", fontSize: "12px", fontWeight: 700, background: "var(--accent-lime-fade)", padding: "2px 8px", borderRadius: "6px" }}>{s.wr.toFixed(1)}%</span>
            </div>
          </div>
          <div style={{ height: "8px", borderRadius: "99px", overflow: "hidden", display: "flex", background: "var(--bg-primary)" }}>
            <div style={{ width: `${tot > 0 ? (s.tp / tot) * 100 : 0}%`, background: "var(--accent-lime)", transition: "width 1s ease 0.2s" }} />
            <div style={{ width: `${tot > 0 ? (s.be / tot) * 100 : 0}%`, background: "var(--text-faint)", transition: "width 1s ease 0.2s" }} />
            <div style={{ width: `${tot > 0 ? (s.sl / tot) * 100 : 0}%`, background: "var(--status-red)", transition: "width 1s ease 0.2s" }} />
          </div>
          <div className="flex-between" style={{ marginTop: "8px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{tot} trades</span>
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>TP {s.tp} · BE {s.be} · SL {s.sl}</span>
          </div>
        </div>
      );
    })}
  </div>
);

export const DailyAccuracy = ({ days }: { days: DayData[] }) => {
  const baseAvg = days.length > 0 ? days.reduce((s, a) => s + a.wr, 0) / days.length : 38.7;
  return (
    <div className="glass-card animate-fade-in stagger-5" style={{ padding: "24px", height: "100%" }}>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="label-sm" style={{ marginBottom: "6px" }}>DAILY ACCURACY</div>
          <div className="h3">Win Rate by Day of Week</div>
        </div>
      </div>
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} margin={{ top: 8, right: 0, bottom: 0, left: -24 }} barGap={6}>
            <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: "var(--border-medium)" }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<DayTip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }} />
            <ReferenceLine y={baseAvg} stroke="var(--status-amber)" strokeDasharray="3 3" strokeWidth={1} />
            <Bar dataKey="wr" fill="var(--accent-lime)" radius={[4, 4, 4, 4]} maxBarSize={36} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        {[{ c: "var(--accent-lime)", l: "WIN RATE" }].map(x => (
          <div key={x.l} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: x.c }} />
            <span style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyMatrix = ({ monthly }: { monthly: Record<number, number[]> }) => {
  const [hov, setHov] = useState<{ y: number; m: number } | null>(null);
  const years = Object.keys(monthly).map(Number).sort();
  return (
    <div className="glass-card animate-fade-in stagger-5" style={{ padding: "24px", overflowX: "auto", height: "100%" }}>
      <div className="label-sm" style={{ marginBottom: "6px" }}>MONTHLY YIELD MATRIX</div>
      <div className="h3" style={{ marginBottom: "20px" }}>Win Rate % · Year × Month</div>
      <div style={{ minWidth: "540px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "50px repeat(12,1fr)", gap: "4px", marginBottom: "8px" }}>
          <div />
          {MONTHS.map(m => <div key={m} style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: 700, textAlign: "center" }}>{m}</div>)}
        </div>
        {years.map(yr => (
          <div key={yr} style={{ display: "grid", gridTemplateColumns: "50px repeat(12,1fr)", gap: "4px", marginBottom: "4px" }}>
            <div style={{ color: "var(--text-main)", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center" }}>{yr}</div>
            {monthly[yr].map((wr, mi) => {
              const isH = hov?.y === yr && hov?.m === mi;
              return (
                <div key={mi} onMouseEnter={() => setHov({ y: yr, m: mi })} onMouseLeave={() => setHov(null)}
                  style={{
                    height: "36px",
                    borderRadius: "6px",
                    background: isH ? hBg(wr) : `color-mix(in srgb, ${hBg(wr)} 60%, transparent)`,
                    border: `1px solid ${isH ? `color-mix(in srgb, ${hColor(wr)} 50%, transparent)` : "var(--border-light)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "default",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isH ? "scale(1.1)" : "scale(1)",
                    position: isH ? "relative" : "static",
                    zIndex: isH ? 10 : 1
                  }}>
                  <span style={{ color: hColor(wr), fontSize: "11px", fontWeight: 700 }}>{wr}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 500 }}>Legend:</span>
        {[["<33", "var(--status-red)"], ["33–38", "var(--text-faint)"], ["38–43", "var(--text-muted)"], ["43–50", "var(--accent-lime-dim)"], ["50+", "var(--accent-lime)"]].map(([l, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: c }} />
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
