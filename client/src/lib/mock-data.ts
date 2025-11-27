import { ParkingSlot } from './types';

export const INITIAL_SLOTS: ParkingSlot[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `slot-${i + 1}`,
  label: `A-${(i + 1).toString().padStart(3, '0')}`,
  status: Math.random() > 0.7 ? 'occupied' : 'free',
  type: i % 10 === 0 ? 'disabled' : i % 15 === 0 ? 'ev' : 'standard',
  floor: 1,
  lastUpdated: new Date().toISOString(),
  sensorId: `SN-${1000 + i}`
}));
