import { useIoT } from "@/context/IoTContext";
import { ParkingGrid } from "@/components/dashboard/ParkingGrid";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { Wind, Thermometer, Users, Activity, Car, CalendarClock } from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function Dashboard() {
  const { stats } = useIoT();
  
  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time IoT Sensor Data & Parking Status</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono bg-card border border-border px-4 py-2 rounded-full shadow-sm">
           <div className="flex items-center gap-2 text-blue-400">
             <Thermometer className="h-4 w-4" />
             {stats.temperature}°C
           </div>
           <div className="h-4 w-px bg-border" />
           <div className="flex items-center gap-2 text-cyan-400">
             <Wind className="h-4 w-4" />
             {stats.humidity}%
           </div>
           <div className="h-4 w-px bg-border" />
           <div className="flex items-center gap-2 text-green-400">
             <Activity className="h-4 w-4" />
             {stats.co2Level} ppm
           </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
         <StatCard label="Total Capacity" value={stats.totalSpots} icon={Users} color="text-foreground" />
         <StatCard label="Occupied" value={stats.occupied} icon={Car} color="text-red-500" />
         <StatCard label="Available" value={stats.free} icon={Car} color="text-green-500" />
         <StatCard label="Reserved" value={stats.reserved} icon={CalendarClock} color="text-amber-500" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Parking Grid</h2>
            <div className="flex gap-2 text-xs">
              <LegendItem color="bg-green-500" label="Free" />
              <LegendItem color="bg-red-500" label="Occupied" />
              <LegendItem color="bg-amber-500" label="Reserved" />
            </div>
          </div>
          <ParkingGrid />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <StatsPanel />
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              System Health
            </h3>
            <div className="space-y-4">
              <StatusRow label="Gateway Connection" status="online" />
              <StatusRow label="Sensor Mesh Network" status="online" />
              <StatusRow label="Cloud Sync" status="syncing" />
              <StatusRow label="Database Shard 1" status="online" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number | string, icon: LucideIcon, color: string }) {
  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm flex items-center justify-between hover:border-primary/50 transition-colors">
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className={`text-3xl font-bold mt-2 ${color}`}>{value}</div>
      </div>
      <div className={`p-3 rounded-full bg-background border border-border ${color.replace('text-', 'bg-').replace('500', '500/10')}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string, status: 'online' | 'offline' | 'syncing' }) {
  const colors = {
    online: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    offline: "bg-red-500",
    syncing: "bg-blue-500 animate-pulse"
  };
  
  return (
    <div className="flex items-center justify-between text-sm group">
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
      <div className="flex items-center gap-2">
        <span className="capitalize text-xs font-mono opacity-70">{status}</span>
        <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
