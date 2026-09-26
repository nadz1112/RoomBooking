# 🏫 RoomBooking - Ứng Dụng Đặt Phòng Học & Lab Thời Gian Thực (VKU)

> **Mini-Project 2 - Full Implementation**  
> Môn học: Lập trình Đa nền tảng (Cross-Platform Mobile Development)  
> Khoa Kỹ thuật Máy tính - Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU)

Ứng dụng di động **RoomBooking** được xây dựng trên nền tảng **React Native & Expo (SDK 57)** với kiến trúc **New Architecture (Hermes, Fabric, JSI)**, kết hợp điều hướng phân cấp định kiểu **React Navigation 7**, quản lý Client State bằng **Zustand + AsyncStorage**, quản lý Server Cache với **TanStack React Query**, cùng hiệu ứng chuyển động mượt mà bằng **Reanimated 3** và cử chỉ vuốt bằng **Gesture Handler**.

---

## 🌟 Tính Năng Nổi Bật

1. **Kiến trúc Điều Hướng Định Kiểu (Navigation Nesting Type-Safe)**:
   - Hệ thống lồng ghép `Stack.Navigator` chứa `BottomTabs` (3 Tabs: *Duyệt Phòng*, *Lịch Đặt*, *Hồ Sơ*).
   - Màn hình `RoomDetails` tự động ẩn thanh Tab Bar dưới đáy khi chuyển trang.
   - Màn hình `BookingConfirmation` thiết kế dạng Modal trượt từ đáy màn hình.

2. **Duyệt Phòng & Tối Ưu Hóa Hiệu Năng 60fps**:
   - Bộ dữ liệu mẫu gồm **22 phòng học & phòng lab hiện đại** kèm ảnh sắc nét, mô tả và danh sách trang thiết bị tiện ích 100% tiếng Việt.
   - Danh sách `FlatList` cấu hình tối ưu tuyệt đối: `initialNumToRender={10}`, `maxToRenderPerBatch={5}`, `windowSize={5}`.
   - Thanh tìm kiếm thời gian thực theo tên phòng/tòa nhà, giữ focus bàn phím liên tục khi gõ ký tự (không bị ẩn bàn phím) và dải thẻ lọc danh mục (Filter Chips) theo tòa nhà.
   - Tích hợp tính năng kéo xuống để làm mới (Pull-to-refresh) trực tiếp với `useRooms` từ TanStack Query.

3. **Hiệu Ứng Hoạt Họa Mượt Mà trên UI Thread (Reanimated 3 Worklets)**:
   - Thẻ phòng `RoomCard` hiển thị hiệu ứng so le mượt mà: `entering={FadeInDown.delay(index * 80).springify()}`.
   - Nút bấm *"Xác Nhận Đặt Phòng"* phản hồi cử chỉ bấm co giãn đàn hồi tự nhiên: `onPressIn` co về `0.95`, `onPressOut` bung về `1.0`.

4. **Bộ Chọn Khung Giờ & Thuật Toán Chống Trùng Lặp (Conflict Prevention)**:
   - Các khung giờ mẫu trong ngày: `08:00 - 10:00`, `10:00 - 12:00`, `13:00 - 15:00`, `15:00 - 17:00`.
   - Thuật toán tự động đối chiếu các đơn đặt phòng có trạng thái `confirmed` trong Zustand: Nếu khung giờ đã có người đặt, hệ thống lập tức vô hiệu hóa (`disabled`), gạch ngang thời gian và hiển thị nhãn `🔒 Đã đặt`.

5. **Lưu Trữ Bền Vững Client State (Zustand + AsyncStorage)**:
   - Sử dụng middleware `persist` với storage key `'vku-booking-storage'`. Toàn bộ dữ liệu đơn đặt phòng và hồ sơ cá nhân được bảo toàn liên tục qua các lần tắt/mở lại ứng dụng.
   - Cung cấp selector pattern để hạn chế tối đa các lượt re-render thừa.

6. **Cử Chỉ Kéo Sang Phải Để Hủy Đơn Đặt (> 70% Card Width)**:
   - Tích hợp `react-native-gesture-handler` (`Gesture.Pan()`).
   - Người dùng kéo thẻ đặt phòng sang phải vượt quá 70% bề rộng thẻ (`> 70% cardWidth`) mới kích hoạt hủy phòng; nếu kéo dưới 70% thẻ tự động bung về vị trí cũ qua `withSpring(0)`.

7. **Quản Lý Hồ Sơ Cá Nhân & Ảnh Đại Diện Sinh Viên**:
   - Cho phép cập nhật Họ tên, MSSV, Email, Khoa đào tạo, Số điện thoại.
   - Cho phép chọn ảnh đại diện từ bộ sưu tập avatar sinh viên phong phú hoặc nhập link ảnh trực tuyến. Lưu trữ bền vững ngay trên thiết bị.

---

## 🛠️ Hệ Sinh Thái Công Nghệ

- **Framework:** [React Native](https://reactnative.dev/) (0.86+) & [Expo](https://expo.dev/) (SDK 57) Managed Workflow
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Kiến trúc Native:** New Architecture (Hermes, JSI, Fabric Renderer, TurboModules)
- **Navigation:** `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- **Quản lý State:** `zustand`, `@react-native-async-storage/async-storage`, `@tanstack/react-query`
- **Animations & Gestures:** `react-native-reanimated`, `react-native-gesture-handler`
- **Quản lý Vùng an toàn:** `react-native-safe-area-context`
- **Mã định danh gói (Bundle ID):** `vn.edu.vku.roombooking`

---

## 📁 Cấu Trúc Thư Mục Mã Nguồn

```text
Room_Booking/
├── app.json                  # Cấu hình dự án Expo (name: RoomBooking, bundle ID, orientation portrait)
├── babel.config.js           # Cấu hình Babel với plugin Reanimated ở cuối
├── package.json              # Khai báo phụ thuộc và kịch bản khởi chạy
├── tsconfig.json             # TypeScript Strict Mode ("strict": true)
├── App.tsx                   # Điểm khởi chạy gốc với GestureHandler, SafeAreaProvider, QueryClientProvider, NavigationContainer
├── REPORT_OUTLINE.md         # Báo cáo kỹ thuật chi tiết theo thang điểm 100% của đồ án
├── prd_full.md               # Tài liệu đặc tả yêu cầu sản phẩm đầy đủ
├── README.md                 # Tài liệu mô tả và hướng dẫn dự án
└── src/
    ├── types/
    │   └── index.ts          # Định nghĩa kiểu dữ liệu Room, Booking, RoomStatus
    ├── data/
    │   └── mockData.ts       # Bộ dữ liệu 22 phòng học kèm facilities và mô tả chi tiết
    ├── store/
    │   └── useBookingStore.ts # Zustand store kết hợp AsyncStorage persist
    ├── services/
    │   └── queryClient.ts    # TanStack Query client & custom hook useRooms
    ├── navigation/
    │   ├── types.ts          # Khai báo kiểu Route ParamList Type-Safe
    │   └── RootNavigator.tsx # Cấu hình Stack Navigator lồng Bottom Tabs Navigator
    ├── components/
    │   ├── RoomCard.tsx      # Thẻ phòng bo góc 12, bóng đổ, Reanimated FadeInDown
    │   ├── SearchBar.tsx     # Thanh tìm kiếm thời gian thực
    │   ├── FilterChips.tsx   # Dải thẻ lọc danh mục theo tòa nhà
    │   └── Header.tsx        # Header thương hiệu hệ thống
    └── screens/
        ├── BrowseRoomsScreen.tsx       # Màn hình duyệt phòng với FlatList 60fps & Pull-to-refresh
        ├── RoomDetailsScreen.tsx       # Màn hình chi tiết phòng, bộ chọn ca học & nút bấm co giãn
        ├── BookingConfirmationScreen.tsx # Modal trượt từ đáy hiển thị vé đặt phòng
        ├── MyBookingsScreen.tsx        # Quản lý đơn đặt phòng với cử chỉ vuốt để hủy (Swipe-to-Cancel)
        └── ProfileScreen.tsx           # Thông tin sinh viên & thống kê đặt phòng
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản LTS 18+ hoặc 20+).
- Thiết bị di động đã cài đặt ứng dụng **Expo Go** (tải miễn phí trên App Store / Google Play).

### 2. Tải mã nguồn về máy
```bash
git clone https://github.com/nadz1112/RoomBooking.git
cd RoomBooking
```

### 3. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 4. Khởi chạy ứng dụng
```bash
npx expo start
```

### 5. Kiểm thử trên thiết bị
- **Trên điện thoại thật:** Mở ứng dụng **Expo Go** và quét mã QR hiển thị ở màn hình terminal.
- **Trên máy ảo Android:** Nhấn phím `a` trong terminal.
- **Trên trình duyệt Web:** Nhấn phím `w` trong terminal.

---

## 📹 Kịch Bản Video Demo (Thời lượng 2 - 3 phút trên điện thoại thật)

> 🔗 **Xem Video Demo Thực Tế (YouTube Shorts):** [https://youtube.com/shorts/KHXnOK9yr9I?si=JETYhNXUoOf7dHe0](https://youtube.com/shorts/KHXnOK9yr9I?si=JETYhNXUoOf7dHe0)  
> 
> Để đạt điểm tối đa trong phần trình bày demo, bạn có thể tham khảo các mốc thời gian chuẩn hóa sau:

| Mốc thời gian | Nội dung trình diễn & Thao tác | Mục tiêu chứng minh |
| :--- | :--- | :--- |
| **0:00 - 0:45** *(UI/UX & Browse)* | 1. Mở app qua Expo Go, quan sát hiệu ứng thẻ phòng xuất hiện so le từ dưới lên (`FadeInDown`).<br>2. Gõ liên tục trên thanh tìm kiếm (ví dụ: `"AI"`, `"Thông Minh"`), chứng minh bàn phím không bao giờ bị ẩn giữa chừng.<br>3. Chạm vào các filter chip (*Tòa nhà A3, Thư Viện Trung Tâm...*).<br>4. Kéo màn hình từ trên xuống để kích hoạt thao tác Pull-to-refresh (quay spinner nạp dữ liệu từ TanStack Query). | Giao diện chuẩn 60fps, Reanimated hoạt động mượt mà, tìm kiếm liên tục không mất focus bàn phím. |
| **0:45 - 1:30** *(Navigation & Booking Flow)* | 1. Nhấn vào một thẻ phòng (ví dụ: *Phòng Lab Trí Tuệ Nhân Tạo*) để chuyển sang `RoomDetailsScreen`. Nhận xét thanh Bottom Tabs đã tự động ẩn đi.<br>2. Xem ảnh lớn, sức chứa và danh sách tiện ích tiếng Việt.<br>3. Bấm vào khung giờ đã có đơn đặt trước (bị gạch ngang, mác `🔒 Đã đặt`) để chứng minh tính năng chống trùng lặp.<br>4. Chạm vào một khung giờ còn trống (ví dụ: `10:00 - 12:00`).<br>5. Bấm nút *"Xác Nhận Đặt Phòng"*, quan sát hiệu ứng nút co lại 0.95 rồi bung về 1.0. | Điều hướng Stack lồng Tabs chuẩn mực, giải thuật Conflict Prevention và hiệu ứng nút bấm Spring. |
| **1:30 - 2:00** *(Modal Confirmation)* | 1. Màn hình `BookingConfirmationScreen` trượt từ đáy màn hình lên dưới dạng Modal.<br>2. Xem mã vé (Booking Pass ID), thông tin phòng, khung giờ và trạng thái `ĐÃ XÁC NHẬN`.<br>3. Bấm nút *"Xem Danh Sách Đặt Chỗ"* để chuyển thẳng sang Tab `MyBookings`. | Modal presentation chuẩn native, luồng điều hướng liền mạch. |
| **2:00 - 2:45** *(Gestures & Persistence)* | 1. Tại tab `Lịch Đặt` (`MyBookingsScreen`), quan sát đơn đặt phòng vừa tạo hiển thị ở đầu danh sách.<br>2. Dùng ngón tay kéo thẻ sang phải: kéo dưới 70% thả tay ra thẻ tự động đàn hồi về vị trí cũ; kéo vượt quá 70% bề rộng để kích hoạt hủy phòng thành công.<br>3. Trạng thái thẻ chuyển sang `Đã hủy`. | Cử chỉ Gesture Handler v2 chuẩn xác, ngưỡng kéo > 70% theo đúng yêu cầu nghiệp vụ. |
| **2:45 - 3:15** *(Hồ Sơ & Cập Nhật)* | 1. Chuyển sang tab `Hồ Sơ` (`ProfileScreen`). Bấm vào nút *"Chỉnh sửa hồ sơ & ảnh đại diện"* hoặc chạm vào avatar.<br>2. Thay đổi Họ tên, MSSV, số điện thoại và chọn một ảnh đại diện mới trong danh sách avatar sinh viên.<br>3. Bấm *"Lưu Thay Đổi"*, thông báo thành công hiển thị và thông tin lập tức cập nhật trên màn hình.<br>4. Vuốt tắt hẳn ứng dụng, sau đó mở lại để chứng minh dữ liệu và ảnh đại diện vẫn được lưu giữ trọn vẹn nhờ **AsyncStorage Persistence**. | Tùy biến hồ sơ cá nhân hoàn chỉnh, lưu trữ bền vững Client State. |

---

## 🧪 Kết Quả Kiểm Thử Tự Động

- **Kiểm tra kiểu dữ liệu TypeScript Strict Mode:**
  ```bash
  npx tsc --noEmit
  ```
  *(Kết quả: 0 lỗi - Exit Code 0)*

- **Kiểm tra cấu hình & tương thích Expo SDK 57:**
  ```bash
  npx expo-doctor
  ```
  *(Kết quả: 21/21 checks passed - No issues detected!)*

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ học phần Lập trình Đa nền tảng tại VKU.  
Mã nguồn phát hành theo giấy phép [MIT](LICENSE).
