# 🏫 RoomBooking - Ứng Dụng Đặt Phòng Học Trực Tuyến

Ứng dụng di động **RoomBooking** được xây dựng trên nền tảng **React Native** kết hợp **Expo (SDK 57)** và **TypeScript (Strict Mode)**, hỗ trợ sinh viên và giảng viên dễ dàng tra cứu, lọc và đăng ký phòng học/phòng thí nghiệm theo khung giờ thực tế với cơ chế chống trùng lặp lịch thông minh.

---

## 🌟 Tính Năng Nổi Bật

1. **Tìm Kiếm Phòng Học Thời Gian Thực**:
   - Thanh tìm kiếm nhanh hỗ trợ gõ tên phòng (ví dụ: *AI, Lab, Studio, 302...*) hoặc tên tòa nhà (*Tòa A3, Tòa K, Thư viện...*).
   - Nút xoá nhanh (✕) tiện lợi.

2. **Thẻ Lọc Đa Tiêu Chí (Multi-parameter Filter Chips)**:
   - **Lọc theo trạng thái phòng**: *Tất cả*, *🟢 Còn trống*, *🔴 Đang bận*.
   - **Lọc theo khu vực & tòa nhà**: *Tất cả tòa*, *Tòa nhà A3*, *Tòa nhà K*, *Tòa nhà V*, *Thư Viện*, *Trung Tâm ĐMST*, *Khu Hành Chính*.
   - Hiển thị số lượng phòng khớp với tiêu chí lọc theo thời gian thực.

3. **Bảng Cấp Dữ Liệu Phòng Chuẩn 60fps (FlatList Optimization)**:
   - Dữ liệu giả lập thực tế gồm **22 phòng học & lab nghiên cứu** hiện đại.
   - Tối ưu hóa hiệu năng render mượt mà với `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, và `keyExtractor`.
   - Hình ảnh tải chất lượng cao với kích thước cố định, chống giật layout (layout shift).

4. **Bộ Chọn Khung Giờ & Ngăn Chặn Đặt Trùng Lặp (Conflict Prevention)**:
   - Cung cấp 6 ca học tiêu chuẩn trong ngày:
     - Ca 1: `07:00 - 09:00`
     - Ca 2: `09:15 - 11:15`
     - Ca 3: `13:00 - 15:00`
     - Ca 4: `15:15 - 17:15`
     - Ca 5: `17:30 - 19:30`
     - Ca 6: `19:30 - 21:30`
   - **Cơ chế chống trùng lặp**: Các ca đã có lịch trước sẽ tự động bị khóa (`disabled`), chuyển màu xám mờ và hiển thị nhãn cảnh báo `🔒 Trùng lịch` kèm tên người/lớp đã đặt.
   - Người dùng chỉ chọn được ca còn trống và tiến hành xác nhận đặt phòng.
   - Sau khi đặt thành công, ca học sẽ ngay lập tức được khóa lại để chống trùng lặp tuyệt đối.

5. **Khung Thông Báo & Cửa Sổ Tùy Chỉnh (Custom Modals)**:
   - **Hoàn toàn không dùng `Alert.alert` mặc định của hệ điều hành**.
   - Thiết kế đồng bộ phong cách với tone màu chủ đạo `#1E3A5F`, viền bo tròn mềm mại, bóng đổ cao cấp và hiệu ứng chuyển động mượt.

6. **Chuẩn Quy Chuẩn Giao Diện & Styling**:
   - Sử dụng **100% `StyleSheet.create()`**, không dùng inline styles để giảm áp lực thu gom rác (GC pressure).
   - Tuyệt đối không dùng các thẻ HTML DOM, chỉ dùng các component native của React Native.
   - Tương thích hoàn hảo với tai thỏ, nốt ruồi và Dynamic Island thông qua `react-native-safe-area-context`.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [React Native](https://reactnative.dev/) (0.86+) & [Expo](https://expo.dev/) (SDK 57) Managed Workflow
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Kiến trúc mới (New Architecture)**: Mặc định trên Expo SDK 57 (Hermes Engine, Fabric, TurboModules)
- **Quản lý vùng an toàn**: `react-native-safe-area-context`
- **Mã định danh gói (Bundle ID)**: `vn.edu.vku.roombooking`

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
Room_Booking/
├── app.json                  # Cấu hình dự án Expo (name: RoomBooking, bundle ID, orientation portrait)
├── package.json              # Khai báo phụ thuộc và kịch bản khởi chạy
├── tsconfig.json             # Cấu hình TypeScript Strict Mode
├── App.tsx                   # Điểm khởi chạy gốc với SafeAreaProvider & StatusBar
├── prd.md                    # Tài liệu đặc tả yêu cầu sản phẩm
├── README.md                 # Tài liệu mô tả và hướng dẫn dự án
└── src/
    ├── types/
    │   └── room.ts           # Định nghĩa cấu trúc Room & TimeSlot
    ├── data/
    │   └── mockRooms.ts      # Bộ dữ liệu 22 phòng học kèm 6 khung giờ chi tiết
    ├── components/
    │   ├── Header.tsx        # Thanh tiêu đề thương hiệu & khối thống kê phòng
    │   ├── SearchBar.tsx     # Thanh tìm kiếm phòng học thời gian thực
    │   ├── FilterChips.tsx   # Thẻ lọc đa tiêu chí (Trạng thái, Tòa nhà)
    │   ├── RoomCard.tsx      # Thẻ thông tin phòng với phản hồi chạm opacity 0.7
    │   ├── BookingModal.tsx  # Cửa sổ chi tiết chọn khung giờ & chống đặt trùng lặp
    │   └── NotificationModal.tsx # Cửa sổ thông báo kết quả tùy chỉnh
    └── screens/
        └── RoomListScreen.tsx # Màn hình danh sách chính bọc SafeAreaView & FlatList
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS từ v18 trở lên).
- Thiết bị di động đã cài ứng dụng **Expo Go** (có sẵn trên App Store và Google Play).

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

### 5. Trải nghiệm trên thiết bị
- **Thiết bị thật**: Mở ứng dụng **Expo Go** trên điện thoại và quét mã QR hiển thị ở terminal.
- **Máy ảo Android**: Nhấn phím `a` trong terminal.
- **Trình duyệt Web**: Nhấn phím `w` trong terminal.

---

## 🧪 Kiểm Thử Dự Án

- **Kiểm tra kiểu dữ liệu TypeScript**:
  ```bash
  npx tsc --noEmit
  ```
  *(Kết quả: 0 lỗi, hoàn toàn tương thích Strict Mode)*

- **Kiểm tra chuẩn cấu hình Expo**:
  ```bash
  npx expo-doctor
  ```
  *(Kết quả: 21/21 checks passed)*

---

## 📄 Bản quyền
Dự án được xây dựng và phát triển phục vụ mục đích học tập và nghiên cứu công nghệ đa nền tảng.
Mã nguồn phát hành theo giấy phép [MIT](LICENSE).
