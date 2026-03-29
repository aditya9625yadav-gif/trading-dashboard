"use client";

import React from "react";
import { Search, Clock, Calendar, ChevronDown, Bell } from "lucide-react";

interface HeaderProps {
  isDst: boolean;
  toggleDst: () => void;
}

export default function Header({ isDst, toggleDst }: HeaderProps) {
  return (
    <header className="glass-panel" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      marginBottom: "24px",
      borderRadius: "var(--radius-xl)"
    }}>
      <div className="animate-fade-in stagger-1">
        <h1 className="h1" style={{ marginBottom: "4px" }}>XAUUSD Overview</h1>
        <p className="text-sub">Backtest Strategy · 2021–2026 · 1,240 Total Trades</p>
      </div>

      <div className="flex-center animate-fade-in stagger-2" style={{ gap: "16px" }}>
        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          padding: "10px 16px",
          width: "240px",
          transition: "border-color 0.3s"
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search metrics or slots..." 
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "var(--text-main)", 
              fontSize: "13px", 
              outline: "none", 
              width: "100%" 
            }}
          />
        </div>

        {/* Date / Filter */}
        <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-primary)" }}>
          <Calendar size={16} color="var(--text-muted)"/>
          <span>Jan 21 – Mar 26</span>
          <ChevronDown size={14} color="var(--text-muted)"/>
        </button>

        {/* DST Toggle */}
        <button 
          onClick={toggleDst} 
          className="btn"
          style={{ 
            background: isDst ? "var(--accent-lime-fade)" : "var(--bg-primary)",
            color: isDst ? "var(--accent-lime)" : "var(--text-muted)",
            border: `1px solid ${isDst ? "var(--border-active)" : "var(--border-medium)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "8px 16px"
          }}
        >
          <Clock size={16} />
          DST {isDst ? "ON" : "OFF"}
          <span style={{ 
            fontSize: "10px", 
            padding: "2px 8px", 
            borderRadius: "6px", 
            background: isDst ? "var(--accent-lime)" : "var(--bg-card-hover)", 
            color: isDst ? "#000" : "var(--text-muted)", 
            fontWeight: 800 
          }}>
            {isDst ? "13:30" : "14:30"}
          </span>
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button className="flex-center" style={{
            width: "42px",
            height: "42px",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-medium)",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "all 0.2s"
          }}>
            <Bell size={18} />
          </button>
          <div style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "var(--status-red)",
            border: "3px solid var(--bg-card)",
            boxShadow: "0 0 10px var(--status-red-fade)"
          }} />
        </div>
      </div>
    </header>
  );
}
