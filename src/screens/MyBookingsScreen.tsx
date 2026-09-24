import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';

interface SwipeableBookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

const SwipeableBookingCard: React.FC<SwipeableBookingCardProps> = ({
  booking,
  onCancel,
}) => {
  const translateX = useSharedValue(0);
  const isCancelled = booking.status === 'cancelled';

  // Pan Gesture với GestureDetector của react-native-gesture-handler v2
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (isCancelled) return;
      // Chỉ cho phép kéo sang trái (giá trị <= 0)
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (isCancelled) return;
      // Ngưỡng kích hoạt hủy: khi vuốt sang trái vượt quá -120px
      if (e.translationX < -120) {
        runOnJS(onCancel)(booking.id);
      }
      // Tự động đàn hồi về vị trí ban đầu
      translateX.value = withSpring(0);
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.cardContainer}>
      {/* Lớp nền màu đỏ lộ ra khi vuốt sang trái */}
      <View style={styles.hiddenCancelBackground}>
        <Text style={styles.hiddenCancelText}>🗑️ Vuốt để hủy</Text>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardForeground, animatedCardStyle]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.bookingIdText}>ID: {booking.id}</Text>
              <Text style={styles.roomNameText} numberOfLines={1}>
                {booking.roomName}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isCancelled ? styles.statusCancelled : styles.statusConfirmed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isCancelled
                    ? styles.statusTextCancelled
                    : styles.statusTextConfirmed,
                ]}
              >
                {isCancelled ? 'Đã hủy' : 'Confirmed'}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.infoText}>🏢 {booking.building}</Text>
            <Text style={styles.timeSlotText}>⏰ {booking.timeSlot}</Text>
            <Text style={styles.createdDateText}>
              Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
            </Text>
          </View>

          {!isCancelled && (
            <View style={styles.cardFooter}>
              <Text style={styles.swipeHintText}>👈 Vuốt sang trái để hủy phòng</Text>
              <Pressable
                onPress={() => onCancel(booking.id)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.cancelBtnText,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelBtnLabel}>Hủy</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export const MyBookingsScreen: React.FC<TabScreenProps<'MyBookings'>> = ({
  navigation,
}) => {
  // Selector Pattern từ Zustand
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const handleCancel = (id: string) => {
    cancelBooking(id);
  };

  const handleBrowseRooms = () => {
    navigation.navigate('BrowseRooms');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>Chưa có lịch đặt phòng nào</Text>
      <Text style={styles.emptySubtitle}>
        Bạn chưa đăng ký sử dụng phòng học hoặc phòng lab nào trong học kỳ này.
      </Text>
      <Pressable
        onPress={handleBrowseRooms}
        hitSlop={8}
        style={({ pressed }) => [
          styles.browseButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.browseButtonText}>Duyệt Phòng Ngay</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>QUẢN LÝ LỊCH HỌC</Text>
        <Text style={styles.headerTitle}>Lịch Đặt Của Tôi</Text>
        <Text style={styles.headerCount}>{bookings.length} đơn đặt</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableBookingCard booking={item} onCancel={handleCancel} />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerCount: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hiddenCancelBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
  },
  hiddenCancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardForeground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleColumn: {
    flex: 1,
    marginRight: 8,
  },
  bookingIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 2,
  },
  roomNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextConfirmed: {
    color: '#16A34A',
  },
  statusTextCancelled: {
    color: '#DC2626',
  },
  cardBody: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  createdDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  swipeHintText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  cancelBtnText: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cancelBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
