import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';

export const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const bookings = useBookingStore((state) => state.bookings);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>TÀI KHOẢN SINH VIÊN</Text>
        <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thẻ User Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Lê Hoàng Nam</Text>
            <Text style={styles.userRole}>Sinh viên Khoa Kỹ Thuật Máy Tính</Text>
            <Text style={styles.userEmail}>namlh.22it@vku.udn.vn</Text>
            <View style={styles.badgeRow}>
              <View style={styles.studentIdBadge}>
                <Text style={styles.studentIdText}>MSSV: 22IT001</Text>
              </View>
              <View style={styles.classBadge}>
                <Text style={styles.classBadgeText}>Khóa 2022 - 2027</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Thống kê đặt phòng */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Tổng đơn đặt</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumberActive}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Đang có hiệu lực</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumberCancelled}>
              {bookings.length - confirmedCount}
            </Text>
            <Text style={styles.statLabel}>Đã hủy</Text>
          </View>
        </View>

        {/* Danh sách cài đặt & Tùy chọn */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tùy chỉnh & Tiện ích</Text>

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Thông báo lịch học</Text>
              <Text style={styles.menuSubtitle}>Bật thông báo trước 30 phút</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>

          <View style={styles.itemDivider} />

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🛡️</Text>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Chính sách đặt phòng</Text>
              <Text style={styles.menuSubtitle}>Quy định sử dụng cơ sở vật chất VKU</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>

          <View style={styles.itemDivider} />

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📱</Text>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Phiên bản ứng dụng</Text>
              <Text style={styles.menuSubtitle}>RoomBooking v1.0.0 (New Architecture)</Text>
            </View>
            <Text style={styles.versionBadge}>Expo 57</Text>
          </View>
        </View>

        {/* Thông tin hỗ trợ */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)
          </Text>
          <Text style={styles.footerSubText}>
            Hệ thống đặt phòng học và thực hành thời gian thực
          </Text>
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E2E8F0',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  studentIdBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  studentIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  classBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 11,
    color: '#475569',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  statNumberActive: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  statNumberCancelled: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
  versionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A5F',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
    textAlign: 'center',
  },
});
