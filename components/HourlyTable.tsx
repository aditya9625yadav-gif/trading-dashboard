"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle, TrendingUp, MinusCircle, AlertTriangle, BarChart2 } from "lucide-react";
import { SLOTS, Session, Verdict } from "@/lib/mockData";

const VTag: React.FC<{ v: Verdict }> = ({ v }) => {
  const vColor = { best: "var(--accent-lime)", trade: "var(--accent-lime-dim)", marginal: "var(--text-muted)", avoid: "var(--status-red)" }[v];
  const vBg = { best: "var(--accent-lime-fade)", trade: "rgba(157, 199, 0, 0.12)", marginal: "rgba(255, 255, 255, 0.05)", avoid: "var(--status-red-fade)" }[v];
  const ic = { best: <CheckCircle size={12} />, trade: <TrendingUp size={12} />, marginal: <MinusCircle size={12} />, avoid: <AlertTriangle size={12} /> };
  
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: vBg, color: vColor, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: "99px", border: `1px solid ${vColor}30`, textTransform: "uppercase" }}>
      {ic[v]} {v}
    </span>
  );
};

export default function HourlyTable() {
  const [sortWr, setSortWr] = useState(false);
  const [sess, setSess] = useState<Session | "ALL">("ALL");

  const rows = useMemo(() => {
    let r = SLOTS.filter(d => sess === "ALL" || d.session === sess);
    if (sortWr) r = [...r].sort((a, b) => b.wr - a.wr);
    return r;
  }, [sortWr, sess]);

  return (
    <div className="glass-card animate-fade-in stagger-5" style={{ padding: "24px" }}>
      <div className="flex-between" style={{ marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div className="label-sm" style={{ marginBottom: "6px" }}>HOURLY EXECUTION MATRIX</div>
          <div className="h3">All Slots · DST-Adjusted · WR Excl. BE</div>
        </div>
        
        <div style={{ display: "flex", gap: "12px", background: "var(--bg-primary)", padding: "4px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
          {(["ALL", "London", "New York"] as const).map(f => (
            <button key={f} onClick={() => setSess(f)} 
              style={{ 
                padding: "6px 16px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 600, 
                transition: "all 0.2s", border: "none", cursor: "pointer",
                background: sess === f ? "var(--bg-card-hover)" : "transparent",
                color: sess === f ? "var(--text-main)" : "var(--text-muted)",
                boxShadow: sess === f ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
              }}
            >
              {f}
            </button>
          ))}
          <div style={{ width: "1px", background: "var(--border-light)", margin: "4px 0" }} />
          <button onClick={() => setSortWr(s => !s)} 
            style={{ 
              padding: "6px 16px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 600, 
              transition: "all 0.2s", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              background: sortWr ? "var(--accent-lime-fade)" : "transparent",
              color: sortWr ? "var(--accent-lime)" : "var(--text-muted)",
            }}
          >
            <BarChart2 size={14} /> {sortWr ? "Sorted by WR" : "Sort WR"}
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="styled-table" style={{ minWidth: "800px" }}>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>SLOT</th>
              <th style={{ width: "15%" }}>SESSION · HR</th>
              <th style={{ width: "12%" }}>DST ON</th>
              <th style={{ width: "12%" }}>DST OFF</th>
              <th style={{ width: "25%" }}>WIN RATE</th>
              <th style={{ width: "15%" }}>TP / SL / BE</th>
              <th style={{ width: "13%" }}>VERDICT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const vColorStr = { best: "var(--accent-lime)", trade: "var(--accent-lime-dim)", marginal: "var(--text-muted)", avoid: "var(--status-red)" }[d.verdict];
              return (
                <tr key={d.slot}>
                  <td><span style={{ color: "var(--text-main)", fontWeight: 700, fontSize: "13px" }}>{d.label}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px" }}>{d.session === "London" ? "🇬🇧" : "🇺🇸"}</span>
                      <span className="text-sub">{d.session}</span>
                      <span style={{ color: "var(--text-main)", fontWeight: 600, fontSize: "13px" }}>Hr {d.mktHr}</span>
                    </div>
                  </td>
                  <td><span className="text-body">{d.dstOn}</span></td>
                  <td><span className="text-sub">{d.dstOff}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ flex: 1, height: "6px", background: "var(--bg-primary)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ width: `${d.wr}%`, height: "100%", background: vColorStr, borderRadius: "99px", transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ color: vColorStr, fontSize: "13px", fontWeight: 700, minWidth: "40px" }}>{d.wr.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "var(--accent-lime)", fontWeight: 600 }}>{d.tp}</span>
                    <span style={{ color: "var(--text-faint)", margin: "0 6px" }}>/</span>
                    <span style={{ color: "var(--status-red)", fontWeight: 600 }}>{d.sl}</span>
                    <span style={{ color: "var(--text-faint)", margin: "0 6px" }}>/</span>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{d.be}</span>
                  </td>
                  <td><VTag v={d.verdict} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
