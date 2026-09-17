import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  totalRooms: number;
  availableRooms: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalRooms,
  availableRooms,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.brandSubtitle}>HỆ THỐNG GIẢNG ĐƯỜNG</Text>
          <Text style={styles.brandTitle}>Room Booking</Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Trực tuyến</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalRooms}</Text>
          <Text style={styles.statLabel}>Tổng số phòng</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValueAvailable}>{availableRooms}</Text>
          <Text style={styles.statLabel}>Còn trống</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValueOccupied}>
            {totalRooms - availableRooms}
          </Text>
          <Text style={styles.statLabel}>Đang bận</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleColumn: {
    flexDirection: 'column',
  },
  brandSubtitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: '#93C5FD',
    fontWeight: '700',
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#E0F2FE',
    fontSize: 11,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statValueAvailable: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4ADE80',
  },
  statValueOccupied: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F87171',
  },
  statLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
