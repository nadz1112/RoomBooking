import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Booking, UserProfile } from '../types';

interface BookingState {
  bookings: Booking[];
  userProfile: UserProfile;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  removeBooking: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Lê Xuân Hoài Nam',
  studentId: '23IT175',
  email: 'namlxh.23it@vku.udn.vn',
  role: 'Sinh viên Khoa Kỹ Thuật Máy Tính',
  cohort: 'Khóa 2023 - 2028',
  phone: '0905 123 456',
  department: 'Khoa Kỹ Thuật Máy Tính & Điện Tử',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-100234',
    roomId: 'room-1',
    roomName: 'Phòng Lab Trí Tuệ Nhân Tạo (AI & Data)',
    building: 'Tòa nhà A3',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 - 10:00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'BK-100582',
    roomId: 'room-3',
    roomName: 'Phòng Thí Nghiệm IoT & Hệ Thống Nhúng',
    building: 'Tòa nhà K',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '13:00 - 15:00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: INITIAL_BOOKINGS,
      userProfile: DEFAULT_PROFILE,

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

      updateUserProfile: (profile: Partial<UserProfile>) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
          },
        })),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
