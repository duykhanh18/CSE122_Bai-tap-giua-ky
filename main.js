/* =====================================================
   main.js – ĐIỂM KHỞI ĐỘNG CỦA TRANG
   Gắn sự kiện cho danh sách ca / chi tiết ca và khởi chạy.
   Thứ tự nạp file (xem index.html):
   data → state → utils → matching → render → ai → layout → main
   ===================================================== */

// Chạy một hành động, báo kết quả bằng toast rồi vẽ lại giao diện
function runAction(action, okMessage) {
  try {
    action();
    showToast(okMessage);
    renderAll();
  } catch (e) {
    showToast(e.message, 'bad');
  }
}

// Gõ vào ô tìm kiếm -> lọc sau 200ms ngừng gõ (debounce, tránh vẽ lại liên tục)
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderAll, 200);
});

// Chặn form tải lại trang khi bấm Enter
document.getElementById('filter-form').addEventListener('submit', (e) => e.preventDefault());

// Bấm một ca ở cột trái -> chọn ca đó, đưa khối AI về trạng thái chờ
shiftListEl.addEventListener('click', (e) => {
  const item = e.target.closest('.item[data-shift-id]');
  if (!item) return;
  state.selectedShiftId = item.dataset.shiftId;
  aiIdle();
  renderAll();
});

// Các nút ở cột phải: một chỗ lắng nghe cho tất cả nút (event delegation)
detailEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn || btn.disabled) return;

  const shift = findShift(state.selectedShiftId);
  const reg = registrations.find((r) => r.id === btn.dataset.regId);

  if (btn.dataset.action === 'assign') {
    const vol = findVolunteer(btn.dataset.volId);
    runAction(() => assign(vol, shift), 'Đã xếp ' + vol.name + ' vào ca.');
  }
  if (btn.dataset.action === 'confirm') {
    runAction(() => {
      if (countFilled(shift.id) >= shift.capacity) throw new Error('Ca đã đủ người.');
      reg.status = 'confirmed';
    }, 'Đã xác nhận.');
  }
  if (btn.dataset.action === 'remove') {
    runAction(() => { reg.status = 'cancelled'; }, 'Đã gỡ khỏi ca.');
  }
});

// Khởi chạy: hiện khung chờ ~0,5 giây (mô phỏng tải dữ liệu) rồi vẽ nội dung
aiIdle();
showLoading(shiftListEl);
showLoading(detailEl);
setTimeout(renderAll, 500);
