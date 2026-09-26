export type RoomStatus = 'Available' | 'Occupied' | 'Còn trống' | 'Đang bận';

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
  description?: string;
  facilities?: string[];
  timeSlots?: TimeSlot[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  role: string;
  cohort: string;
  phone: string;
  department: string;
  avatarUrl: string;
}

