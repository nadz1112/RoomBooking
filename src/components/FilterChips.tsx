import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type StatusFilter = 'Tất cả' | 'Còn trống' | 'Đang bận';
export type BuildingFilter =
  | 'Tất cả tòa'
  | 'Tòa nhà A3'
  | 'Tòa nhà K'
  | 'Tòa nhà V'
  | 'Thư Viện'
  | 'Trung Tâm ĐMST'
  | 'Khu Hành Chính';

interface FilterChipsProps {
  statusFilter: StatusFilter;
  onSelectStatus: (status: StatusFilter) => void;
  buildingFilter: BuildingFilter;
  onSelectBuilding: (building: BuildingFilter) => void;
  resultCount: number;
}

const STATUS_OPTIONS: StatusFilter[] = ['Tất cả', 'Còn trống', 'Đang bận'];
const BUILDING_OPTIONS: BuildingFilter[] = [
  'Tất cả tòa',
  'Tòa nhà A3',
  'Tòa nhà K',
  'Tòa nhà V',
  'Thư Viện',
  'Trung Tâm ĐMST',
  'Khu Hành Chính',
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  statusFilter,
  onSelectStatus,
  buildingFilter,
  onSelectBuilding,
  resultCount,
}) => {
  return (
    <View style={styles.container}>
      {/* Row 1: Lọc theo Trạng thái */}
      <View style={styles.labelRow}>
        <Text style={styles.groupLabel}>Trạng thái phòng</Text>
        <Text style={styles.resultBadgeText}>{resultCount} phòng</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STATUS_OPTIONS.map((status) => {
          const isSelected = statusFilter === status;
          return (
            <Pressable
              key={status}
              onPress={() => onSelectStatus(status)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected
                    ? styles.chipTextSelected
                    : styles.chipTextUnselected,
                ]}
              >
                {status === 'Còn trống' && '🟢 '}
                {status === 'Đang bận' && '🔴 '}
                {status}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Row 2: Lọc theo Tòa nhà / Khu vực */}
      <View style={styles.labelRow}>
        <Text style={styles.groupLabel}>Khu vực & Tòa nhà</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BUILDING_OPTIONS.map((building) => {
          const isSelected = buildingFilter === building;
          return (
            <Pressable
              key={building}
              onPress={() => onSelectBuilding(building)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected
                    ? styles.chipTextSelected
                    : styles.chipTextUnselected,
                ]}
              >
                {building}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 6,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A5F',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  chipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#475569',
  },
});
