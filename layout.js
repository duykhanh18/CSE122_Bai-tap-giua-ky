/* =====================================================
   layout.js – KHUNG TRANG: menu ☰, chế độ sáng/tối, đăng xuất
   ===================================================== */

const menuBtn   = document.getElementById('menu-btn');
const sidebarEl = document.getElementById('sidebar');
const scrimEl   = document.getElementById('scrim');

// Chuyển chế độ sáng / tối và nhớ lựa chọn
document.getElementById('theme-btn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('vl_theme', next); } catch (e) { /* bỏ qua */ }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  showToast('Đây là bản demo một trang – chức năng đăng xuất thuộc trang đăng nhập.');
});

// Menu ☰ trên tablet/mobile
function toggleMenu(open) {
  const isOpen = open !== undefined ? open : !sidebarEl.classList.contains('open');
  sidebarEl.classList.toggle('open', isOpen);
  scrimEl.classList.toggle('on', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
}
menuBtn.addEventListener('click', () => toggleMenu());
scrimEl.addEventListener('click', () => toggleMenu(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
