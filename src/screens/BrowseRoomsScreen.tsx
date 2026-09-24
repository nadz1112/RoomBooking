import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoomCard } from '../components/RoomCard';
import { TabScreenProps } from '../navigation/types';
import { useRooms } from '../services/queryClient';
import { Room } from '../types';

const BUILDING_FILTERS = [
  'Tất cả',
  'Building A3',
  'Main Library',
  'Building V',
  'Building K',
  'Innovation Hub',
  'Administrative Center',
];

export const BrowseRoomsScreen: React.FC<TabScreenProps<'BrowseRooms'>> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('Tất cả');

  // TanStack Query fetching
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useRooms(selectedBuilding === 'Tất cả' ? undefined : selectedBuilding);

  // Lọc thêm theo từ khóa tìm kiếm
  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) {
      return rooms;
    }
    const query = searchQuery.toLowerCase().trim();
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.building.toLowerCase().includes(query)
    );
  }, [rooms, searchQuery]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      // Điều hướng đến RootStack Screen RoomDetails
      navigation.getParent()?.navigate('RoomDetails', {
        roomId: room.id,
        roomName: room.name,
      });
    },
    [navigation]
  );

  const renderItem: ListRenderItem<Room> = useCallback(
    ({ item, index }) => {
      return (
        <RoomCard room={item} index={index} onPress={handleRoomPress} />
      );
    },
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandSubtitle}>CAMPUS ROOM RESERVATION</Text>
        <Text style={styles.brandTitle}>Room Booking</Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search rooms..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
            hitSlop={8}
            style={styles.clearSearchBtn}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Dải nút lọc danh mục (Filter Chips) */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Khu vực / Tòa nhà</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {BUILDING_FILTERS.map((building) => {
            const isSelected = selectedBuilding === building;
            return (
              <Pressable
                key={building}
                onPress={() => setSelectedBuilding(building)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected
                    ? styles.filterChipSelected
                    : styles.filterChipUnselected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected
                      ? styles.filterChipTextSelected
                      : styles.filterChipTextUnselected,
                  ]}
                >
                  {building}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Tiêu đề danh sách & số lượng */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Available Rooms & Labs</Text>
        <Text style={styles.sectionCountBadge}>
          {filteredRooms.length} rooms
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>Đang tải dữ liệu phòng...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorBanner}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Lỗi nạp dữ liệu</Text>
          <Text style={styles.errorMessage}>
            {(error as Error)?.message || 'Không thể kết nối đến máy chủ.'}
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
        <Text style={styles.emptySubtitle}>
          Hãy thử đổi từ khóa tìm kiếm hoặc chọn tòa nhà khác.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  headerWrapper: {
    backgroundColor: '#F8FAFC',
    paddingTop: 8,
    paddingBottom: 12,
  },
  brandContainer: {
    backgroundColor: '#1E3A5F',
    marginHorizontal: -16,
    marginTop: -8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  filterScroll: {
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  filterChipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  filterChipTextUnselected: {
    color: '#475569',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A5F',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  separator: {
    height: 14,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  errorIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
