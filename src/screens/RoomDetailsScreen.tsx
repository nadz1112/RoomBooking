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

export const RoomDetailsScreen: React.FC<RootStackScreenProps<'RoomDetails'>> = ({
  route,
  navigation,
}) => {
  const { roomId, roomName } = route.params;

  // Fetch dữ liệu phòng
  const { data: room } = useRoomById(roomId);

  // Zustand Store selectors
  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);

  // State chọn khung giờ
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Thuật toán Conflict Prevention: Kiểm tra các slot đã có đơn 'confirmed' cho phòng này
  const bookedSlotsSet = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.roomId === roomId && b.status === 'confirmed') {
        set.add(b.timeSlot);
      }
    });
    return set;
  }, [bookings, roomId]);

  // Reanimated Animation cho nút bấm "Book This Room"
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

  const handleBookRoom = () => {
    if (!selectedSlot) return;

    const newBooking: Booking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      roomId: roomId,
      roomName: room?.name || roomName,
      building: room?.building || 'Campus VKU',
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
              {room?.status === 'Available' ? '🟢 Sẵn sàng' : '🔴 Đang bận'}
            </Text>
          </View>
        </View>

        {/* Thông tin phòng */}
        <View style={styles.infoCard}>
          <Text style={styles.roomName}>{room?.name || roomName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.buildingText}>🏢 {room?.building}</Text>
            <Text style={styles.capacityText}>👥 {room?.capacity} seats</Text>
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

          {/* Bộ chọn khung giờ (Time-slot Selector) */}
          <View style={styles.slotsSection}>
            <View style={styles.slotsHeaderRow}>
              <Text style={styles.sectionHeader}>Chọn Khung Giờ Học</Text>
              <Text style={styles.conflictNotice}>
                * Khung giờ đã đặt sẽ bị khóa
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

      {/* Footer chứa nút bấm hoạt họa Reanimated "Book This Room" */}
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
              {selectedSlot ? `Book This Room (${selectedSlot})` : 'Select a Time Slot'}
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
