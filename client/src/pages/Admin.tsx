import { useIoT } from "@/context/IoTContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, RefreshCcw, ShieldCheck, Database, Server } from "lucide-react";

export default function Admin() {
  const { slots, toggleSlotStatus, toggleSimulation, simulationActive } = useIoT();

  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <Button 
          variant={simulationActive ? "destructive" : "default"}
          onClick={toggleSimulation}
          className="gap-2"
        >
          {simulationActive ? <AlertTriangle className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
          {simulationActive ? "Stop Simulation" : "Start Simulation"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
               <ShieldCheck className="h-6 w-6" />
               Operational
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">Database</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-blue-500 flex items-center gap-2">
               <Database className="h-6 w-6" />
               Connected
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">IoT Gateway</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-purple-500 flex items-center gap-2">
               <Server className="h-6 w-6" />
               Active
             </div>
           </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parking Slot Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Sensor ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-mono">{slot.id}</TableCell>
                  <TableCell className="font-bold">{slot.label}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{slot.sensorId}</TableCell>
                  <TableCell className="capitalize">{slot.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      slot.status === 'free' ? 'default' : 
                      slot.status === 'occupied' ? 'destructive' : 
                      'secondary'
                    } className={
                      slot.status === 'free' ? 'bg-green-500 hover:bg-green-600' : ''
                    }>
                      {slot.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(slot.lastUpdated).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toggleSlotStatus(slot.id)}
                    >
                      Toggle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
