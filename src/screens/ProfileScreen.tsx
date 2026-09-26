import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationModal } from '../components/NotificationModal';
import { TabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { UserProfile } from '../types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

export const ProfileScreen: React.FC<TabScreenProps<'Profile'>> = () => {
  const bookings = useBookingStore((state) => state.bookings);
  const userProfile = useBookingStore((state) => state.userProfile);
  const updateUserProfile = useBookingStore((state) => state.updateUserProfile);

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  // State cho Modal chỉnh sửa hồ sơ
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOpenEdit = () => {
    setFormData(userProfile);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    updateUserProfile(formData);
    setIsEditModalVisible(false);
    setShowSuccessModal(true);
  };

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
          <Pressable onPress={handleOpenEdit} style={styles.avatarTouchable}>
            <Image
              source={{ uri: userProfile.avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditIcon}>📷</Text>
            </View>
          </Pressable>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userRole}>{userProfile.role}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.studentIdBadge}>
                <Text style={styles.studentIdText}>MSSV: {userProfile.studentId}</Text>
              </View>
              <View style={styles.classBadge}>
                <Text style={styles.classBadgeText}>{userProfile.cohort}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Nút bấm mở Chỉnh sửa hồ sơ */}
        <Pressable
          onPress={handleOpenEdit}
          style={({ pressed }) => [
            styles.editProfileBtn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.editProfileBtnIcon}>✏️</Text>
          <Text style={styles.editProfileBtnText}>Chỉnh sửa hồ sơ & ảnh đại diện</Text>
        </Pressable>

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

        {/* Thông tin chi tiết sinh viên */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ & Đào tạo</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>Khoa / Viện:</Text>
            <Text style={styles.infoRowValue}>{userProfile.department}</Text>
          </View>
          <View style={styles.itemDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>Số điện thoại:</Text>
            <Text style={styles.infoRowValue}>{userProfile.phone}</Text>
          </View>
          <View style={styles.itemDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>Niên khóa:</Text>
            <Text style={styles.infoRowValue}>{userProfile.cohort}</Text>
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

      {/* Modal Chỉnh Sửa Hồ Sơ & Ảnh Đại Diện */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập Nhật Thông Tin Hồ Sơ</Text>
              <Pressable
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBodyContent}
            >
              {/* Chọn ảnh đại diện từ bộ sưu tập avatar */}
              <Text style={styles.inputGroupLabel}>Chọn ảnh đại diện sinh viên</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.avatarPickerRow}
              >
                {PRESET_AVATARS.map((url, idx) => {
                  const isSelected = formData.avatarUrl === url;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setFormData({ ...formData, avatarUrl: url })}
                      style={[
                        styles.avatarChoiceWrapper,
                        isSelected && styles.avatarChoiceSelected,
                      ]}
                    >
                      <Image source={{ uri: url }} style={styles.avatarChoiceImg} />
                      {isSelected && (
                        <View style={styles.avatarCheckBadge}>
                          <Text style={styles.avatarCheckText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Link ảnh tùy biến */}
              <Text style={styles.inputLabel}>Hoặc dán URL ảnh trực tuyến:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.avatarUrl}
                onChangeText={(text) => setFormData({ ...formData, avatarUrl: text })}
                placeholder="https://..."
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />

              {/* Họ và tên */}
              <Text style={styles.inputLabel}>Họ và tên:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nhập họ và tên..."
                placeholderTextColor="#94A3B8"
              />

              {/* Mã sinh viên */}
              <Text style={styles.inputLabel}>Mã số sinh viên (MSSV):</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.studentId}
                onChangeText={(text) => setFormData({ ...formData, studentId: text })}
                placeholder="Ví dụ: 23IT175"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />

              {/* Email sinh viên */}
              <Text style={styles.inputLabel}>Email sinh viên:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="email@vku.udn.vn"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Chức danh / Vai trò */}
              <Text style={styles.inputLabel}>Vai trò / Khóa sinh viên:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.role}
                onChangeText={(text) => setFormData({ ...formData, role: text })}
                placeholder="Sinh viên Khoa Kỹ Thuật Máy Tính"
                placeholderTextColor="#94A3B8"
              />

              {/* Khoa / Viện */}
              <Text style={styles.inputLabel}>Khoa / Viện đào tạo:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.department}
                onChangeText={(text) => setFormData({ ...formData, department: text })}
                placeholder="Khoa Kỹ Thuật Máy Tính & Điện Tử"
                placeholderTextColor="#94A3B8"
              />

              {/* Số điện thoại */}
              <Text style={styles.inputLabel}>Số điện thoại liên hệ:</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="09xx xxx xxx"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </ScrollView>

            {/* Footer Modal */}
            <View style={styles.modalFooter}>
              <Pressable
                onPress={handleSaveProfile}
                style={({ pressed }) => [
                  styles.saveBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.saveBtnText}>Lưu Thay Đổi</Text>
              </Pressable>

              <Pressable
                onPress={() => setIsEditModalVisible(false)}
                style={({ pressed }) => [
                  styles.cancelModalBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelModalBtnText}>Hủy Bỏ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Thông Báo Thành Công */}
      <NotificationModal
        visible={showSuccessModal}
        type="success"
        title="Cập Nhật Thành Công!"
        message="Hồ sơ cá nhân và ảnh đại diện đã được lưu trữ bền vững trên thiết bị."
        onClose={() => setShowSuccessModal(false)}
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
    marginBottom: 12,
  },
  avatarTouchable: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#1E3A5F',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarEditIcon: {
    fontSize: 12,
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
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  editProfileBtnIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A5F',
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoRowLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoRowValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  modalBody: {
    flexGrow: 0,
    maxHeight: 460,
  },
  modalBodyContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  inputGroupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarChoiceWrapper: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#E2E8F0',
    padding: 2,
  },
  avatarChoiceSelected: {
    borderColor: '#0284C7',
  },
  avatarChoiceImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0284C7',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarCheckText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 5,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 4,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelModalBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
