import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Room, TimeSlot } from '../types/room';

interface BookingModalProps {
  visible: boolean;
  room: Room | null;
  onClose: () => void;
  onConfirmBooking: (roomId: string, slotId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  room,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  if (!room) {
    return null;
  }

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isBooked) {
      // Cơ chế Conflict Prevention: Không cho phép chọn slot đã có lịch trùng
      return;
    }
    setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
  };

  const handleConfirm = () => {
    if (selectedSlotId) {
      onConfirmBooking(room.id, selectedSlotId);
      setSelectedSlotId(null);
    }
  };

  const handleClose = () => {
    setSelectedSlotId(null);
    onClose();
  };

  const timeSlots = room.timeSlots || [];
  const selectedSlot = timeSlots.find((s) => s.id === selectedSlotId);
  const availableSlotsCount = timeSlots.filter((s) => !s.isBooked).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialogContainer}>
          {/* Header hình ảnh */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: room.imageUrl }}
              style={styles.roomImage}
              resizeMode="cover"
            />
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeCircleButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.closeIconText}>✕</Text>
            </Pressable>
            <View style={styles.badgeOverlay}>
              <Text style={styles.badgeOverlayText}>
                {room.status === 'Còn trống' ? '🟢 Còn chỗ' : '🔴 Đã kín'}
              </Text>
            </View>
          </View>

          {/* Nội dung thông tin & Bộ chọn ca học */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.roomName}>{room.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.buildingText}>📍 {room.building}</Text>
              <Text style={styles.capacityText}>
                👥 {room.capacity} chỗ ngồi
              </Text>
            </View>

            <View style={styles.slotHeaderRow}>
              <Text style={styles.sectionTitle}>Chọn ca học trong ngày</Text>
              <Text style={styles.availableBadge}>
                {availableSlotsCount}/{timeSlots.length} ca trống
              </Text>
            </View>
            <Text style={styles.sectionNotice}>
              * Hệ thống tự động khóa các ca đã có người đặt để ngăn trùng lặp lịch.
            </Text>

            {/* Danh sách Time Slots */}
            <View style={styles.slotsList}>
              {timeSlots.map((slot, index) => {
                const isSelected = selectedSlotId === slot.id;
                const isConflict = slot.isBooked;

                return (
                  <Pressable
                    key={slot.id}
                    onPress={() => handleSelectSlot(slot)}
                    disabled={isConflict}
                    hitSlop={4}
                    style={({ pressed }) => [
                      styles.slotItem,
                      isConflict && styles.slotItemConflict,
                      isSelected && styles.slotItemSelected,
                      !isConflict && !isSelected && styles.slotItemAvailable,
                      pressed && !isConflict && styles.slotItemPressed,
                    ]}
                  >
                    <View style={styles.slotLeftCol}>
                      <View
                        style={[
                          styles.slotIndexBadge,
                          isConflict && styles.slotIndexConflict,
                          isSelected && styles.slotIndexSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.slotIndexText,
                            isSelected && styles.slotIndexTextSelected,
                          ]}
                        >
                          Ca {index + 1}
                        </Text>
                      </View>
                      <View style={styles.slotTimeCol}>
                        <Text
                          style={[
                            styles.slotTimeText,
                            isConflict && styles.slotTimeTextConflict,
                            isSelected && styles.slotTimeTextSelected,
                          ]}
                        >
                          ⏰ {slot.timeRange}
                        </Text>
                        {isConflict && slot.bookedBy && (
                          <Text style={styles.bookedByText} numberOfLines={1}>
                            {slot.bookedBy}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.slotRightCol}>
                      {isConflict ? (
                        <View style={styles.statusConflictTag}>
                          <Text style={styles.statusConflictText}>
                            🔒 Trùng lịch
                          </Text>
                        </View>
                      ) : isSelected ? (
                        <View style={styles.statusSelectedTag}>
                          <Text style={styles.statusSelectedText}>
                            ✓ Đã chọn
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.statusAvailableTag}>
                          <Text style={styles.statusAvailableText}>
                            Sẵn sàng
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Khung tóm tắt ca chọn */}
            {selectedSlot ? (
              <View style={styles.selectedSummaryCard}>
                <Text style={styles.summaryLabel}>Đang chuẩn bị đặt:</Text>
                <Text style={styles.summaryValue}>
                  {room.name} • {selectedSlot.timeRange}
                </Text>
              </View>
            ) : (
              <View style={styles.unselectedHintCard}>
                <Text style={styles.unselectedHintText}>
                  👉 Vui lòng chạm vào một ca còn trống ở trên để tiến hành đặt chỗ.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer nút bấm */}
          <View style={styles.footerContainer}>
            <Pressable
              onPress={handleConfirm}
              disabled={!selectedSlotId}
              hitSlop={6}
              style={({ pressed }) => [
                styles.confirmButton,
                !selectedSlotId && styles.confirmButtonDisabled,
                pressed && selectedSlotId && styles.buttonPressed,
              ]}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  !selectedSlotId && styles.confirmButtonTextDisabled,
                ]}
              >
                {selectedSlotId
                  ? 'Xác nhận đặt phòng'
                  : 'Chọn ca học để tiếp tục'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClose}
              hitSlop={6}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Đóng lại</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  dialogContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  closeCircleButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeOverlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: 18,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  buildingText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  capacityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  availableBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionNotice: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 12,
  },
  slotsList: {
    flexDirection: 'column',
    marginBottom: 14,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  slotItemAvailable: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  slotItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A5F',
  },
  slotItemConflict: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  slotItemPressed: {
    opacity: 0.8,
  },
  slotLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotIndexBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  slotIndexConflict: {
    backgroundColor: '#F1F5F9',
  },
  slotIndexSelected: {
    backgroundColor: '#1E3A5F',
  },
  slotIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  slotIndexTextSelected: {
    color: '#FFFFFF',
  },
  slotTimeCol: {
    flexDirection: 'column',
    flex: 1,
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  slotTimeTextConflict: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  slotTimeTextSelected: {
    color: '#1E3A5F',
    fontWeight: '700',
  },
  bookedByText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
  },
  slotRightCol: {
    marginLeft: 8,
  },
  statusAvailableTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusAvailableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  statusConflictTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusConflictText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  statusSelectedTag: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusSelectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectedSummaryCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  unselectedHintCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unselectedHintText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmButtonTextDisabled: {
    color: '#64748B',
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
