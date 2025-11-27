export type SlotStatus = 'free' | 'occupied' | 'reserved' | 'maintenance';
export type SlotType = 'standard' | 'disabled' | 'ev';

export interface ParkingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  type: SlotType;
  floor: number;
  lastUpdated: string;
  sensorId: string;
}

export interface SystemStats {
  totalSpots: number;
  occupied: number;
  free: number;
  reserved: number;
  temperature: number;
  humidity: number;
  co2Level: number;
  activeSensors: number;
}
