/* =====================================================
   utils.js – HÀM TIỆN ÍCH CHUNG
   Tra cứu dữ liệu, định dạng ngày giờ, tìm kiếm không dấu,
   và các mảnh giao diện nhỏ (toast, thanh tiến độ, nhãn, khung chờ).
   ===================================================== */

const findShift = (id) => shifts.find((s) => s.id === id);
const findVolunteer = (id) => volunteers.find((v) => v.id === id);
const skillNames = (ids) => ids.map((id) => skills[id]).filter(Boolean);

// "2026-10-16" -> "16/10/2026"
function fmtDate(iso) {
  const p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

// "16/10/2026 · 07:00–11:00"
function fmtShift(s) {
  return fmtDate(s.date) + ' · ' + s.start + '–' + s.end;
}

// Bỏ dấu tiếng Việt + chữ thường, để gõ "trong cay" vẫn tìm ra "Trồng cây"
function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

const dayKey = (iso) => DAYS[new Date(iso + 'T00:00:00').getDay()];

// Giờ bắt đầu -> buổi trong ngày
function sessionOf(time) {
  const hour = parseInt(time.slice(0, 2), 10);
  return hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
}

// "07:30" -> 450 (phút) để so sánh giờ
const minutes = (t) => parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3, 5), 10);

// Hai ca có trùng giờ không? (cùng ngày và khoảng giờ chồng nhau)
function isOverlap(a, b) {
  return a.date === b.date && minutes(a.start) < minutes(b.end) && minutes(b.start) < minutes(a.end);
}


/* ---------- Mảnh giao diện nhỏ ---------- */

// Toast: thông báo nhỏ ở góc dưới bên phải, tự mất sau 3,8 giây
function showToast(message, type) {
  const el = document.createElement('div');
  el.className = 'toast ' + (type || 'ok');
  el.setAttribute('role', type === 'bad' ? 'alert' : 'status');
  el.textContent = message;
  document.getElementById('toast-region').append(el);
  setTimeout(() => el.remove(), 3800);
}

// Thanh tiến độ (HTML dạng chuỗi)
function barHTML(percent, tone) {
  const p = Math.max(0, Math.min(100, percent));
  return '<div class="bar ' + (tone || '') + '" role="img" aria-label="' + p + '%"><span style="width:' + p + '%"></span></div>';
}

// Nhãn trạng thái đăng ký
function statusBadge(status) {
  return status === 'confirmed'
    ? '<span class="badge ok">Đã xác nhận</span>'
    : '<span class="badge warn">Chờ duyệt</span>';
}

// Khung chờ / trạng thái rỗng
function showLoading(box) {
  box.innerHTML = '<div class="skeleton-wrap" role="status" aria-label="Đang tải dữ liệu">' +
    '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>';
}
function showEmpty(box, icon, title, message) {
  box.innerHTML = '<div class="state" role="status"><div class="state-i" aria-hidden="true">' + icon + '</div>' +
    '<h3>' + title + '</h3><p class="mut">' + message + '</p></div>';
}
