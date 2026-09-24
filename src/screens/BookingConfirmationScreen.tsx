import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';

export const BookingConfirmationScreen: React.FC<
  RootStackScreenProps<'BookingConfirmation'>
> = ({ route, navigation }) => {
  const { bookingId } = route.params;

  // Lấy chi tiết đơn đặt phòng từ Zustand
  const booking = useBookingStore((state) =>
    state.bookings.find((b) => b.id === bookingId)
  );

  const handleBackToBrowse = () => {
    navigation.navigate('MainTabs', { screen: 'BrowseRooms' });
  };

  const handleGoToMyBookings = () => {
    navigation.navigate('MainTabs', { screen: 'MyBookings' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Biểu tượng vé thành công */}
        <View style={styles.successIconWrapper}>
          <Text style={styles.successIcon}>🎉</Text>
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Yêu cầu đặt phòng của bạn đã được xác nhận thành công trên hệ thống.
        </Text>

        {/* Thẻ Booking Pass */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <Text style={styles.passBrand}>VKU ROOM PASS</Text>
            <View style={styles.passStatusTag}>
              <Text style={styles.passStatusText}>CONFIRMED</Text>
            </View>
          </View>

          <View style={styles.passDivider} />

          <View style={styles.passBody}>
            <View style={styles.passRow}>
              <Text style={styles.passLabel}>Mã đặt phòng (ID):</Text>
              <Text style={styles.passValueId}>{bookingId}</Text>
            </View>

            <View style={styles.passRow}>
              <Text style={styles.passLabel}>Phòng học:</Text>
              <Text style={styles.passValue} numberOfLines={1}>
                {booking?.roomName || 'Phòng học / Lab'}
              </Text>
            </View>

            <View style={styles.passRow}>
              <Text style={styles.passLabel}>Tòa nhà:</Text>
              <Text style={styles.passValue}>{booking?.building || 'Campus VKU'}</Text>
            </View>

            <View style={styles.passRow}>
              <Text style={styles.passLabel}>Khung giờ:</Text>
              <Text style={styles.passValueHighlight}>
                ⏰ {booking?.timeSlot || '08:00 - 10:00'}
              </Text>
            </View>

            <View style={styles.passRow}>
              <Text style={styles.passLabel}>Thời gian tạo:</Text>
              <Text style={styles.passValueDate}>
                {booking?.createdAt
                  ? new Date(booking.createdAt).toLocaleString('vi-VN')
                  : new Date().toLocaleString('vi-VN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Nút điều hướng */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={handleGoToMyBookings}
            hitSlop={6}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Xem Danh Sách Đặt Chỗ</Text>
          </Pressable>

          <Pressable
            onPress={handleBackToBrowse}
            hitSlop={6}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Quay Về Trang Chủ</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  successIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  passCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 32,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A5F',
    letterSpacing: 1.5,
  },
  passStatusTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  passDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  passBody: {
    flexDirection: 'column',
  },
  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  passLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  passValueId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  passValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    maxWidth: '65%',
  },
  passValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  passValueDate: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
