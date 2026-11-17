// src/app/dashboard/layout.tsx
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col bg-grid">
        <TopBar />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
