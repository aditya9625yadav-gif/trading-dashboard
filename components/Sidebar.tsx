"use client";

import React, { useState } from "react";
import { LayoutDashboard, BarChart2, Clock, Target, Activity, SlidersHorizontal, Bell, Settings, Zap } from "lucide-react";

const NAV = [
  { icon: <LayoutDashboard size={20} />, id: "dash", label: "Dashboard" },
  { icon: <BarChart2 size={20} />, id: "chart", label: "Analytics" },
  { icon: <Clock size={20} />, id: "clock", label: "Sessions" },
  { icon: <Target size={20} />, id: "target", label: "Targets" },
  { icon: <Activity size={20} />, id: "act", label: "Performance" },
  { icon: <SlidersHorizontal size={20} />, id: "filt", label: "Filters" },
];

export default function Sidebar() {
  const [active, setActive] = useState("dash");

  return (
    <div style={{
      width: "80px",
      minHeight: "100vh",
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border-light)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 0",
      gap: "8px",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div className="flex-center" style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-lime)", marginBottom: 32, boxShadow: "0 4px 20px rgba(200,255,0,0.2)" }}>
        <Zap size={24} color="#000" strokeWidth={2.5} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", padding: "0 16px" }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            title={n.label}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              background: active === n.id ? "var(--accent-lime-fade)" : "transparent",
              color: active === n.id ? "var(--accent-lime)" : "var(--text-faint)",
            }}
          >
            {n.icon}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", width: "100%" }}>
        <button style={{ background: "transparent", border: "none", color: "var(--text-faint)", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-main)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}>
          <Bell size={20} />
        </button>
        <button style={{ background: "transparent", border: "none", color: "var(--text-faint)", cursor: "pointer", transition: "color 0.2s", marginBottom: 12 }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-main)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}>
          <Settings size={20} />
        </button>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid var(--border-medium)",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--text-main)",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}>
          AU
        </div>
      </div>
    </div>
  );
}
