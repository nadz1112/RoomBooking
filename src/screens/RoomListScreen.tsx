import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingModal } from '../components/BookingModal';
import {
  BuildingFilter,
  FilterChips,
  StatusFilter,
} from '../components/FilterChips';
import { Header } from '../components/Header';
import {
  NotificationModal,
  NotificationType,
} from '../components/NotificationModal';
import { RoomCard } from '../components/RoomCard';
import { SearchBar } from '../components/SearchBar';
import { MOCK_ROOMS } from '../data/mockRooms';
import { Room } from '../types/room';

interface NotificationState {
  visible: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

export const RoomListScreen: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Tất cả');
  const [buildingFilter, setBuildingFilter] =
    useState<BuildingFilter>('Tất cả tòa');

  // State cho Modal đặt phòng và Modal thông báo tùy chỉnh
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Tính số lượng phòng còn trống trên toàn hệ thống
  const totalAvailableCount = useMemo(() => {
    return rooms.filter((r) => r.status === 'Còn trống').length;
  }, [rooms]);

  // Bộ lọc đa tiêu chí + tìm kiếm thời gian thực
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = room.name.toLowerCase().includes(query);
        const matchBuilding = room.building.toLowerCase().includes(query);
        if (!matchName && !matchBuilding) {
          return false;
        }
      }

      // 2. Lọc theo trạng thái phòng
      if (statusFilter !== 'Tất cả' && room.status !== statusFilter) {
        return false;
      }

      // 3. Lọc theo tòa nhà / khu vực
      if (buildingFilter !== 'Tất cả tòa') {
        const buildingKey = buildingFilter
          .replace('Tòa nhà ', '')
          .replace('Khu ', '')
          .replace('Trung Tâm ', '')
          .toLowerCase();
        if (!room.building.toLowerCase().includes(buildingKey)) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, searchQuery, statusFilter, buildingFilter]);

  // Mở modal đặt phòng tùy chỉnh
  const handleOpenBooking = useCallback((room: Room) => {
    setSelectedRoom(room);
  }, []);

  // Đóng modal đặt phòng
  const handleCloseBooking = useCallback(() => {
    setSelectedRoom(null);
  }, []);

  // Xử lý xác nhận đặt phòng và ngăn ngừa xung đột
  const handleConfirmBooking = useCallback(
    (roomId: string, slotId: string) => {
      let bookedRoomName = '';
      let bookedSlotTime = '';

      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== roomId) {
            return room;
          }

          bookedRoomName = room.name;

          // Cập nhật trạng thái slot vừa đặt
          const updatedSlots = room.timeSlots.map((slot) => {
            if (slot.id === slotId) {
              bookedSlotTime = slot.timeRange;
              return {
                ...slot,
                isBooked: true,
                bookedBy: 'Bạn (Sinh viên/Giảng viên đặt trực tuyến)',
              };
            }
            return slot;
          });

          // Tự động kiểm tra nếu đã hết ca trống thì chuyển sang 'Đang bận'
          const hasAvailableSlots = updatedSlots.some((s) => !s.isBooked);
          const newStatus = hasAvailableSlots ? 'Còn trống' : 'Đang bận';

          return {
            ...room,
            timeSlots: updatedSlots,
            status: newStatus,
          };
        })
      );

      // Đóng modal đặt phòng
      setSelectedRoom(null);

      // Kích hoạt cửa sổ thông báo thành công tùy chỉnh
      setNotification({
        visible: true,
        type: 'success',
        title: 'Đặt Phòng Thành Công!',
        message: `Bạn đã đăng ký thành công:\n${bookedRoomName}\nKhung giờ: ${bookedSlotTime}\n\nHệ thống đã tự động khóa ca này để ngăn chặn đặt trùng lặp.`,
      });
    },
    []
  );

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('Tất cả');
    setBuildingFilter('Tất cả tòa');
  }, []);

  const renderItem: ListRenderItem<Room> = useCallback(
    ({ item }) => {
      return <RoomCard room={item} onPress={handleOpenBooking} />;
    },
    [handleOpenBooking]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.listHeaderWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
        <FilterChips
          statusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          buildingFilter={buildingFilter}
          onSelectBuilding={setBuildingFilter}
          resultCount={filteredRooms.length}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh Sách Phòng Học & Lab</Text>
          <Text style={styles.sectionSubtitle}>
            Chạm vào thẻ phòng để xem lịch và đăng ký khung giờ
          </Text>
        </View>
      </View>
    );
  }, [
    searchQuery,
    handleClearSearch,
    statusFilter,
    buildingFilter,
    filteredRooms.length,
  ]);

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
        <Text style={styles.emptySubtitle}>
          Vui lòng thử tìm với từ khóa khác hoặc điều chỉnh lại bộ lọc trạng thái và tòa nhà.
        </Text>
        <Pressable
          onPress={handleResetFilters}
          hitSlop={8}
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.resetButtonText}>Xóa tất cả bộ lọc</Text>
        </Pressable>
      </View>
    );
  }, [handleResetFilters]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header totalRooms={rooms.length} availableRooms={totalAvailableCount} />

      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />

      {/* Cửa sổ Modal Đặt phòng & Chọn ca học tùy chỉnh */}
      <BookingModal
        visible={selectedRoom !== null}
        room={selectedRoom}
        onClose={handleCloseBooking}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Cửa sổ Modal Thông báo tùy chỉnh thay thế Alert.alert */}
      <NotificationModal
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={handleCloseNotification}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  listContent: {
    paddingBottom: 40,
    backgroundColor: '#F1F5F9',
    minHeight: '100%',
  },
  listHeaderWrapper: {
    backgroundColor: '#F1F5F9',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  separator: {
    height: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  resetButton: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
