import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onPress }) => {
  const isAvailable = room.status === 'Còn trống';
  const availableSlots = room.timeSlots.filter((s) => !s.isBooked).length;
  const totalSlots = room.timeSlots.length;

  const handlePress = () => {
    onPress(room);
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.slotBadge}>
          <Text style={styles.slotBadgeText}>
            ⏰ {availableSlots}/{totalSlots} ca trống
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <View
            style={[
              styles.badge,
              isAvailable ? styles.badgeAvailable : styles.badgeOccupied,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isAvailable ? styles.badgeTextAvailable : styles.badgeTextOccupied,
              ]}
            >
              {room.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.buildingText} numberOfLines={1}>
            📍 {room.building}
          </Text>
          <Text style={styles.capacityText}>
            👥 {room.capacity} chỗ ngồi
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: 160,
  },
  slotBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slotBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 14,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAvailable: {
    backgroundColor: '#E8F5E9',
  },
  badgeOccupied: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextAvailable: {
    color: '#2E7D32',
  },
  badgeTextOccupied: {
    color: '#C62828',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  buildingText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    marginRight: 8,
  },
  capacityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
  },
});
