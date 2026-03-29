import Papa from "papaparse";
import { SlotData, DayData, Session, Verdict, DONUT as DEFAULT_DONUT, SLOTS as DEFAULT_SLOTS } from "./mockData";

export interface ParsedDashboardData {
  SLOTS: SlotData[];
  DAYS: DayData[];
  MONTHLY: Record<number, number[]>;
  DONUT: { name: string; value: number; color?: string }[];
  SESSIONS: { name: Session; tp: number; sl: number; be: number; wr: number }[];
  KPI_DATA: any[];
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

export function parseCSVToDashboardData(file: File, isDstActive: boolean = true): Promise<ParsedDashboardData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as any[];

          // 1. Initialize data structures
          let tpCount = 0; let slCount = 0; let beCount = 0;

          const monthlyData: Record<number, { tp: number, sl: number, be: number }[]> = {};
          
          const sessionMap: Record<string, { tp: number, sl: number, be: number }> = {
            "London": { tp: 0, sl: 0, be: 0 },
            "New York": { tp: 0, sl: 0, be: 0 }
          };

          const dayMap: Record<string, { tp: number, sl: number, be: number }> = {
            "Monday": { tp: 0, sl: 0, be: 0 },
            "Tuesday": { tp: 0, sl: 0, be: 0 },
            "Wednesday": { tp: 0, sl: 0, be: 0 },
            "Thursday": { tp: 0, sl: 0, be: 0 },
            "Friday": { tp: 0, sl: 0, be: 0 },
          };

          // Deep clone DEFAULT_SLOTS to initialize counters
          const slots: (SlotData & { countTp: number, countSl: number, countBe: number })[] = DEFAULT_SLOTS.map(s => ({
            ...s, countTp: 0, countSl: 0, countBe: 0, tp: 0, sl: 0, be: 0, wr: 0
          }));

          // Parse bounds handling unicode dash
          const slotBounds = slots.map(s => {
             const timeRange = isDstActive ? s.dstOn : s.dstOff;
             const [startStr, endStr] = timeRange.replace("–","-").split('-');
             const [sh, sm] = startStr.split(':').map(Number);
             const [eh, em] = endStr.split(':').map(Number);
             
             let startMin = sh * 60 + sm;
             let endMin = eh * 60 + em;
             if (startMin < 720) startMin += 24 * 60;
             if (endMin <= 720) endMin += 24 * 60;

             return { slotId: s.slot, startMin, endMin };
          });

          // 2. Iterate Rows
          rows.forEach((row) => {
            const resultStr = (row["Result"] || row["Outcome"] || "").toString().trim().toUpperCase();
            if (!resultStr) return; // skip row
            
            const isTp = resultStr === "TP" || resultStr === "WIN";
            const isSl = resultStr === "SL" || resultStr === "LOSS";
            const isBe = resultStr === "BE" || resultStr === "BREAKEVEN" || resultStr === "BREAK EVEN";
            if (!isTp && !isSl && !isBe) return;

            if (isTp) tpCount++;
            if (isSl) slCount++;
            if (isBe) beCount++;

            // Monthly Tracking
            const yearStr = row["Year"];
            const monthStr = row["Month"];
            if (yearStr && monthStr) {
               const year = parseInt(yearStr, 10);
               const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase() === monthStr.toLowerCase().trim());
               if (!isNaN(year) && monthIndex !== -1) {
                  if (!monthlyData[year]) {
                     monthlyData[year] = Array.from({length: 12}, () => ({tp: 0, sl: 0, be: 0}));
                  }
                  if (isTp) monthlyData[year][monthIndex].tp++;
                  else if (isSl) monthlyData[year][monthIndex].sl++;
                  else if (isBe) monthlyData[year][monthIndex].be++;
               }
            }

            // Day Tracking
            const dayStr = (row["Day"] || "").trim();
            const matchedDay = Object.keys(dayMap).find(k => k.toLowerCase() === dayStr.toLowerCase());
            if (matchedDay) {
               if (isTp) dayMap[matchedDay].tp++;
               else if (isSl) dayMap[matchedDay].sl++;
               else if (isBe) dayMap[matchedDay].be++;
            }

            // Session Tracking
            const sessionStr = (row["Session"] || "").trim().toLowerCase();
            const sessKey = sessionStr.includes("london") ? "London" : sessionStr.includes("new york") || sessionStr.includes("ny") ? "New York" : null;
            if (sessKey) {
               if (isTp) sessionMap[sessKey].tp++;
               else if (isSl) sessionMap[sessKey].sl++;
               else if (isBe) sessionMap[sessKey].be++;
            }

            // Time Tracking for SLOTS
            const timeStr = row["Time"];
            if (timeStr && timeStr.includes(":")) {
               const [th, tm] = timeStr.split(':').map(Number);
               let tMin = th * 60 + tm;
               if (tMin < 720) tMin += 24 * 60; // morning shifts

               const matchedBound = slotBounds.find(b => tMin >= b.startMin && tMin < b.endMin);
               if (matchedBound) {
                  const sTarget = slots.find(s => s.slot === matchedBound.slotId);
                  if (sTarget) {
                     if (isTp) sTarget.countTp++;
                     else if (isSl) sTarget.countSl++;
                     else if (isBe) sTarget.countBe++;
                  }
               }
            }
          });

          // 3. Compile final structures
          const totalTrades = tpCount + slCount + beCount;
          const globalWr = totalTrades > 0 ? (tpCount / ((tpCount + slCount) || 1)) * 100 : 0;

          const DONUT = [
            { name:"TP",  value: tpCount, color:"var(--accent-lime)" },
            { name:"SL",  value: slCount, color:"var(--status-red)" },
            { name:"BE",  value: beCount, color:"var(--text-faint)" },
          ];

          const SESSIONS = [
            { name: "London" as Session, tp: sessionMap["London"].tp, sl: sessionMap["London"].sl, be: sessionMap["London"].be, wr: (sessionMap["London"].tp / ((sessionMap["London"].tp + sessionMap["London"].sl) || 1)) * 100 },
            { name: "New York" as Session, tp: sessionMap["New York"].tp, sl: sessionMap["New York"].sl, be: sessionMap["New York"].be, wr: (sessionMap["New York"].tp / ((sessionMap["New York"].tp + sessionMap["New York"].sl) || 1)) * 100 },
          ];

          const DAYS = DAY_NAMES.map(name => {
             const d = dayMap[name];
             return {
                day: name.substring(0,3), // "Mon"
                tp: d.tp, sl: d.sl, be: d.be,
                wr: (d.tp / ((d.tp + d.sl) || 1)) * 100
             };
          });

          const MONTHLY: Record<number, number[]> = {};
          Object.keys(monthlyData).forEach(yrStr => {
             const yr = parseInt(yrStr, 10);
             MONTHLY[yr] = monthlyData[yr].map(m => {
                const totalPlayed = m.tp + m.sl;
                if (totalPlayed === 0) return 0;
                return Math.round((m.tp / totalPlayed) * 100);
             });
          });

          // Finalize Slots
          let bestSlotName = "N/A";
          let bestSlotWr = -1;
          let worstSlotName = "N/A";
          let worstSlotWr = 101;

          const finalSlots = slots.map(s => {
             s.tp = s.countTp; s.sl = s.countSl; s.be = s.countBe;
             const totalPlayed = s.tp + s.sl;
             s.wr = totalPlayed > 0 ? (s.tp / totalPlayed) * 100 : 0;
             
             if (totalPlayed > 3) {
                if (s.wr > 50) s.verdict = "best";
                else if (s.wr >= 43) s.verdict = "trade";
                else if (s.wr >= 38) s.verdict = "marginal";
                else s.verdict = "avoid";
                
                if (s.wr > bestSlotWr) { bestSlotWr = s.wr; bestSlotName = `${s.label}`; }
                if (s.wr < worstSlotWr) { worstSlotWr = s.wr; worstSlotName = `${s.label}`; }
             } else {
                s.verdict = "avoid"; // not enough data
             }
             return s;
          });

          const KPI_DATA = [
            { label:"Total Trades",  value: totalTrades.toLocaleString(),  sub:"Dynamically Parsed CSV", trend: totalTrades > 500 ? "up" : "flat", state:"neutral" },
            { label:"Base Win Rate", value: globalWr.toFixed(1) + "%",  sub:"All trades excl. BE", trend: globalWr > 45 ? "up" : "flat", state: globalWr >= 45 ? "lime" : globalWr >= 38 ? "amber" : "red" },
            { label:"Best Slot",     value: bestSlotWr === -1 ? "-" : `${bestSlotWr.toFixed(1)}%`,  sub: bestSlotName, trend:"up",   state:"lime" },
            { label:"Worst Slot",    value: worstSlotWr === 101 ? "-" : `${worstSlotWr.toFixed(1)}%`,   sub: worstSlotName, trend:"down", state:"red" },
          ];

          resolve({
             SLOTS: finalSlots,
             DAYS,
             MONTHLY,
             DONUT,
             SESSIONS,
             KPI_DATA
          });

        } catch (e) {
          console.error("Error formatting CSV data", e);
          reject(e);
        }
      },
      error: (err) => reject(err)
    });
  });
}
