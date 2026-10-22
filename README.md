# Smart Watch & Band 3D Interactive Web Prototypes

Tập hợp 3 nguyên mẫu hoàn chỉnh (3 implementations) cho dự án Web bán đồng hồ thông minh tương tác 3D, được thực thi độc lập bởi 3 AI Agent Lead Orchestrator sử dụng quy trình Addy Osmani skills kết hợp gói kỹ năng `subagent-implement`.

---

## Cấu Trúc Repository

```
.
├── agent-1/    # Implementation 1 (Aura Wearables) - 117 tests passing, Three.js 3D studio, 4 watch faces
├── agent-2/    # Implementation 2 (Horizon Wearables) - 111 tests passing, Three.js 3D studio, 4 watch faces
└── agent-3/    # Implementation 3 (Nova Wearables) - 104 tests passing, Three.js 3D studio, 4 watch faces
```

---

## Tính Năng Chung Của Cả 3 Bản Prototype

1. **Phân loại sản phẩm (Taxonomy):**
   - **Smart Band:** 2 phân khúc (*Standard* và *Pro*)
   - **Smart Watch:** 3 phân khúc (*Standard*, *Pro*, và *Pro Max*)
2. **Trải nghiệm 3D Three.js:**
   - Dựng hình procedural geometries 100% trong Three.js (không phụ thuộc asset ngoài).
   - Xoay 360 độ mượt mà bằng chuột và cảm ứng (OrbitControls kèm quán tính damping).
   - Chế độ tự xoay turntable spin và đổi màu vỏ / dây đeo trực tiếp trên mô hình 3D.
3. **Mặt đồng hồ & Widget mô phỏng:**
   - 4 mặt đồng hồ động vẽ trên Canvas 512x512: *Minimal*, *Neon Cyberpunk*, *Chrono*, *Health Activity*.
   - 5 widget tương tác: *Đo nhịp tim (sóng ECG/pulse)*, *Đếm bước chân*, *Thời tiết*, *Nghe nhạc*, *Trạng thái pin*.
4. **Thiết kế Minimalist:**
   - Tông màu sáng tím nhạt - xanh pastel (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
   - Lọc phân khúc tức thì, so sánh thông số kỹ thuật.
5. **Giỏ hàng Client-Side:**
   - Quản lý trạng thái và lưu trữ `localStorage`, thanh toán giả lập xuất hóa đơn kèm mã vận đơn.

---

## Hướng Dẫn Chạy Thử

Chọn bất kỳ implementation nào để cài đặt và chạy thử:

```bash
# Thử nghiệm Agent 1:
cd agent-1
npm install
npm test
npm run dev

# Thử nghiệm Agent 2:
cd ../agent-2
npm install
npm test
npm run dev

# Thử nghiệm Agent 3:
cd ../agent-3
npm install
npm test
npm run dev
```
