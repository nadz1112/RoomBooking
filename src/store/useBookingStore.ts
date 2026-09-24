import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  removeBooking: (id: string) => void;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-init-1',
    roomId: 'room-1',
    roomName: 'Lab A3-101 (AI & Machine Learning)',
    building: 'Building A3',
    timeSlot: '08:00 - 10:00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'booking-init-2',
    roomId: 'room-3',
    roomName: 'Lab K-102 (IoT & Embedded Systems)',
    building: 'Building K',
    timeSlot: '13:00 - 15:00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: INITIAL_BOOKINGS,

      addBooking: (booking: Booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      cancelBooking: (id: string) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' } : b
          ),
        })),

      removeBooking: (id: string) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
