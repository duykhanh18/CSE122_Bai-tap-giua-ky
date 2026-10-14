/* =====================================================
   data.js – DỮ LIỆU MẪU (lấy từ assets/data/seed.js của dự án)
   Chỉ chứa dữ liệu và hằng số, không có xử lý.
   ===================================================== */

const skills = {
  s1: 'Giảng dạy', s2: 'Sơ cấp cứu', s3: 'Truyền thông', s4: 'Nấu ăn', s5: 'Lái xe',
  s6: 'Tổ chức sự kiện', s7: 'Thiết kế', s8: 'Ngoại ngữ', s9: 'Thể lực tốt'
};

// Ngày dạng "yyyy-mm-dd" cách hôm nay n ngày (để ca luôn là ngày sắp tới)
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Hoạt động (chỉ cần tên để hiển thị)
const opportunities = {
  p1: 'Trồng cây ven sông Hồng',
  p2: 'Lớp học tiếng Anh cho trẻ em vùng cao',
  p3: 'Bữa cơm yêu thương cuối tuần'
};

// Tình nguyện viên. availability: thứ -> các buổi rảnh (morning / afternoon / evening)
const volunteers = [
  { id: 'v1', name: 'Nguyễn Thị Lan', skills: ['s1', 's3', 's8'], hours: 36,
    bio: 'Sinh viên năm 3, thích hoạt động môi trường và dạy học cho trẻ em.',
    availability: { sat: ['morning', 'afternoon'], sun: ['morning'], wed: ['evening'] } },
  { id: 'v2', name: 'Phạm Quang Minh', skills: ['s2', 's5', 's9'], hours: 58,
    bio: 'Điều dưỡng, có chứng chỉ sơ cấp cứu.',
    availability: { sat: ['morning', 'afternoon', 'evening'], sun: ['morning', 'afternoon'], fri: ['evening'] } },
  { id: 'v3', name: 'Lê Thị Hoa', skills: ['s4', 's6'], hours: 20,
    bio: 'Đầu bếp nghiệp dư, thích nấu ăn từ thiện.',
    availability: { sun: ['morning', 'afternoon'], sat: ['morning'] } },
  { id: 'v4', name: 'Vũ Anh Đức', skills: ['s7'], hours: 5,
    bio: '',
    availability: {} }
];

// Các ca đang mở
const shifts = [
  { id: 'sh1',  oppId: 'p1', date: addDays(3),  start: '07:00', end: '11:00', capacity: 20, requiredSkills: ['s9'] },
  { id: 'sh2',  oppId: 'p1', date: addDays(10), start: '07:00', end: '11:00', capacity: 20, requiredSkills: ['s9', 's6'] },
  { id: 'sh3',  oppId: 'p2', date: addDays(4),  start: '19:00', end: '20:30', capacity: 6,  requiredSkills: ['s1', 's8'] },
  { id: 'sh4',  oppId: 'p2', date: addDays(11), start: '19:00', end: '20:30', capacity: 6,  requiredSkills: ['s1', 's8'] },
  { id: 'sh5',  oppId: 'p3', date: addDays(5),  start: '08:00', end: '12:00', capacity: 8,  requiredSkills: ['s4'] },
  { id: 'sh6',  oppId: 'p3', date: addDays(6),  start: '08:00', end: '12:00', capacity: 8,  requiredSkills: ['s4', 's5'] },
  { id: 'sh10', oppId: 'p3', date: addDays(2),  start: '15:00', end: '18:00', capacity: 4,  requiredSkills: ['s5'] }
];

// Đăng ký. status: 'pending' (chờ duyệt) | 'confirmed' (đã xác nhận) | 'cancelled' (đã gỡ)
let registrations = [
  { id: 'r1', shiftId: 'sh1',  volunteerId: 'v1', status: 'confirmed' },
  { id: 'r2', shiftId: 'sh3',  volunteerId: 'v1', status: 'pending' },
  { id: 'r5', shiftId: 'sh1',  volunteerId: 'v2', status: 'confirmed' },
  { id: 'r6', shiftId: 'sh1',  volunteerId: 'v3', status: 'pending' },
  { id: 'r7', shiftId: 'sh5',  volunteerId: 'v3', status: 'confirmed' }
];
let nextRegId = 100;

// Bộ trọng số (kỹ năng / lịch / kinh nghiệm) – mỗi lần "Tạo lại" AI dùng bộ tiếp theo
const WEIGHTS = [
  { skill: 0.6, time: 0.3, exp: 0.1 },
  { skill: 0.3, time: 0.6, exp: 0.1 },
  { skill: 0.8, time: 0.1, exp: 0.1 }
];


/* Hằng số tên ngày / buổi để hiển thị */
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_VI = { mon: 'Thứ Hai', tue: 'Thứ Ba', wed: 'Thứ Tư', thu: 'Thứ Năm', fri: 'Thứ Sáu', sat: 'Thứ Bảy', sun: 'Chủ nhật' };
const SESSION_VI = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };
