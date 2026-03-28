"use client";

import dynamic from 'next/dynamic';

// This tells Next.js to ONLY load the dashboard in the browser, 
// preventing the hydration mismatch with the charts.
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Dashboard />
    </main>
  );
}