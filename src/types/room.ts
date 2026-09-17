export type RoomStatus = 'Còn trống' | 'Đang bận';

export interface TimeSlot {
  id: string;
  timeRange: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  status: RoomStatus;
  imageUrl: string;
  timeSlots: TimeSlot[];
}
