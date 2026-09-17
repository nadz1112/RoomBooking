# Tài liệu Yêu cầu Sản phẩm (PRD): Ứng dụng Room Booking (Giai đoạn 1)

## 1. Bối cảnh & Tiêu chuẩn Kiến trúc
* **Hệ thống**: React Native kết hợp Expo (Managed Workflow).
* **Ngôn ngữ & Cấu hình**: TypeScript (strict mode), tuân thủ Kiến trúc mới (New Architecture: JSI, Fabric, TurboModules, Hermes).
* **Quy chuẩn Giao diện & Styling**:
  * Sử dụng duy nhất `StyleSheet.create()`, tuyệt đối không dùng inline style object để tránh áp lực thu gom rác (GC pressure).
  * Bố cục tuân thủ mặc định `flexDirection: 'column'`, chỉ đổi sang `'row'` khi cần dàn hàng ngang.
  * Xử lý vùng an toàn (tai thỏ, Dynamic Island) bắt buộc thông qua thư viện `react-native-safe-area-context`.
  * Tuyệt đối không dùng các thẻ HTML DOM (`<div>`, `<span>`, `<p>`); chỉ sử dụng các component nguyên bản của React Native (`View`, `Text`, `Image`, `Pressable`, `FlatList`) để biên dịch sang widget native tương ứng.

---

## 2. Thông số Cài đặt & Khởi tạo Dự án
* **Tên dự án**: `RoomBooking`
* **Mã định danh gói (Bundle Identifier / Package)**: `vn.edu.vku.roombooking`
* **Hướng màn hình (Orientation)**: `portrait`
* **Màu chủ đạo / Màn hình chờ (Splash)**: Mã màu `#1E3A5F`
* **Thư viện yêu cầu**:
  * Template: Blank TypeScript của Expo
  * Package: `react-native-safe-area-context`

---

## 3. Lược đồ Dữ liệu & Mock Data
* **Cấu trúc thực thể `Room`**:
  * `id`: `string`
  * `name`: `string` (Ví dụ: "Lab A3-101", "Library Zone B")
  * `building`: `string` (Ví dụ: "Building A3", "Main Library")
  * `capacity`: `number` (Số chỗ ngồi)
  * `status`: Trạng thái phòng (`'Available'` | `'Occupied'`)
  * `imageUrl`: `string` (Đường dẫn ảnh từ xa)
* **Dữ liệu mẫu**: Tạo danh sách giả lập $\ge 20$ phòng học/lab thỏa mãn schema trên để phục vụ kiểm thử danh sách.

---

## 4. Đặc tả Kỹ thuật Component

### 4.1. Component `RoomCard`
* **Hiển thị hình ảnh & Bố cục**:
  * Khung bao (Container): Bo góc `borderRadius: 12`, đổ bóng (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation: 3`), nền trắng `#FFFFFF`.
  * Hình ảnh (`Image`): Sử dụng thẻ `<Image>` tải từ URI từ xa, bắt buộc set cứng kích thước `width` và `height`, cấu hình `resizeMode="cover"`.
  * Phần đầu (Header Row): Dàn hàng ngang (`flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'center'`) chứa tên phòng và badge trạng thái/sức chứa.
  * Badge trạng thái: Phân biệt rõ màu nền giữa phòng trống (`Available`) và phòng đã có người (`Occupied`).
  * Nội dung chi tiết: Hiển thị tên tòa nhà và số lượng chỗ ngồi (`capacity seats`).
* **Tương tác**:
  * Bọc bằng thẻ `<Pressable>` (không dùng component cũ `TouchableOpacity`).
  * Thiết lập `hitSlop={8}` để mở rộng vùng nhận cảm ứng.
  * Phản hồi thị giác khi nhấn: `pressed && { opacity: 0.7 }`.
  * Nhận sự kiện chọn phòng thông qua callback `onPress`.

### 4.2. Màn hình Danh sách (`RoomListScreen` / `App.tsx`)
* **Thiết lập Vùng an toàn (Safe Area)**:
  * Bọc `<SafeAreaProvider>` một lần duy nhất tại root ứng dụng (`App.tsx`).
  * Bao bọc màn hình bằng `<SafeAreaView>` với thuộc tính `edges={['top', 'left', 'right']}`.
* **Tối ưu hóa `FlatList` (Mục tiêu 60fps)**:
  * Khai báo đầy đủ các thuộc tính tối ưu hiệu năng:
    * `initialNumToRender={10}`
    * `maxToRenderPerBatch={5}`
    * `windowSize={5}`
    * `keyExtractor={(item) => item.id}`
    * `ItemSeparatorComponent` để tạo khoảng cách giữa các thẻ phòng.

---

## 5. Tiêu chí Nghiệm thu (Acceptance Criteria)
1. **Khởi tạo & Biên dịch**:
   * Dự án chạy trên nền TypeScript Strict Mode, không phát sinh lỗi ép kiểu (Type errors).
   * Khởi động trên công cụ Hermes mượt mà.
2. **Độ chuẩn xác Giao diện**:
   * Khớp đúng wireframe Mini-Project 2 (Tiêu đề, danh sách thẻ phòng, badge trạng thái, số chỗ).
   * Thao tác chạm vào card có hiệu ứng phản hồi opacity tức thì.
   * Nội dung không bị che khuất hoặc tràn lẹm vào tai thỏ, camera nốt ruồi hay Dynamic Island.
3. **Hiệu năng & Dữ liệu**:
   * `FlatList` render thành công danh sách từ 20 items trở lên, thao tác cuộn đạt chuẩn 60fps không giật lag.
   * Ảnh tải lên không bị giật layout (nhờ chỉ định rõ kích thước trước khi nạp).
4. **Môi trường Kiểm thử**:
   * Chạy kiểm thử thành công trên cả máy ảo (Android Emulator / iOS Simulator) và thiết bị thật qua app **Expo Go**.