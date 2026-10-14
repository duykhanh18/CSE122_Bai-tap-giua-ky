# VolunteerLink – Trang "Bảng ghép người" (Điều phối viên)
## Thông tin
| Mục | Nội dung |
|---|---|
| Tên đề tài | VolunteerLink – Ghép tình nguyện viên với hoạt động cộng đồng  |
| Trang đã thực hiện | Bảng ghép người  – `coordinator-matching-board` |
| Vai trò sử dụng | Điều phối viên |
| Sinh viên | Nguyễn Duy Khánh - MSV 2551060635 |

## Mục đích của trang
Giúp điều phối viên chọn ca còn thiếu người, xem danh sách ứng viên được chấm điểm phù hợp
(kỹ năng, lịch rảnh, kinh nghiệm) rồi xếp họ vào ca trực tiếp hoặc nhờ AI gợi ý cả đội hình.

## Các chức năng chính
- **Lọc ca** theo tên hoạt động (gõ đến đâu lọc đến đó, hỗ trợ không dấu).
- **Danh sách ca cần người**: thanh tiến độ lấp đầy, số chỗ còn thiếu, ca thiếu nhiều nhất lên đầu.
- **Chi tiết ca**: người đã xếp / chờ duyệt; nút **Xác nhận**, **Bỏ xếp**.
- **Ứng viên đề xuất** có điểm phù hợp (%) và lý do; nút **Xếp vào ca** (chặn khi ca đã đủ người hoặc trùng giờ).
- **Nhờ AI gợi ý đội hình** (mô phỏng bằng luật): đang xử lý → kết quả + độ tin cậy → "Vì sao?" →
  Chấp nhận / Sửa trọng số (modal) / Từ chối / Tạo lại / Lưu; có trạng thái *không đủ dữ liệu*, *chưa chắc chắn*.
- Trạng thái đang tải (skeleton), rỗng, thông báo (toast), chuông thông báo.
- Chuyển **chế độ sáng / tối**; **responsive** desktop, tablet (menu ngăn kéo), mobile.
## Công nghệ sử dụng
HTML5 (semantic) · CSS3 (Flexbox, Grid, biến CSS, Media Query) · JavaScript thuần (DOM, Event). Không dùng framework, không cần máy chủ.
## Cấu trúc thư mục
Bài tập giữa kỳ
├── index.html          # cấu trúc trang
├── css/
│   └── style.css
    └── main.css
├── js/
│   ├── data.js         # dữ liệu mẫu (kỹ năng, tình nguyện viên, ca, đăng ký)
│   ├── state.js        # trạng thái trang (ca đang chọn, kết quả AI)
│   ├── utils.js        # hàm tiện ích (ngày giờ, tìm không dấu, toast…)
│   ├── matching.js     # điểm phù hợp, kiểm tra trùng giờ, xếp người, đề xuất AI
│   ├── render.js       # vẽ danh sách ca + chi tiết ca
│   ├── ai.js           # khối "AI gợi ý đội hình" (xử lý → kết quả → chấp nhận…)
│   ├── layout.js       # menu ☰, chế độ sáng/tối, đăng xuất
│   └── main.js         # gắn sự kiện + khởi chạy
├── assets/images/
    └── .gitkeep
└── README.md


## Liên kết nộp bài
- Link Figma: _(dán link vào đây)_
- Link video: _(dán link vào đây)_
- Link GitHub: _(dán link vào đây)_
