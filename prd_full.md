# Product Requirement Document (PRD): VKU Room Booking App (Mini-Project 2 - Full Implementation)

## 1. Project Overview & Philosophy
* **Tên dự án:** VKU Room Booking App (Real-time Study Room & Lab Booking).
* **Mục tiêu:** Xây dựng ứng dụng di động hoàn chỉnh đa nền tảng cho phép tìm kiếm, lọc, xem chi tiết và đặt phòng học/phòng lab thời gian thực tại khuôn viên VKU.
* **Triết lý phát triển:** "Learn Once, Write Anywhere" – sử dụng mô hình tư duy của React (Component tree, Hooks, JSX, State) để biên dịch sang các thành phần native thực thụ (`UIView`/`ViewGroup`, `UILabel`/`TextView`, `UIImageView`/`ImageView`, `UICollectionView`/`RecyclerView`).
* **Thực thi:** Antigravity AI Agent tự động đọc hiểu, thiết lập môi trường, triển khai code và kiểm thử.

---

## 2. Technical Stack & Architecture Constraints
* **Nền tảng:** React Native & Expo (Managed Workflow). Khởi chạy trên New Architecture 2026 (JSI, Fabric Renderer, TurboModules, Hermes Engine) nhằm đảm bảo hiệu năng 60/120fps, loại bỏ hoàn toàn JSON Bridge cũ.
* **Ngôn ngữ:** TypeScript (Strict Mode).
* **Quản lý Vùng an toàn:** Bắt buộc dùng `react-native-safe-area-context` (`<SafeAreaProvider>` ở root, `<SafeAreaView>` ở các màn hình) để xử lý Notch và Dynamic Island.
* **Quy chuẩn Styling:**
  * 100% style phải viết thông qua `StyleSheet.create()`, tuyệt đối không dùng inline style objects để tránh áp lực rác bộ nhớ (GC pressure).
  * Giá trị kích thước dùng đơn vị dp (density-independent pixels).
  * Hướng trục chính mặc định là `flexDirection: 'column'`.
  * Nghiêm cấm dùng thẻ HTML web (`div`, `span`, `p`); chỉ dùng các core components nguyên bản.

---

## 3. Package Dependencies & Setup Specifications

### 3.1. Khởi tạo & Cài đặt thư viện
```bash
# 1. Khởi tạo dự án Expo template TypeScript
npx create-expo-app@latest VKURoomBooking --template blank-typescript
cd VKURoomBooking

# 2. Cài đặt React Navigation & Peer dependencies
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context @expo/vector-icons

# 3. State Management (Zustand + AsyncStorage cho client, TanStack Query cho server)
npm install zustand
npx expo install @react-native-async-storage/async-storage
npm install @tanstack/react-query

# 4. Hiệu ứng động & Gesture Handling (UI Thread Worklets)
npx expo install react-native-reanimated react-native-gesture-handler


3.2. Cấu hình hệ thống bắt buộcCấu hình Babel (babel.config.js): Thêm plugin Reanimated vào vị trí cuối cùng trong mảng plugins:   JavaScriptmodule.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
Cấu hình App (app.json):JSON{
  "expo": {
    "name": "VKU Room Booking",
    "slug": "vku-room-booking",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1E3A5F"
    },
    "ios": {
      "bundleIdentifier": "vn.edu.vku.roombooking"
    },
    "android": {
      "package": "vn.edu.vku.roombooking"
    }
  }
}
4. Lược đồ Dữ liệu & Kiến trúc Quản lý State4.1. Khai báo TypeScript Types (src/types/index.ts)TypeScriptexport type RoomStatus = 'Available' | 'Occupied';

export interface Room {
  id: string;
  name: string;        // Ví dụ: "Lab A3-101", "Library Zone B"
  building: string;    // Ví dụ: "Building A3", "Main Library"
  capacity: number;    // Số lượng chỗ ngồi
  status: RoomStatus;  // Trạng thái hiện tại
  imageUrl: string;    // Link ảnh từ xa
  description?: string;
  facilities?: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  timeSlot: string;    // Ví dụ: "08:00 - 10:00"
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
4.2. Bộ Mock Data (src/data/mockData.ts)Tạo mảng dữ liệu mẫu chứa ít nhất 20 thực thể phòng học (Room[]) thuộc nhiều khu vực khác nhau (Building A3, Main Library, Building V) kèm đường dẫn ảnh rõ nét (dùng placeholder Picsum/Unsplash).   4.3. Quản lý Client State: Zustand Store (src/store/useBookingStore.ts)Sử dụng middleware persist kết hợp createJSONStorage(() => AsyncStorage) với storage key là 'vku-booking-storage' để đảm bảo dữ liệu đơn đặt phòng được lưu trữ liên tục qua các lần tắt/mở ứng dụng.   Cấu trúc Store:bookings: Booking[]   addBooking: (booking: Booking) => void   cancelBooking: (id: string) => void (hủy hoặc cập nhật trạng thái đơn đặt)   Quy tắc tiêu thụ (Consuming): Luôn dùng Selector Pattern (ví dụ: useBookingStore(s => s.bookings)) để tránh re-render ngoài ý muốn.   4.4. Quản lý Server State: TanStack Query Provider (src/services/queryClient.ts)Cấu hình mặc định cho QueryClient: staleTime: 5 * 60 * 1000 (dữ liệu giữ mới trong 5 phút), gcTime: 10 * 60 * 1000 (giải phóng sau 10 phút), retry: 2.   Custom Hook useRooms(building?: string):Khóa truy vấn: queryKey: ['rooms', { building }].   Hàm fetching: Trả về danh sách phòng theo bộ lọc (giả lập độ trễ 400ms bằng Promise khi dùng Mock Data để kiểm thử spinner nạp dữ liệu).   5. Kiến trúc Điều hướng Định kiểu Phân cấp (Navigation)5.1. Khai báo Route ParamList Type-Safe (src/navigation/types.ts)TypeScriptimport { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  RoomDetails: { roomId: string; roomName: string };
  BookingConfirmation: { bookingId: string };
};
5.2. Cấu trúc Lồng ghép NavigatorsNavigationContainer
└── Stack.Navigator (RootStack)
    ├── Screen "MainTabs" (Tab.Navigator) -> Bottom Tabs
    │   ├── Tab "BrowseRooms"  -> BrowseRoomsScreen (Icon: search / search-outline)
    │   ├── Tab "MyBookings"   -> MyBookingsScreen (Icon: calendar / calendar-outline)
    │   └── Tab "Profile"      -> ProfileScreen (Icon: person / person-outline)
    ├── Screen "RoomDetails"         -> RoomDetailsScreen (Push transition, ẩn Tab bar)
    └── Screen "BookingConfirmation" -> BookingConfirmationScreen (Modal, trượt từ dưới lên)
Cấu hình Stack: Header nền #1E3A5F, chữ #fff, hiệu ứng chuyển trang slide_from_right, màn hình BookingConfirmation thiết lập presentation: 'modal'.   Cấu hình Tabs: Màu active #3B82F6, tích hợp icon Ionicons tự đổi kiểu icon khi được chọn (focused).   6. Đặc tả Kỹ thuật Màn hình, Component & Hiệu ứng6.1. Component RoomCard (src/components/RoomCard.tsx)Bố cục & Styling:Khung chứa: borderRadius: 12, backgroundColor: '#FFFFFF', đổ bóng (shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3).   Hình ảnh (<Image>): Bắt buộc gán cứng kích thước (width: '100%', height: 160), thuộc tính resizeMode="cover".   Hàng tiêu đề: flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' chứa tên phòng và Badge trạng thái/sức chứa.   Badge trạng thái: Màu nền phân biệt rõ giữa Available (Xanh lá #10B981) và Occupied (Đỏ #EF4444).   Nội dung: Hiển thị biểu tượng tòa nhà và sức chứa (capacity seats)[cite: 1].Tương tác & Hiệu ứng:Bọc bằng thẻ <Pressable> với hitSlop={8} và phản hồi thị giác pressed && { opacity: 0.7 }.   Bọc trong <Animated.View> của Reanimated 3 với:
entering={FadeInDown.delay(index * 80).springify()}
exiting={FadeOutUp.duration(200)}
layout={Layout.springify()}.   6.2. Màn hình Duyệt phòng (BrowseRoomsScreen)Thanh tìm kiếm & Bộ lọc:<TextInput> tìm kiếm theo tên phòng (placeholder="Search rooms...")[cite: 1].Dải nút lọc danh mục (Filter Chips): Lọc theo tòa nhà (Tất cả, Building A3, Main Library...).   Danh sách FlatList hiệu năng cao:Thuộc tính tối ưu: initialNumToRender={10}, maxToRenderPerBatch={5}, windowSize={5}, keyExtractor={(item) => item.id}[cite: 1].Tích hợp Pull-to-refresh: Gán trực tiếp refreshing={isLoading} và onRefresh={refetch}.   Xử lý giao diện chờ (Loading Spinner) và thông báo lỗi (Error Banner kèm nút thử lại).   Nhấn vào thẻ phòng điều hướng đến màn hình RoomDetails.   6.3. Màn hình Chi tiết Phòng (RoomDetailsScreen)Tiếp nhận và đọc dữ liệu qua route.params.roomId và route.params.roomName.   Hiển thị ảnh kích thước lớn, thông tin sức chứa và các tiện ích phòng.   Bộ chọn Khung giờ (Time-slot Selector):Các khung giờ mẫu: 08:00 - 10:00, 10:00 - 12:00, 13:00 - 15:00, 15:00 - 17:00.Thuật toán Chống Trùng lặp (Conflict Prevention): Truy vấn danh sách trong useBookingStore. Nếu một slot của phòng này đã có trạng thái 'confirmed', lập tức vô hiệu hóa (disabled), làm mờ và hiển thị nhãn "Đã đặt".   Nút bấm hoạt họa "Book This Room":Tích hợp Reanimated: Sử dụng useSharedValue(1) và useAnimatedStyle.   Sự kiện: onPressIn co nút lại tỉ lệ 0.95 (withSpring(0.95)), onPressOut bung về 1.0 (withSpring(1)).   Khi bấm đặt thành công: Dispatch action addBooking vào Zustand và chuyển tiếp đến màn hình modal BookingConfirmation.   6.4. Màn hình Quản lý Đặt chỗ (MyBookingsScreen)Nạp danh sách đơn đặt từ Zustand store bằng selector.   Hiển thị giao diện trạng thái trống (EmptyState) kèm thông báo nếu người dùng chưa đặt phòng nào.   Cử chỉ Vuốt để Hủy (Swipe-to-Cancel):Tích hợp react-native-gesture-handler (GestureDetector kết hợp Gesture.Pan()).   Giới hạn hướng kéo: .activeOffsetX(-10), trục kéo sang trái translateX.value = Math.min(0, e.translationX).   Ngưỡng kích hoạt hủy: Khi vuốt vượt quá -120px (e.translationX < -120), gọi hàm runOnJS(cancelBooking)(bookingId).   Thả tay: Tự động đàn hồi về vị trí ban đầu qua withSpring(0).   6.5. Màn hình Xác nhận Đặt chỗ (BookingConfirmationScreen) & Cá nhân (ProfileScreen)BookingConfirmationScreen: Màn hình dạng modal trượt từ đáy màn hình, hiển thị mã đơn đặt (Booking Pass ID), thông tin tóm tắt và nút bấm quay trở về trang duyệt phòng.   ProfileScreen: Hiển thị thông tin sinh viên/người dùng và các tùy chỉnh hệ thống.   7. Tiêu chí Đánh giá & Nghiệm thu Kỹ thuật (Acceptance Criteria)Biên dịch & Chạy mã nguồn: Dự án khởi chạy ổn định qua lệnh npx expo start, không có lỗi TypeScript strict, cấu hình plugin Babel của Reanimated hoạt động chuẩn xác.   Hiệu năng Giao diện:Thao tác cuộn danh sách FlatList đạt khung hình ổn định 60fps.   Hiệu ứng xuất hiện thẻ FadeInDown chạy mượt mà trên UI thread.   Nội dung hiển thị an toàn tuyệt đối với tai thỏ và Dynamic Island[cite: 1].Quản lý Dữ liệu:Danh sách phòng nạp và lưu cache tự động qua TanStack Query; thao tác kéo xuống kích hoạt làm mới danh sách.   Lịch sử đặt phòng trong Zustand được lưu bền vững vào AsyncStorage (không bị mất khi khởi động lại ứng dụng).   Khung giờ đã có người đặt bị khóa chống trùng lặp thành công[cite: 1].Kiểm thử Cử chỉ: Vuốt sang trái trên thẻ booking kích hoạt hủy phòng thành công và thẻ tự động trượt về vị trí ban đầu.   8. Quy định Bàn giao Dự án & Hồ sơ Nộp bài (Deliverables)Dự án được đánh giá theo Barem điểm Mini-Project 2 (Deadline: Cuối Tuần 6 - Chủ nhật, 23:59). Agent cần chuẩn bị đầy đủ các sản phẩm bàn giao sau:   8.1. GitHub Repository & Hướng dẫn Cài đặtKhởi tạo file README.md tại thư mục gốc với các nội dung chuẩn hóa:   Giới thiệu tổng quan hệ sinh thái công nghệ của dự án.   Lệnh cài đặt phụ thuộc (npm install) và khởi chạy dev server (npx expo start)[cite: 1].Hướng dẫn quét mã QR để kiểm thử trên thiết bị thật qua app Expo Go.   Mô tả sơ đồ cấu trúc thư mục mã nguồn và kiến trúc luồng dữ liệu[cite: 2].8.2. Kịch bản Video Demo (Thời lượng 2 - 3 phút trên điện thoại thật)[cite: 2]0:00 - 0:45 (UI/UX & Browse): Khởi chạy app trên Expo Go, trình diễn hiệu ứng xuất hiện thẻ (FadeInDown), tìm kiếm phòng theo từ khóa, chuyển đổi các filter chip, kéo màn hình để kích hoạt Pull-to-refresh[cite: 1, 2].0:45 - 1:30 (Navigation & Booking Flow): Chọn một phòng bất kỳ để chuyển sang RoomDetails (chứng minh thanh tab đã tự động ẩn đi), thử ấn vào khung giờ đã bị khóa để kiểm tra tính năng chống trùng lặp, chọn khung giờ trống và nhấn nút đặt phòng (thể hiện hiệu ứng co giãn nút bấm)[cite: 1, 2].1:30 - 2:00 (Modal Confirmation): Trình diễn modal BookingConfirmation trượt từ đáy lên hiển thị mã vé, sau đó đóng modal[cite: 2].2:00 - 2:45 (Gestures & Persistence): Chuyển sang tab MyBookings kiểm tra thẻ phòng vừa đặt, thực hiện thao tác vuốt sang trái (Swipe-to-Cancel) để hủy đặt phòng[cite: 2]. Tắt hoàn toàn ứng dụng và mở lại để chứng minh dữ liệu lưu bền bỉ qua AsyncStorage[cite: 2].8.3. Khung Báo cáo Kỹ thuật (Technical Report Outline - 2 đến 4 trang PDF)[cite: 2]Agent chuẩn bị sẵn file REPORT_OUTLINE.md với các đề mục bám sát thang điểm:Introduction & System Architecture (15% Navigation): Phân tích mô hình Nesting Navigators (Stack + Tabs) và vai trò của New Architecture (Hermes, JSI, Fabric)[cite: 1, 2].State Management Strategy (15% State): Giải trình lý do phân tách Client State (Zustand + AsyncStorage) và Server State (TanStack Query Caching & Refetch)[cite: 2].Core Features & Conflict Prevention (30% Features): Trình bày chi tiết luồng tìm kiếm, bộ lọc danh mục và giải thuật khóa khung giờ chống trùng lặp[cite: 1, 2].UI/UX, Animations & Gestures (25% UI/UX): Phân tích việc triển khai FlatList 60fps, Reanimated Worklets và Gesture Handler[cite: 1, 2].Code Quality & Self-Evaluation (15% Code Quality): Tự đối chiếu việc tuân thủ TypeScript Strict, Custom Hooks và bảng tự chấm điểm theo thang điểm 100% của đồ án[cite: 2].