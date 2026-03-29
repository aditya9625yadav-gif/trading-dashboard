"use client";

import React, { useRef } from "react";
import { Search, Clock, Calendar, ChevronDown, Bell, UploadCloud } from "lucide-react";

interface HeaderProps {
  isDst: boolean;
  toggleDst: () => void;
  onFileUpload: (file: File) => void;
}

export default function Header({ isDst, toggleDst, onFileUpload }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

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
        <h1 className="h1" style={{ marginBottom: "4px" }}>Trading Dashboard</h1>
        <p className="text-sub">Performance Analytics</p>
      </div>

      <div className="flex-center animate-fade-in stagger-2" style={{ gap: "16px" }}>
        
        {/* Upload Button */}
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
        />
        <button 
          className="btn btn-primary" 
          onClick={() => fileInputRef.current?.click()}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <UploadCloud size={16} />
          Upload Data
        </button>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          padding: "10px 16px",
          width: "200px",
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
        </div>
      </div>
    </header>
  );
}
