"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import HourlyTable from "./HourlyTable";
import { HalfHourlyChart, OutcomeSplit, SessionYield, DailyAccuracy, MonthlyMatrix } from "./charts/Charts";
import { KPI_DATA } from "@/lib/mockData";

export default function Dashboard() {
  const [isDst, setIsDst] = useState(true);
  const startMinutes = isDst ? 810 : 870;

  return (
    <div className="page-container">
      <Sidebar />
      
      <main className="main-content">
        <Header isDst={isDst} toggleDst={() => setIsDst(d => !d)} />

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          {KPI_DATA.map((kpi, i) => (
            <StatCard 
              key={i}
              label={kpi.label}
              value={kpi.value}
              sub={kpi.sub}
              trend={kpi.trend}
              state={kpi.state}
              delay={i * 50 + 100}
            />
          ))}
        </div>

        {/* Hero Charts Row */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <HalfHourlyChart />
            </div>
          </div>
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <OutcomeSplit />
            <SessionYield />
          </div>
        </div>

        {/* Daily & Monthly Grid */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <DailyAccuracy />
            </div>
          </div>
          <div style={{ flex: "1.5 1 500px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <MonthlyMatrix />
            </div>
          </div>
        </div>

        {/* Table Row */}
        <HourlyTable />

        <footer style={{ marginTop: "48px", marginBottom: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-faint)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            ALL WIN RATES EXCLUDE BE (SCORE=0) · DST HHSlot FILTER · SESSION START {isDst ? "13:30" : "14:30"} IST ({startMinutes} MIN)
          </p>
        </footer>
      </main>
    </div>
  );
}
