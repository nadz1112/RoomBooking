# BÁO CÁO KỸ THUẬT: ỨNG DỤNG ĐẶT PHÒNG HỌC & LAB (ROOMBOOKING)
**Học phần:** Lập trình Đa nền tảng (Cross-Platform Mobile Development)  
**Trường:** Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)  
**Đồ án:** Mini-Project 2 (Full Implementation)  
**Sinh viên thực hiện:** Lê Xuân Hoài Nam - MSSV: 23IT175  

---

## 1. GIỚI THIỆU & KIẾN TRÚC HỆ THỐNG (15% Navigation & Architecture)

### 1.1. Triết lý Phát triển & New Architecture 2026
Ứng dụng **RoomBooking** được xây dựng trên nền tảng **React Native & Expo (Managed Workflow)** tuân thủ triết lý *"Learn Once, Write Anywhere"*. Mã nguồn sử dụng mô hình tư duy của React (Component tree, Hooks, JSX, State) để biên dịch sang các widget native thực thụ (`UIView`/`ViewGroup`, `UILabel`/`TextView`, `UIImageView`/`ImageView`, `UICollectionView`/`RecyclerView`).
* **Kiến trúc mới (New Architecture):** Ứng dụng kích hoạt toàn diện kiến trúc mới với **Hermes Engine**, **JSI (JavaScript Interface)**, **Fabric Renderer** và **TurboModules**. Điều này loại bỏ hoàn toàn cơ chế tuần tự hóa JSON qua cầu nối (Bridge) cũ, cho phép mã JavaScript gọi trực tiếp các phương thức C++/Native với chi phí gần như bằng 0, đảm bảo khung hình ổn định 60/120fps.
* **Xử lý Vùng an toàn (Safe Area):** Toàn bộ giao diện được bảo vệ thông qua thư viện `react-native-safe-area-context` với `<SafeAreaProvider>` bao bọc ở cấp Root (`App.tsx`) và `<SafeAreaView>` với thuộc tính `edges={['top', 'left', 'right']}` ở các màn hình, ngăn chặn triệt để hiện tượng tràn nội dung vào tai thỏ, nốt ruồi và Dynamic Island.

### 1.2. Mô hình Điều hướng Lồng ghép Định kiểu (Nesting Navigators Type-Safe)
Hệ thống điều hướng sử dụng **React Navigation 7** kết hợp định kiểu phân cấp chặt chẽ:
```
NavigationContainer
└── Stack.Navigator (RootStack)
    ├── Screen "MainTabs" (Tab.Navigator) -> Bottom Tabs
    │   ├── Tab "BrowseRooms"  -> BrowseRoomsScreen (Icon: search / search-outline)
    │   ├── Tab "MyBookings"   -> MyBookingsScreen (Icon: calendar / calendar-outline)
    │   └── Tab "Profile"      -> ProfileScreen (Icon: person / person-outline)
    ├── Screen "RoomDetails"         -> RoomDetailsScreen (Push transition, tự động ẩn Bottom Tabs)
    └── Screen "BookingConfirmation" -> BookingConfirmationScreen (Presentation: 'modal', trượt từ đáy)
```
* **Định kiểu Type-Safe:** Khai báo kiểu `RootStackParamList` và `TabParamList` tại `src/navigation/types.ts` với `NavigatorScreenParams<TabParamList>`, ngăn chặn lỗi sai route name hoặc truyền thiếu tham số thời gian chạy.

---

## 2. CHIẾN LƯỢC QUẢN LÝ STATE (15% State Management)

Dự án áp dụng mô hình phân tách trạng thái hiện đại, tách bạch rõ ràng giữa **Client State** và **Server State**:

### 2.1. Client State: Zustand Store kết hợp AsyncStorage Persistence
* **Lý do lựa chọn:** Zustand có kích thước siêu nhẹ, API tối giản, không cần bọc Provider lồng nhau và hỗ trợ **Selector Pattern** (`useBookingStore(s => s.bookings)`) giúp hạn chế tối đa các lần re-render không cần thiết.
* **Lưu trữ Bền vững:** Sử dụng middleware `persist` kết hợp `createJSONStorage(() => AsyncStorage)` với storage key `'vku-booking-storage'`. Toàn bộ dữ liệu đơn đặt phòng (`Booking[]`) được lưu trữ tức thì vào bộ nhớ flash của thiết bị, đảm bảo không bị mất đi khi người dùng tắt hoặc khởi động lại ứng dụng.
* **Các Actions:** `addBooking` (thêm đơn đặt phòng mới), `cancelBooking` (cập nhật trạng thái đơn thành `'cancelled'`), `removeBooking` (xóa hoàn toàn).

### 2.2. Server State: TanStack React Query (Caching & Refetching)
* **Lý do lựa chọn:** Quản lý dữ liệu bất đồng bộ từ máy chủ (caching, background refetching, deduplication, retry).
* **Cấu hình QueryClient:** `staleTime: 5 * 60 * 1000` (dữ liệu giữ mới 5 phút), `gcTime: 10 * 60 * 1000` (bộ nhớ rác dọn dẹp sau 10 phút), `retry: 2`.
* **Custom Hook `useRooms(building?: string)`:** Khóa truy vấn `['rooms', { building }]`. Giả lập độ trễ 400ms để kiểm thử spinner nạp dữ liệu và tích hợp kéo xuống để làm mới (`refreshing={isLoading}`, `onRefresh={refetch}`).

---

## 3. TÍNH NĂNG CỐT LÕI & GIẢI THUẬT CHỐNG TRÙNG LẶP (30% Core Features)

### 3.1. Tìm Kiếm & Bộ Lọc Đa Tiêu Chí
* **Tìm kiếm tức thì:** Tìm kiếm theo tên phòng và tòa nhà, tự động cập nhật danh sách ngay khi người dùng nhập từ khóa.
* **Dải thẻ lọc danh mục (Filter Chips):** Cho phép lọc theo các tòa nhà chính (`Building A3`, `Main Library`, `Building V`, `Building K`, `Innovation Hub`, `Administrative Center`).

### 3.2. Giải Thuật Ngăn Chặn Đặt Trùng Lặp (Conflict Prevention)
Để đảm bảo tính toàn vẹn dữ liệu trong môi trường đặt phòng thời gian thực:
1. Khi người dùng mở `RoomDetailsScreen`, component trích xuất danh sách tất cả các đơn đặt phòng từ `useBookingStore`.
2. Hệ thống duyệt qua mảng `bookings`, lọc các đơn thuộc phòng hiện tại (`b.roomId === roomId`) có trạng thái `status === 'confirmed'` và lưu vào một `Set<string>` chứa các khung giờ bận (`bookedSlotsSet`).
3. Khi render các khung giờ mẫu (`08:00 - 10:00`, `10:00 - 12:00`, `13:00 - 15:00`, `15:00 - 17:00`):
   * Nếu slot nằm trong `bookedSlotsSet`, component lập tức thiết lập thuộc tính `disabled={true}`, giảm độ trong suốt `opacity: 0.55`, gạch ngang thời gian và hiển thị nhãn `🔒 Đã đặt`. Người dùng không thể chạm hoặc chọn khung giờ này.
   * Nếu slot còn trống, người dùng có thể chọn; nút "Book This Room" tự động kích hoạt hiển thị khung giờ đang chọn.
4. Khi đặt thành công, đơn đặt phòng được thêm vào Zustand store, ngay lập tức khóa khung giờ đó trên toàn bộ ứng dụng.

---

## 4. GIAO DIỆN, HIỆU ỨNG ĐỘNG & CỬ CHỈ (25% UI/UX & Animations)

### 4.1. Tối Ưu Hóa FlatList 60fps
* Danh sách phòng học được cấu hình với các tham số hiệu năng tối đa:
  * `initialNumToRender={10}`: Chỉ render đủ số phần tử trong màn hình đầu tiên.
  * `maxToRenderPerBatch={5}`: Giới hạn số phần tử render thêm mỗi đợt khi cuộn.
  * `windowSize={5}`: Giảm diện tích bộ đệm ngoài màn hình để tiết kiệm RAM.
  * `keyExtractor={(item) => item.id}`: Xác định duy nhất phần tử để tái sử dụng widget.
  * Ảnh phòng học bắt buộc thiết lập cố định kích thước (`width: '100%'`, `height: 160`, `resizeMode="cover"`) nhằm loại bỏ hoàn toàn hiện tượng giật bố cục (layout shift).

### 4.2. Hiệu Ứng Xuất Hiện với Reanimated 3
Mỗi thẻ `RoomCard` được bọc bởi `<Animated.View>` của **React Native Reanimated 3**, thực thi hoàn toàn trên UI Thread thông qua Worklets:
```typescript
entering={FadeInDown.delay(index * 80).springify()}
exiting={FadeOutUp.duration(200)}
layout={LinearTransition.springify()}
```
Hiệu ứng tạo cảm giác chuyển động so le (staggered animation) mượt mà, tự nhiên khi tải trang hoặc khi chuyển đổi bộ lọc.

### 4.3. Hiệu Ứng Nút Bấm Co Giãn (Spring Micro-interaction)
Nút "Book This Room" sử dụng `useSharedValue(1)` và `useAnimatedStyle()`:
* Sự kiện `onPressIn`: Co nút về tỉ lệ `0.95` (`withSpring(0.95)`).
* Sự kiện `onPressOut`: Bung nút về tỉ lệ ban đầu `1.0` (`withSpring(1)`).
Mang lại phản hồi xúc giác và thị giác trực quan cho người dùng.

### 4.4. Cử Chỉ Vuốt Để Hủy (Swipe-to-Cancel Gesture)
Tại màn hình `MyBookingsScreen`, mỗi thẻ đặt phòng được tích hợp **React Native Gesture Handler v2**:
* Sử dụng `Gesture.Pan()` cấu hình `.activeOffsetX([-10, 10])`.
* Khi vuốt sang trái, thuộc tính `translateX.value = Math.min(0, e.translationX)` làm lộ lớp nền đỏ cảnh báo bên dưới.
* Ngưỡng kích hoạt: Khi kéo vượt quá `-120px` (`e.translationX < -120`), hàm `runOnJS(cancelBooking)(booking.id)` được gọi an toàn để cập nhật trạng thái đơn đặt sang `'cancelled'`.
* Khi thả tay, thẻ tự động đàn hồi về vị trí gốc qua `withSpring(0)`.

---

## 5. CHẤT LƯỢNG MÃ NGUỒN & BẢNG TỰ ĐÁNH GIÁ (15% Code Quality)

### 5.1. Tuân Thủ Quy Chuẩn Lập Trình
* **TypeScript Strict Mode:** 100% mã nguồn không sử dụng `any`, không có lỗi ép kiểu (`tsc --noEmit` pass 0 lỗi).
* **Quy chuẩn Styling:** 100% sử dụng `StyleSheet.create()`, tuyệt đối không dùng inline style objects.
* **Component Nguyên bản:** Sử dụng `View`, `Text`, `Image`, `Pressable`, `FlatList` native, không dùng bất kỳ thẻ HTML nào.

### 5.2. Bảng Tự Đánh Giá Theo Barem Điểm (Thang điểm 100%)

| Tiêu chí | Trọng số | Tự đánh giá | Minh chứng & Ghi chú |
| :--- | :---: | :---: | :--- |
| **Navigation & Architecture** | 15% | **15/15** | Stack lồng Bottom Tabs hoàn chỉnh, New Architecture Hermes/Fabric, Safe Area Context. |
| **State Management** | 15% | **15/15** | Tách biệt Zustand + AsyncStorage (Client) và TanStack Query (Server Caching). |
| **Core Features & Conflict Prevention** | 30% | **30/30** | Tìm kiếm, lọc tòa nhà, 22 phòng học, giải thuật khóa slot trùng lặp tuyệt đối. |
| **UI/UX, Animations & Gestures** | 25% | **25/25** | FlatList 60fps, Reanimated FadeInDown, nút co giãn Spring, Pan Gesture vuốt hủy phòng. |
| **Code Quality & Deliverables** | 15% | **15/15** | TypeScript Strict 0 lỗi, expo-doctor 21/21 passed, README đầy đủ kịch bản demo video. |
| **TỔNG ĐIỂM** | **100%** | **100/100** | **Xuất sắc - Đạt đầy đủ mọi yêu cầu của Mini-Project 2** |
