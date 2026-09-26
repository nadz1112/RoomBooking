# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 2: Ứng Dụng Đặt Phòng Học & Phòng Lab Thời Gian Thực (RoomBooking)  
**Team / Student Name:** Lê Xuân Hoài Nam  
**Submission Date:** 26/09/2026  

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Thành viên nhóm thực hiện:**
  1. Lê Xuân Hoài Nam — Mã sinh viên: 23IT175 — Vai trò: Kiến trúc sư Frontend & Quản lý State (Frontend Architecture & State Management) — Đóng góp: 100%
* **🔗 Đường dẫn Tải file APK:** [Tải file RoomBooking.apk (Cục bộ hoặc GitHub Release)](./RoomBooking.apk)
* **💻 GitHub Repository:** [https://github.com/nadz1112/RoomBooking.git](https://github.com/nadz1112/RoomBooking.git)
* **🎥 Video Demo (Kịch bản chi tiết):** Đã tích hợp kịch bản chi tiết 0:00 - 2:45 trong [README.md](./README.md) và sẵn sàng trình chiếu trên thiết bị thực tế qua Expo Go / file APK.

---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Tính năng Yêu cầu | Trạng thái | Chi tiết Triển khai & Mức độ Hoàn thành |
|:---:|---|:---:|---|
| 1 | **Kiến trúc Điều hướng Phân cấp (Nesting Navigators Type-Safe)** | ✅ Hoàn thành | Kết hợp `RootStack` và `BottomTabs` (3 Tabs: Duyệt Phòng, Lịch Đặt, Hồ Sơ). Tự động ẩn thanh Tab Bar khi vào `RoomDetails`, mở màn hình `BookingConfirmation` dưới dạng Modal native trượt từ đáy. Định kiểu chặt chẽ bằng TypeScript. |
| 2 | **Duyệt & Tìm kiếm Phòng học (Real-time Search & Filter Chips)** | ✅ Hoàn thành | Thanh tìm kiếm tức thì theo tên phòng và tòa nhà. Bộ thẻ lọc danh mục (Filter Chips) theo khu vực (Building A3, Main Library, Building V, Building K, Innovation Hub...). Cung cấp dữ liệu mẫu gồm 22 phòng học/lab phong phú kèm tiện ích. |
| 3 | **Hiển thị Danh sách Mượt mà 60fps (FlatList Optimization)** | ✅ Hoàn thành | Cấu hình tối ưu bộ đệm `initialNumToRender={10}`, `maxToRenderPerBatch={5}`, `windowSize={5}`, `keyExtractor`. Gán cứng kích thước ảnh chống giật layout (layout shift). Tích hợp kéo để làm mới (Pull-to-refresh). |
| 4 | **Quản lý Server Cache (TanStack React Query)** | ✅ Hoàn thành | Tách biệt hoàn toàn Server State: `QueryClient` với `staleTime: 5 phút`, `gcTime: 10 phút`, `retry: 2`. Custom hook `useRooms` giả lập độ trễ 400ms để kiểm thử spinner nạp dữ liệu và phản hồi mạng. |
| 5 | **Bộ chọn Khung giờ & Chống Đặt Trùng Lặp (Conflict Prevention)** | ✅ Hoàn thành | Cung cấp 4 khung giờ chuẩn trong ngày. Thuật toán tự động tra cứu danh sách đơn đã xác nhận (`confirmed`) trong Zustand; nếu phát hiện trùng lịch sẽ lập tức vô hiệu hóa (`disabled`), gạch ngang và gắn nhãn `🔒 Đã đặt`. |
| 6 | **Hiệu ứng Hoạt họa trên UI Thread (Reanimated 3 Worklets)** | ✅ Hoàn thành | Thẻ phòng xuất hiện so le mượt mà bằng `FadeInDown.delay(index * 80).springify()`. Nút bấm "Book This Room" phản hồi cử chỉ bấm co giãn đàn hồi tự nhiên bằng `useSharedValue` và `withSpring` (co về `0.95`, bung về `1.0`). |
| 7 | **Lưu trữ Cục bộ Bền vững (Zustand + AsyncStorage Persistence)** | ✅ Hoàn thành | Quản lý Client State bằng Zustand với middleware `persist` và `createJSONStorage(() => AsyncStorage)` (key `'vku-booking-storage'`). Dữ liệu đơn đặt phòng được bảo toàn trọn vẹn qua các lần tắt/mở lại ứng dụng. |
| 8 | **Cử chỉ Vuốt để Hủy Phòng (Swipe-to-Cancel Pan Gesture)** | ✅ Hoàn thành | Tích hợp `react-native-gesture-handler` (`Gesture.Pan()`). Khi vuốt thẻ sang trái vượt ngưỡng `-120px`, hệ thống gọi hàm `cancelBooking` an toàn qua `runOnJS`, thẻ tự động đàn hồi về vị trí cũ bằng `withSpring(0)`. |
| 9 | **Bảo vệ Vùng An Toàn & Styling Chuẩn Native** | ✅ Hoàn thành | 100% style viết qua `StyleSheet.create()`, không dùng inline style để tránh áp lực thu gom rác (GC pressure). Xử lý an toàn với tai thỏ và Dynamic Island bằng `react-native-safe-area-context`. Không dùng thẻ HTML DOM. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1. Sơ đồ Cấu trúc Thư mục Dự án
```text
Room_Booking/
├── android/                  # Thư mục mã nguồn native Android (Prebuild & Gradle Build APK)
├── app.json                  # Cấu hình dự án Expo (name: RoomBooking, bundle: vn.edu.vku.roombooking)
├── babel.config.js           # Cấu hình Babel nạp plugin react-native-reanimated/plugin
├── package.json              # Khai báo các phụ thuộc công nghệ New Architecture
├── tsconfig.json             # TypeScript Strict Mode ("strict": true)
├── App.tsx                   # Root Component bọc GestureHandler, SafeArea, QueryClient, Navigation
├── README.md                 # Hướng dẫn chi tiết, kịch bản video demo 0:00 - 2:45
├── TECHNICAL_REPORT.md       # Báo cáo kỹ thuật tổng kết dự án theo mẫu VKU
├── RoomBooking.apk           # File cài đặt ứng dụng Android độc lập (Release/Debug APK)
└── src/
    ├── types/index.ts        # Định nghĩa các interface Room, Booking, RoomStatus
    ├── data/mockData.ts      # Bộ dữ liệu mẫu 22 phòng học/lab đa dạng tiện ích
    ├── store/useBookingStore.ts # Zustand Store kết hợp AsyncStorage persistence
    ├── services/queryClient.ts  # TanStack React Query Client & custom hook useRooms
    ├── navigation/           # Quản lý điều hướng Stack lồng Tabs phân cấp
    │   ├── types.ts          # RootStackParamList & TabParamList Type-Safe
    │   └── RootNavigator.tsx # Cấu hình Header #1E3A5F, Bottom Tabs tự đổi icon focused
    ├── components/           # Các component tái sử dụng (RoomCard, SearchBar, FilterChips, Header)
    └── screens/              # Các màn hình chính của ứng dụng
        ├── BrowseRoomsScreen.tsx       # Duyệt phòng, tìm kiếm, lọc tòa nhà, FlatList 60fps
        ├── RoomDetailsScreen.tsx       # Chi tiết phòng, chọn khung giờ chống trùng lặp, nút spring
        ├── BookingConfirmationScreen.tsx # Modal native trượt đáy hiển thị vé đặt phòng
        ├── MyBookingsScreen.tsx        # Danh sách lịch đặt với cử chỉ vuốt hủy Swipe-to-Cancel
        └── ProfileScreen.tsx           # Thông tin sinh viên & thống kê đặt phòng
```

### 3.2. Luồng Quản lý Trạng thái (State Management Flow)
Ứng dụng tách biệt dứt khoát giữa hai luồng trạng thái nhằm đảm bảo Single Source of Truth và tránh xung đột dữ liệu:
* **Server State (TanStack Query):** Chịu trách nhiệm nạp danh sách phòng học, quản lý trạng thái tải (`isLoading`), bắt lỗi (`isError`), và tự động làm mới (`refetch`). Dữ liệu được lưu đệm trong bộ nhớ (Cache) với thời gian tươi mới 5 phút, giúp giao diện phản hồi tức thì mà không cần gọi lại tài nguyên nhiều lần.
* **Client State (Zustand + AsyncStorage):** Quản lý trạng thái các đơn đặt phòng của sinh viên. Bằng việc kết hợp middleware `persist`, mỗi khi hành động `addBooking` hoặc `cancelBooking` được kích hoạt, Zustand vừa cập nhật state trong RAM vừa bất đồng bộ ghi xuống bộ nhớ flash của thiết bị qua `AsyncStorage`. Các component tiêu thụ dữ liệu theo **Selector Pattern** (`useBookingStore(s => s.bookings)`), ngăn ngừa hiện tượng re-render lan truyền trên cây component.

### 3.3. Chiến lược Xử lý Ngoại lệ (Exception Handling Strategy)
* **Xử lý Mạng & Bất đồng bộ:** TanStack Query cấu hình tham số `retry: 2`. Khi việc tải dữ liệu thất bại, hệ thống tự động thử lại 2 lần trước khi chuyển sang giao diện Error Banner với thông báo lỗi cụ thể và nút "Thử lại" (`refetch`) để người dùng chủ động nạp lại.
* **Xử lý An toàn Kiểu dữ liệu (Type Safety):** 100% mã nguồn tuân thủ TypeScript Strict Mode (`strict: true`). Tất cả các thuộc tính tùy chọn (`description?`, `facilities?`, `timeSlots?`) đều được gán giá trị mặc định hoặc fallback an toàn (`const slots = room.timeSlots || []`), loại bỏ hoàn toàn lỗi văng ứng dụng do truy cập thuộc tính của `undefined`.
* **Cơ chế Ngăn chặn Xung đột (Conflict Prevention):** Xử lý ngoại lệ đặt trùng lịch ngay từ tầng giao diện người dùng. Các khung giờ đã có đơn đặt ở trạng thái `confirmed` sẽ bị vô hiệu hóa cứng (`disabled={true}`), không thể tạo ra payload đặt phòng trùng lặp gửi vào hệ thống.

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

Dưới đây là mô tả bố cục và chức năng trực quan của 4 màn hình chính trên ứng dụng di động:

```
┌──────────────────────────┐    ┌──────────────────────────┐
│ 🏫 RoomBooking           │    │ ← Lab A3-101             │
│ [🔍 Search rooms...    ] │    │ ┌──────────────────────┐ │
│ [All][Bldg A3][Library]  │    │ │ [ Ảnh phòng lớn ]    │ │
│ ──────────────────────── │    │ └──────────────────────┘ │
│ ┌──────────────────────┐ │    │ 🏢 Building A3  👥 45 seats│
│ │ [Ảnh phòng học]      │ │    │ ──────── Khung giờ ──── │
│ │ Lab A3-101 [Available│ │    │ [08:00 - 10:00] 🔒 Đã đặt│
│ │ 👥 45 seats  🏢 A3   │ │    │ [10:00 - 12:00] ✓ Đang chọn
│ └──────────────────────┘ │    │ [ Book This Room (10-12) ]│
│ ┌──────────────────────┐ │    └──────────────────────────┘
│ │ Smart Classroom A3   │ │     (2) Màn hình Chi Tiết & Chống
│ └──────────────────────┘ │         Trùng Lịch (RoomDetails)
│ [Duyệt]  [Lịch đặt] [Hồ sơ]│
└──────────────────────────┘
 (1) Màn hình Duyệt Phòng
     (BrowseRoomsScreen)

┌──────────────────────────┐    ┌──────────────────────────┐
│ 🎉 Booking Confirmed!    │    │ 📅 LỊCH ĐẶT CỦA TÔI      │
│ ┌──────────────────────┐ │    │ Tổng số: 2 đơn đặt       │
│ │ VKU ROOM PASS        │ │    │ ──────────────────────── │
│ │ Mã: BK-849201        │ │    │ ┌──────────────────────┐ │
│ │ Phòng: Lab A3-101    │ │    │ │ Lab A3-101 [Confirmed] │ │
│ │ Giờ: 10:00 - 12:00   │ │    │ │ ⏰ 10:00 - 12:00      │ │
│ └──────────────────────┘ │    │ └──────────────────────┘ │
│ [Xem Danh Sách Đặt Chỗ ] │    │   👈 [Vuốt trái để hủy]  │
│ [Quay Về Trang Chủ     ] │    │ ┌──────────────────────┐ │
└──────────────────────────┘    │ │ Smart Classroom 302  │ │
 (3) Modal Xác Nhận Vé Đặt      └──────────────────────────┘
  (BookingConfirmationScreen)    (4) Màn hình Quản Lý Lịch Đặt
                                     & Vuốt để Hủy (MyBookings)
```

1. **Màn hình Duyệt phòng (BrowseRoomsScreen):** Hiển thị thanh Header thương hiệu màu `#1E3A5F`, thanh tìm kiếm thời gian thực, dải thẻ lọc danh mục các tòa nhà và danh sách `FlatList` với hiệu ứng hoạt họa xuất hiện so le `FadeInDown`.
2. **Màn hình Chi tiết Phòng & Chống Trùng Lặp (RoomDetailsScreen):** Thanh Bottom Tabs tự động ẩn đi; hiển thị hình ảnh kích thước lớn, thông tin sức chứa, trang thiết bị; bộ chọn khung giờ tự động khóa mờ các ca đã có người đặt (`🔒 Đã đặt`); nút bấm "Book This Room" với vi hiệu ứng co giãn Spring `0.95 -> 1.0`.
3. **Màn hình Xác nhận Đặt phòng (BookingConfirmationScreen):** Cửa sổ Modal trượt từ đáy màn hình hiển thị thẻ vé Booking Pass ID, ngày giờ đặt, và nút điều hướng nhanh.
4. **Màn hình Quản lý Lịch đặt (MyBookingsScreen):** Hiển thị danh sách các đơn đặt phòng từ Zustand; hỗ trợ cử chỉ vuốt sang trái qua ngưỡng `-120px` (Swipe-to-Cancel) làm lộ nền đỏ cảnh báo và tự động cập nhật trạng thái hủy phòng.

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### Thách thức 1: Đảm bảo Giải thuật Khóa Khung Giờ Chống Trùng Lặp Đồng Bộ & Thời Gian Thực
* **Bối cảnh & Vấn đề:** Trong ứng dụng đặt phòng học, việc xung đột lịch xảy ra khi nhiều sinh viên cùng xem một phòng và đăng ký trùng một khung giờ. Nếu chỉ kiểm tra trạng thái phòng tổng quát (`Available` / `Occupied`), người dùng không thể biết ca học cụ thể nào còn trống và ca nào đã bận.
* **Giải pháp khắc phục:** Thiết kế cấu trúc dữ liệu `Booking` chuẩn mực với `roomId`, `timeSlot`, và `status`. Tại màn hình `RoomDetailsScreen`, tạo một `useMemo` tính toán `bookedSlotsSet` bằng cách quét toàn bộ mảng `bookings` trong Zustand store:
  ```typescript
  const bookedSlotsSet = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.roomId === roomId && b.status === 'confirmed') {
        set.add(b.timeSlot);
      }
    });
    return set;
  }, [bookings, roomId]);
  ```
  Nhờ cơ chế Selector và `useMemo`, bất kỳ khi nào có một đơn đặt phòng mới được tạo hoặc một đơn cũ bị hủy, `bookedSlotsSet` lập tức được tính toán lại ngay lập tức. Khung giờ tương ứng sẽ tự động chuyển đổi giữa trạng thái có thể chọn và trạng thái bị khóa cứng (`disabled={true}`), loại bỏ 100% nguy cơ phát sinh đơn đặt trùng lặp.

### Thách thức 2: Xử Lý Xung Đột Cử Chỉ Vuốt (Pan Gesture) Bên Trong Danh Sách Cuộn (FlatList)
* **Bối cảnh & Vấn đề:** Khi tích hợp cử chỉ vuốt sang trái để hủy phòng (`Swipe-to-Cancel`) trên mỗi thẻ booking nằm bên trong danh sách cuộn dọc `FlatList`, hai hệ thống nhận diện cử chỉ dễ bị xung đột: người dùng kéo cuộn dọc danh sách nhưng hệ thống lại nhận nhầm thành thao tác vuốt ngang để hủy phòng, hoặc ngược lại cử chỉ vuốt ngang bị FlatList chặn lại.
* **Giải pháp khắc phục:** Sử dụng thư viện **React Native Gesture Handler v2** với API hiện đại `GestureDetector` kết hợp `Gesture.Pan()`. Cấu hình bộ lọc kích hoạt trục ngang nghiêm ngặt bằng `.activeOffsetX([-10, 10])`:
  ```typescript
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (isCancelled) return;
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (isCancelled) return;
      if (e.translationX < -120) {
        runOnJS(onCancel)(booking.id);
      }
      translateX.value = withSpring(0);
    });
  ```
  Nhờ thiết lập `activeOffsetX`, cử chỉ Pan chỉ kích hoạt khi ngón tay người dùng dịch chuyển theo phương ngang vượt quá 10dp. Nếu người dùng vuốt theo phương dọc, `FlatList` sẽ ưu tiên xử lý cuộn trang mượt mà mà không làm giật thẻ booking. Khi vuốt ngang thành công vượt quá `-120px`, hàm `runOnJS` cầu nối an toàn từ UI Thread về JavaScript Thread để thực thi action hủy phòng, sau đó `withSpring(0)` đưa thẻ mượt mà về vị trí ban đầu.
