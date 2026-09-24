import { QueryClient, useQuery } from '@tanstack/react-query';
import { MOCK_ROOMS } from '../data/mockData';
import { Room } from '../types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    },
  },
});

// Giả lập fetching dữ liệu từ máy chủ với độ trễ 400ms
const fetchRoomsApi = async (building?: string): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!building || building === 'Tất cả' || building === 'All') {
    return MOCK_ROOMS;
  }

  return MOCK_ROOMS.filter((room) =>
    room.building.toLowerCase().includes(building.toLowerCase())
  );
};

export const useRooms = (building?: string) => {
  return useQuery({
    queryKey: ['rooms', { building }],
    queryFn: () => fetchRoomsApi(building),
  });
};

export const useRoomById = (id: string) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const room = MOCK_ROOMS.find((r) => r.id === id);
      if (!room) {
        throw new Error('Không tìm thấy thông tin phòng');
      }
      return room;
    },
  });
};
