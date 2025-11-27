import { Link, useLocation } from "wouter";
import { Car, LayoutDashboard, CalendarCheck, Settings, Activity, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIoT } from "@/context/IoTContext";
import { Button } from "@/components/ui/button";

export function Navbar({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  const [location] = useLocation();
  const { simulationActive, toggleSimulation } = useIoT();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/reserve", icon: CalendarCheck, label: "Reserve" },
    { href: "/report", icon: FileText, label: "Report" },
    { href: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Car className="h-6 w-6" />
          </div>
          <span className="hidden sm:inline">SmartPark<span className="text-foreground">IoT</span></span>
        </div>

        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                location === item.href 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}>
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleSimulation}
             className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
           >
             <Activity className={cn("h-3 w-3", simulationActive ? "animate-pulse text-green-500" : "text-red-500")} />
             <span className="font-mono hidden md:inline">{simulationActive ? "SYSTEM ONLINE" : "SIMULATION PAUSED"}</span>
           </button>
           {user && (
             <div className="flex items-center gap-3 border-l border-border pl-4">
               <span className="text-sm text-muted-foreground hidden sm:inline">{user.username}</span>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={onLogout}
                 data-testid="button-logout"
               >
                 <LogOut className="h-4 w-4" />
               </Button>
             </div>
           )}
        </div>
      </div>
    </nav>
  );
}
