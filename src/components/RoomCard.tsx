import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  index: number;
  onPress: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, index, onPress }) => {
  const isAvailable = room.status === 'Available';

  const handlePress = () => {
    onPress(room);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      exiting={FadeOutUp.duration(200)}
      layout={LinearTransition.springify()}
      style={styles.animatedWrapper}
    >
      <Pressable
        onPress={handlePress}
        hitSlop={8}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

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
                {isAvailable ? 'Available' : 'Occupied'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.buildingText} numberOfLines={1}>
              🏢 {room.building}
            </Text>
            <Text style={styles.capacityText}>
              👥 {room.capacity} seats
            </Text>
          </View>

          {room.facilities && room.facilities.length > 0 && (
            <View style={styles.facilitiesRow}>
              {room.facilities.slice(0, 3).map((facility, fIndex) => (
                <View key={fIndex} style={styles.facilityTag}>
                  <Text style={styles.facilityText} numberOfLines={1}>
                    {facility}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0',
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
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAvailable: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  badgeOccupied: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: '#10B981',
  },
  badgeTextOccupied: {
    color: '#EF4444',
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
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  facilityTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  facilityText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
});
