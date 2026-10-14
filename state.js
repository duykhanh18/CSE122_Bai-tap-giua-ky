/* =====================================================
   state.js – TRẠNG THÁI CỦA TRANG
   Mọi file đọc/ghi trạng thái qua đối tượng `state` này.
   ===================================================== */

const state = {
  selectedShiftId: '',   // id của ca đang được chọn ở cột trái
  ai: {
    result: null,        // kết quả AI hiện tại (null = chưa có)
    attempt: 0,          // số lần "Tạo lại" (chọn bộ trọng số)
    token: 0             // đổi mỗi lần chạy mới để huỷ lượt chạy cũ
  }
};
