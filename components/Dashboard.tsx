"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import HourlyTable from "./HourlyTable";
import { HalfHourlyChart, OutcomeSplit, SessionYield, DailyAccuracy, MonthlyMatrix } from "./charts/Charts";
import { defaultDashboardData } from "@/lib/mockData";
import { parseCSVToDashboardData, ParsedDashboardData } from "@/lib/csvParser";

export default function Dashboard() {
  const [isDst, setIsDst] = useState(true);
  const [data, setData] = useState<ParsedDashboardData>(defaultDashboardData);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const startMinutes = isDst ? 810 : 870;

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    setUploadedFile(file);
    try {
      const parsed = await parseCSVToDashboardData(file, isDst);
      setData(parsed);
    } catch (e) {
      alert("Error parsing CSV");
    } finally {
      setIsParsing(false);
    }
  };

  React.useEffect(() => {
    if (uploadedFile) {
      handleFileUpload(uploadedFile);
    }
  }, [isDst]);

  return (
    <div className="page-container">
      <Sidebar />
      
      <main className="main-content">
        {isParsing && (
          <div style={{ position: "fixed", top: 16, right: 16, background: "var(--accent-lime)", color: "#000", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", zIndex: 9999 }}>
            Parsing CSV Data...
          </div>
        )}
        <Header isDst={isDst} toggleDst={() => setIsDst(d => !d)} onFileUpload={handleFileUpload} />

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          {data.KPI_DATA.map((kpi, i) => (
            <StatCard 
              key={i}
              label={kpi.label}
              value={kpi.value}
              sub={kpi.sub}
              trend={kpi.trend as any}
              state={kpi.state as any}
              delay={i * 50 + 100}
            />
          ))}
        </div>

        {/* Hero Charts Row */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <HalfHourlyChart slots={data.SLOTS} />
            </div>
          </div>
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <OutcomeSplit donut={data.DONUT} />
            <SessionYield sessions={data.SESSIONS} />
          </div>
        </div>

        {/* Daily & Monthly Grid */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <DailyAccuracy days={data.DAYS} />
            </div>
          </div>
          <div style={{ flex: "1.5 1 500px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <MonthlyMatrix monthly={data.MONTHLY} />
            </div>
          </div>
        </div>

        {/* Table Row */}
        <HourlyTable slots={data.SLOTS} />

        <footer style={{ marginTop: "48px", marginBottom: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-faint)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            ALL WIN RATES EXCLUDE BE (SCORE=0) · SESSION START {isDst ? "13:30" : "14:30"} IST ({startMinutes} MIN)
          </p>
        </footer>
      </main>
    </div>
  );
}
