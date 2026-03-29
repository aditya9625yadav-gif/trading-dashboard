import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "flat";
  state: "lime" | "red" | "amber" | "neutral" | "success" | "warning" | "danger";
  delay?: number;
}

export default function StatCard({ label, value, sub, trend, state, delay = 0 }: StatCardProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  
  let valueColor = "var(--text-main)";
  let bgGlow = "transparent";
  
  if (state === "lime" || state === "success") {
    valueColor = "var(--accent-lime)";
    bgGlow = "radial-gradient(ellipse at top right, var(--accent-lime-fade) 0%, transparent 70%)";
  } else if (state === "red" || state === "danger") {
    valueColor = "var(--status-red)";
    bgGlow = "radial-gradient(ellipse at top right, var(--status-red-fade) 0%, transparent 70%)";
  } else if (state === "amber" || state === "warning") {
    valueColor = "var(--status-amber)";
    bgGlow = "radial-gradient(ellipse at top right, var(--status-amber-fade) 0%, transparent 70%)";
  }

  return (
    <div className="glass-card animate-fade-in" style={{ 
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      animationDelay: `${delay}ms`,
      background: `var(--bg-card) ${bgGlow}`,
      backgroundBlendMode: "screen",
    }}>
      <div className="label-sm">{label}</div>
      
      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", margin: "4px 0" }}>
        <h2 className="outfit" style={{ 
          fontSize: "32px", 
          fontWeight: 700, 
          color: valueColor, 
          lineHeight: 1,
          letterSpacing: "-0.02em" 
        }}>
          {value}
        </h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div className={`badge ${
          isUp ? "badge-lime" : isDown ? "badge-red" : "badge-gray"
        }`}>
          {isUp && <TrendingUp size={12} />}
          {isDown && <TrendingDown size={12} />}
          {!isUp && !isDown && <Minus size={12} />}
          {trend === "flat" ? "FLAT" : trend.toUpperCase()}
        </div>
        <span className="text-sub" style={{ fontSize: "11px" }}>{sub}</span>
      </div>
    </div>
  );
}
