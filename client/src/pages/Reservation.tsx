import { useState } from "react";
import { useIoT } from "@/context/IoTContext";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, Car } from "lucide-react";

export default function Reservation() {
  const { slots, reserveSlot } = useIoT();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const freeSlots = slots.filter(s => s.status === 'free');

  const handleReserve = () => {
    if (!selectedSlot || !date) return;
    
    reserveSlot(selectedSlot);
    toast({
      title: "Reservation Confirmed",
      description: `Spot ${slots.find(s => s.id === selectedSlot)?.label} reserved for ${date.toLocaleDateString()}`,
    });
    setSelectedSlot(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-20">
      <h1 className="text-3xl font-bold mb-8">Reserve a Spot</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full flex justify-center"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Select Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                  <SelectItem value="12:00">12:00 PM - 01:00 PM</SelectItem>
                  <SelectItem value="13:00">01:00 PM - 02:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Select Available Spot
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[400px] pr-2">
              <div className="grid grid-cols-3 gap-3">
                {freeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center",
                      selectedSlot === slot.id 
                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20" 
                        : "hover:bg-accent hover:border-accent-foreground/50 bg-card"
                    )}
                  >
                    <span className="font-bold">{slot.label}</span>
                    <span className="text-[10px] opacity-70 font-mono mt-1 uppercase">{slot.type}</span>
                  </button>
                ))}
              </div>
              {freeSlots.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No spots available</div>
              )}
            </CardContent>
            
            <div className="p-6 border-t mt-auto bg-card/50">
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!selectedSlot || !date}
                onClick={handleReserve}
              >
                Confirm Reservation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
