
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-[10%] left-[5%] w-72 h-72 bg-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[15%] right-[10%] w-96 h-96 bg-red/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed top-[40%] right-[15%] w-64 h-64 bg-cream/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Header />
      <main className="flex-1 relative z-10 animate-in">
        <Outlet />
      </main>
    </div>
  );
}
