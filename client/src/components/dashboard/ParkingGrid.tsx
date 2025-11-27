import { useState } from "react";
import { motion } from "framer-motion";
import { ParkingSlot } from "@/lib/types";
import { Car, Zap, Accessibility, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIoT } from "@/context/IoTContext";
import { PaymentModal } from "@/components/PaymentModal";

export function ParkingGrid() {
  const { slots, toggleSlotStatus } = useIoT();
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === "free") {
      setSelectedSlot(slot);
      setShowPayment(true);
    } else {
      toggleSlotStatus(slot.id);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            onClick={() => handleSlotClick(slot)}
            showClickHint={slot.status === "free"}
          />
        ))}
      </div>
      <PaymentModal slot={selectedSlot} open={showPayment} onOpenChange={setShowPayment} />
    </>
  );
}

function SlotCard({
  slot,
  onClick,
  showClickHint,
}: {
  slot: ParkingSlot;
  onClick: () => void;
  showClickHint: boolean;
}) {
  const statusColors = {
    free: "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 hover:border-green-500/60",
    occupied: "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/60",
    reserved: "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/60",
    maintenance: "bg-gray-500/10 border-gray-500/30 text-gray-500 hover:bg-gray-500/20 hover:border-gray-500/60",
  };

  const TypeIcon = slot.type === 'ev' ? Zap : slot.type === 'disabled' ? Accessibility : Car;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
      className={cn(
        "relative aspect-[3/4] rounded-xl border flex flex-col items-center justify-center p-2 transition-all duration-300 group",
        statusColors[slot.status]
      )}
      data-testid={`slot-${slot.label}`}
    >
      <div className="absolute top-2 left-2 text-[10px] font-mono font-bold opacity-60 group-hover:opacity-100">
        {slot.label}
      </div>

      <div
        className={cn(
          "p-3 rounded-full mb-2 transition-colors duration-300",
          slot.status === 'free' ? "bg-green-500/10" : slot.status === 'occupied' ? "bg-red-500/10" : "bg-amber-500/10"
        )}
      >
        <TypeIcon className="w-6 h-6" />
      </div>

      <div className="text-xs font-bold uppercase tracking-wider">{slot.status}</div>

      {showClickHint && <div className="absolute bottom-8 text-[8px] font-semibold opacity-70 text-green-600">₹50/h</div>}

      <div className="absolute bottom-2 text-[9px] font-mono opacity-40 group-hover:opacity-80 truncate max-w-[90%]">
        ID: {slot.sensorId}
      </div>

      {slot.status === 'occupied' && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      )}
    </motion.button>
  );
}
