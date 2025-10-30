import { SignedIn } from "@clerk/nextjs";
import DashboardNav from "../components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div className="min-h-screen w-full bg-green-950/5 flex justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-4xl md:max-w-6xl lg:max-w-7xl p-4 md:p-8 gap-6">
        {/* Sidebar */}
        <div className="w-[220px] border-r border-green-950/20">
          <aside className="hidden md:flex flex-col p-4 ">
            <DashboardNav />
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 rounded-xl p-4 md:p-6  overflow-hidden">
          {children}
        </main>
      </div>
    </div>
   
  );
}
