import React, { createContext, useContext, useEffect, useState } from 'react';
import { ParkingSlot, SystemStats, SlotStatus } from '@/lib/types';
import { INITIAL_SLOTS } from '@/lib/mock-data';

interface IoTContextType {
  slots: ParkingSlot[];
  stats: SystemStats;
  loading: boolean;
  simulationActive: boolean;
  toggleSimulation: () => void;
  reserveSlot: (id: string) => void;
  toggleSlotStatus: (id: string) => void;
}

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<ParkingSlot[]>(INITIAL_SLOTS);
  const [simulationActive, setSimulationActive] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    totalSpots: 48,
    occupied: 0,
    free: 0,
    reserved: 0,
    temperature: 24.5,
    humidity: 45,
    co2Level: 410,
    activeSensors: 48
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  useEffect(() => {
    const occupied = slots.filter(s => s.status === 'occupied').length;
    const reserved = slots.filter(s => s.status === 'reserved').length;
    const free = slots.filter(s => s.status === 'free').length;
    
    setStats(prev => ({
      ...prev,
      occupied,
      reserved,
      free,
      totalSpots: slots.length
    }));
  }, [slots]);

  // Simulation Engine
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Randomly toggle a slot status to simulate sensor updates
      // Only toggle 1-2 slots at a time to keep it realistic
      const randomIndices = Array.from({ length: 2 }, () => Math.floor(Math.random() * slots.length));
      
      setSlots(currentSlots => {
        const newSlots = [...currentSlots];
        let changed = false;
        
        randomIndices.forEach(index => {
          const slot = newSlots[index];
          // Don't mess with reserved or maintenance slots in auto-simulation
          if (slot.status !== 'reserved' && slot.status !== 'maintenance') {
             // 80% chance to stay same, 20% to toggle
             if (Math.random() > 0.8) {
               newSlots[index] = {
                 ...slot,
                 status: slot.status === 'free' ? 'occupied' : 'free',
                 lastUpdated: new Date().toISOString()
               };
               changed = true;
             }
          }
        });
        return changed ? newSlots : currentSlots;
      });

      // Fluctuate environmental sensors
      setStats(prev => ({
        ...prev,
        temperature: Number((prev.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
        humidity: Number((prev.humidity + (Math.random() - 0.5) * 0.5).toFixed(1)),
        co2Level: Math.floor(prev.co2Level + (Math.random() - 0.5) * 5)
      }));

    }, 3000);

    return () => clearInterval(interval);
  }, [simulationActive, slots.length]);

  const toggleSimulation = () => setSimulationActive(!simulationActive);

  const reserveSlot = (id: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, status: 'reserved', lastUpdated: new Date().toISOString() } : s));
  };

  const toggleSlotStatus = (id: string) => {
     setSlots(prev => prev.map(s => {
       if (s.id !== id) return s;
       let nextStatus: SlotStatus = s.status;
       
       if (s.status === 'free') nextStatus = 'occupied';
       else if (s.status === 'occupied') nextStatus = 'maintenance';
       else if (s.status === 'maintenance') nextStatus = 'free';
       else if (s.status === 'reserved') nextStatus = 'free';
       
       return { ...s, status: nextStatus, lastUpdated: new Date().toISOString() };
     }));
  };

  return (
    <IoTContext.Provider value={{ slots, stats, loading, simulationActive, toggleSimulation, reserveSlot, toggleSlotStatus }}>
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);
  if (context === undefined) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
}
