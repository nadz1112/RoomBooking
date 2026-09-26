import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';
import { useRoomById } from '../services/queryClient';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';

const SAMPLE_TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
];

interface DateItem {
  dateString: string;
  dayOfWeek: string;
  dayNumber: number;
  monthString: string;
  isToday: boolean;
  displayFormatted: string;
}

// Ràng buộc chỉ chọn ngày từ HIỆN TẠI ĐẾN TƯƠNG LAI (14 ngày tới tính từ hôm nay)
const getUpcomingDates = (daysCount = 14): DateItem[] => {
  const dates: DateItem[] = [];
  const today = new Date();
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    dates.push({
      dateString,
      dayOfWeek: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
      dayNumber: d.getDate(),
      monthString: `Thg ${d.getMonth() + 1}`,
      isToday: i === 0,
      displayFormatted: `${day}/${month}`,
    });
  }

  return dates;
};

export const RoomDetailsScreen: React.FC<RootStackScreenProps<'RoomDetails'>> = ({
  route,
  navigation,
}) => {
  const { roomId, roomName } = route.params;

  // Fetch dữ liệu phòng
  const { data: room } = useRoomById(roomId);

  // Danh sách ngày khả dụng từ hiện tại đến tương lai
  const upcomingDates = useMemo(() => getUpcomingDates(14), []);
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0].dateString);

  // Zustand Store selectors
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);

  // State chọn khung giờ
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Thuật toán Conflict Prevention: Kiểm tra các slot đã có đơn 'confirmed' cho phòng này THEO NGÀY ĐÃ CHỌN
  const bookedSlotsSet = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.roomId === roomId && b.status === 'confirmed' && b.date === selectedDate) {
        set.add(b.timeSlot);
      }
    });
    return set;
  }, [bookings, roomId, selectedDate]);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null); // Reset ca học đã chọn khi đổi ngày để đảm bảo tính hợp lệ
  };

  // Reanimated Animation cho nút bấm "Xác Nhận Đặt Phòng"
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const selectedDateObj = useMemo(
    () => upcomingDates.find((d) => d.dateString === selectedDate) || upcomingDates[0],
    [upcomingDates, selectedDate]
  );

  const handleBookRoom = () => {
    if (!selectedSlot) return;

    const newBooking: Booking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      roomId: roomId,
      roomName: room?.name || roomName,
      building: room?.building || 'Campus VKU',
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Lưu vào Zustand persist store
    addBooking(newBooking);

    // Chuyển sang màn hình modal BookingConfirmation
    navigation.navigate('BookingConfirmation', {
      bookingId: newBooking.id,
    });
  };

  const isButtonDisabled = !selectedSlot;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ảnh phòng lớn */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                room?.imageUrl ||
                'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {room?.status === 'Available' || room?.status === 'Còn trống' ? '🟢 Sẵn sàng' : '🔴 Đang bận'}
            </Text>
          </View>
        </View>

        {/* Thông tin phòng */}
        <View style={styles.infoCard}>
          <Text style={styles.roomName}>{room?.name || roomName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.buildingText}>🏢 {room?.building}</Text>
            <Text style={styles.capacityText}>👥 {room?.capacity} chỗ ngồi</Text>
          </View>

          {room?.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionHeader}>Mô tả không gian</Text>
              <Text style={styles.descriptionText}>{room.description}</Text>
            </View>
          )}

          {/* Danh sách Tiện ích (Facilities) */}
          {room?.facilities && room.facilities.length > 0 && (
            <View style={styles.facilitiesSection}>
              <Text style={styles.sectionHeader}>Trang thiết bị & Tiện ích</Text>
              <View style={styles.facilityGrid}>
                {room.facilities.map((fac, idx) => (
                  <View key={idx} style={styles.facilityChip}>
                    <Text style={styles.facilityIcon}>✓</Text>
                    <Text style={styles.facilityName}>{fac}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Bộ chọn Ngày học (Date Selector) - Ràng buộc từ hiện tại đến tương lai */}
          <View style={styles.dateSection}>
            <View style={styles.dateHeaderRow}>
              <Text style={styles.sectionHeader}>1. Chọn Ngày Sử Dụng</Text>
              <View style={styles.constraintBadge}>
                <Text style={styles.constraintBadgeText}>Hôm nay → Tương lai</Text>
              </View>
            </View>
            <Text style={styles.sectionNotice}>
              * Hệ thống khóa các ngày quá khứ, chỉ cho phép đặt lịch từ hôm nay trở đi.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScrollContainer}
            >
              {upcomingDates.map((item) => {
                const isSelected = selectedDate === item.dateString;
                return (
                  <Pressable
                    key={item.dateString}
                    onPress={() => handleSelectDate(item.dateString)}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.datePill,
                      isSelected ? styles.datePillSelected : styles.datePillUnselected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateDayOfWeek,
                        isSelected && styles.dateDayOfWeekSelected,
                        item.isToday && !isSelected && styles.dateDayTodayText,
                      ]}
                    >
                      {item.dayOfWeek}
                    </Text>
                    <Text
                      style={[
                        styles.dateDayNumber,
                        isSelected && styles.dateDayNumberSelected,
                      ]}
                    >
                      {item.dayNumber}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        isSelected && styles.dateMonthSelected,
                      ]}
                    >
                      {item.monthString}
                    </Text>
                    {isSelected && <View style={styles.dateSelectedDot} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Bộ chọn khung giờ (Time-slot Selector) */}
          <View style={styles.slotsSection}>
            <View style={styles.slotsHeaderRow}>
              <Text style={styles.sectionHeader}>
                2. Chọn Ca Học ({selectedDateObj.displayFormatted})
              </Text>
              <Text style={styles.conflictNotice}>
                * Ca đã đặt sẽ bị khóa
              </Text>
            </View>

            <View style={styles.slotsList}>
              {SAMPLE_TIME_SLOTS.map((slot) => {
                const isConflict = bookedSlotsSet.has(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <Pressable
                    key={slot}
                    onPress={() => {
                      if (!isConflict) {
                        setSelectedSlot(slot === selectedSlot ? null : slot);
                      }
                    }}
                    disabled={isConflict}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.slotCard,
                      isConflict && styles.slotCardConflict,
                      isSelected && styles.slotCardSelected,
                      !isConflict && !isSelected && styles.slotCardAvailable,
                      pressed && !isConflict && styles.pressed,
                    ]}
                  >
                    <View style={styles.slotLeft}>
                      <Text
                        style={[
                          styles.slotTimeText,
                          isConflict && styles.slotTimeConflict,
                          isSelected && styles.slotTimeSelected,
                        ]}
                      >
                        ⏰ {slot}
                      </Text>
                    </View>

                    <View style={styles.slotRight}>
                      {isConflict ? (
                        <View style={styles.conflictBadge}>
                          <Text style={styles.conflictBadgeText}>🔒 Đã đặt</Text>
                        </View>
                      ) : isSelected ? (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>✓ Đã chọn</Text>
                        </View>
                      ) : (
                        <View style={styles.availableBadge}>
                          <Text style={styles.availableBadgeText}>Trống</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer chứa nút bấm hoạt họa Reanimated */}
      <View style={styles.footerContainer}>
        <Animated.View style={[styles.animatedButtonWrapper, animatedButtonStyle]}>
          <Pressable
            onPress={handleBookRoom}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isButtonDisabled}
            hitSlop={8}
            style={[
              styles.bookButton,
              isButtonDisabled && styles.bookButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.bookButtonText,
                isButtonDisabled && styles.bookButtonTextDisabled,
              ]}
            >
              {selectedSlot
                ? `Đặt Phòng (${selectedDateObj.displayFormatted} • ${selectedSlot})`
                : 'Vui Lòng Chọn Khung Giờ'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  infoCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
  },
  roomName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  buildingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  capacityText: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  facilitiesSection: {
    marginBottom: 22,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityIcon: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '800',
    marginRight: 6,
  },
  facilityName: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  dateSection: {
    marginBottom: 20,
    paddingTop: 4,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  constraintBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  constraintBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  sectionNotice: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  dateScrollContainer: {
    paddingVertical: 4,
    paddingRight: 10,
  },
  datePill: {
    width: 66,
    height: 82,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  datePillSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  datePillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  dateDayOfWeek: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  dateDayOfWeekSelected: {
    color: '#93C5FD',
  },
  dateDayTodayText: {
    color: '#0284C7',
    fontWeight: '800',
  },
  dateDayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  dateDayNumberSelected: {
    color: '#FFFFFF',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  dateMonthSelected: {
    color: '#E0F2FE',
  },
  dateSelectedDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
  },
  slotsSection: {
    marginTop: 4,
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  conflictNotice: {
    fontSize: 11,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  slotsList: {
    flexDirection: 'column',
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  slotCardAvailable: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  slotCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A5F',
  },
  slotCardConflict: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.55,
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  slotTimeConflict: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  slotTimeSelected: {
    color: '#1E3A5F',
    fontWeight: '700',
  },
  slotRight: {
    alignItems: 'center',
  },
  conflictBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conflictBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  selectedBadge: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  animatedButtonWrapper: {
    width: '100%',
  },
  bookButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bookButtonTextDisabled: {
    color: '#64748B',
  },
  pressed: {
    opacity: 0.8,
  },
});
