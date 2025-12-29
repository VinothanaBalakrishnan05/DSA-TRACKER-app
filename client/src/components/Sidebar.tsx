import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, BookOpen, CalendarCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dsa", label: "DSA Topics", icon: BookOpen },
    { href: "/daily", label: "Daily Tracker", icon: CalendarCheck },
    { href: "/weekly", label: "Weekly Tracker", icon: LayoutDashboard },
    { href: "/monthly", label: "Monthly Tracker", icon: LayoutDashboard },
    { href: "/interview", label: "Core Subjects", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-64 bg-zinc-950 border-r border-white/10 transition-all duration-300">
      <div className="flex h-16 items-center justify-center md:justify-start md:px-6 border-b border-white/5">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg mr-0 md:mr-3">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="hidden md:block font-bold text-lg tracking-tight">DevTracker</span>
      </div>

      <nav className="mt-8 px-2 md:px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center justify-center md:justify-start px-2 md:px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
              isActive 
                ? "bg-primary text-primary-foreground font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}>
              <item.icon className={cn("h-5 w-5 md:mr-3 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="hidden md:block">{item.label}</span>
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-8 left-0 w-full px-4 text-center hidden md:block">
        <p className="text-xs text-zinc-600">v1.0.0 • Local Storage</p>
      </div>
    </aside>
  );
}
