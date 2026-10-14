/* =====================================================
   ai.js – KHỐI "AI GỢI Ý ĐỘI HÌNH"
   Luồng: chờ → đang xử lý → kết quả (+ "Vì sao?") →
   Chấp nhận / Sửa trọng số / Từ chối / Tạo lại / Lưu.
   (Hàm tính đề xuất buildSuggestion nằm ở matching.js)
   ===================================================== */

const aiRoot     = document.getElementById('ai-root');
const weightDlg  = document.getElementById('weight-dialog');
const weightForm = document.getElementById('weight-form');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Trạng thái chờ ban đầu
function aiIdle() {
  state.ai.token++;           // huỷ mọi lượt xử lý đang chạy dở
  state.ai.result = null;
  aiRoot.innerHTML = '<div class="ai-idle mut">Chọn một ca bên trái rồi bấm "Nhờ AI gợi ý" để xem đội hình đề xuất.</div>';
}

// Chạy AI: hiện "đang xử lý" → tính → hiện kết quả hoặc lỗi
async function runAI(attempt) {
  const myToken = ++state.ai.token;
  state.ai.attempt = attempt;
  const steps = ['Đang đọc yêu cầu của ca…', 'Đang chấm điểm từng tình nguyện viên…', 'Đang chọn đội hình tối ưu…'];

  aiRoot.innerHTML =
    '<div class="ai-card" role="status" aria-label="AI đang xử lý">' +
      '<div class="ai-h"><span class="badge ai">✨ AI đang xử lý</span></div>' +
      '<div class="bar"><span id="ai-progress" style="width:5%"></span></div>' +
      '<p class="mut" id="ai-step">' + steps[0] + '</p>' +
      '<div class="skeleton"></div>' +
    '</div>';

  for (let i = 0; i < steps.length; i++) {
    if (myToken !== state.ai.token) return;           // người dùng đã đổi ca / bấm lại
    document.getElementById('ai-step').textContent = steps[i];
    document.getElementById('ai-progress').style.width = Math.round((i + 1) / steps.length * 100) + '%';
    await wait(450);
  }
  if (myToken !== state.ai.token) return;

  const result = buildSuggestion(WEIGHTS[attempt % WEIGHTS.length], attempt);
  showAIResult(result);
}

// Hiện kết quả hoặc thông báo không đủ dữ liệu
function showAIResult(result) {
  if (result.status === 'insufficient') {
    state.ai.result = null;
    aiRoot.innerHTML =
      '<div class="ai-card insufficient" role="alert">' +
        '<div class="ai-h"><span class="badge warn">Không đủ dữ liệu</span></div>' +
        '<p>' + result.message + '</p>' +
        '<div class="ai-actions">' +
          '<button type="button" class="btn primary" data-ai="retry">Thử lại</button>' +
          '<button type="button" class="btn" data-ai="manual">Dùng thủ công</button>' +
          '<button type="button" class="btn" data-ai="skip">Bỏ qua</button>' +
          '<button type="button" class="btn" data-ai="report">Báo cáo</button>' +
        '</div>' +
      '</div>';
    return;
  }

  state.ai.result = result;
  const low = result.status === 'uncertain';
  const conf = Math.round(result.confidence * 100);

  let body = '';
  result.items.forEach((x) => {
    const checked = result.selected.includes(x.vol.id);
    body +=
      '<label class="cand' + (checked ? ' sel' : '') + '">' +
        '<input type="checkbox" data-vol-id="' + x.vol.id + '"' + (checked ? ' checked' : '') + '>' +
        '<div class="info"><b>' + x.vol.name + '</b>' +
          '<div class="hint">' + x.sc.why.map((w) => w.detail).join(' · ') + '</div></div>' +
        '<span class="score">' + x.sc.score + '%</span>' +
      '</label>';
  });

  const whyList = result.why.map((w) => '<li class="' + w.tone + '"><b>' + w.label + ': </b>' + w.detail + '</li>').join('');

  aiRoot.innerHTML =
    '<div class="ai-card' + (low ? ' uncertain' : '') + '">' +
      (low ? '<div class="ai-banner warn" role="status">AI chưa chắc chắn về kết quả này (độ tin cậy ' + conf +
        '%). Điểm phù hợp cao nhất còn thấp.</div>' : '') +
      '<div class="ai-h"><span class="badge ai">✨ Volunteer Matcher</span>' +
        '<span class="conf">Độ tin cậy ' + conf + '%</span>' + barHTML(conf, low ? 'warn' : '') + '</div>' +
      '<div>' + body + '</div>' +
      '<details class="why" open><summary>Vì sao có kết quả này?</summary><ul>' + whyList + '</ul></details>' +
      '<div class="ai-actions">' +
        '<button type="button" class="btn primary" data-ai="accept">✔ Chấp nhận</button>' +
        '<button type="button" class="btn" data-ai="edit">✎ Sửa</button>' +
        '<button type="button" class="btn ghost" data-ai="reject">✖ Từ chối</button>' +
        '<button type="button" class="btn" data-ai="regen">↻ Tạo lại</button>' +
        '<button type="button" class="btn" data-ai="save">💾 Lưu</button>' +
        (low ? '<button type="button" class="btn" data-ai="manual">Dùng thủ công</button>' +
               '<button type="button" class="btn" data-ai="report">Báo cáo</button>' : '') +
      '</div>' +
    '</div>';
}

// Chèn một dòng thông báo lên đầu thẻ AI
function aiBanner(kind, text) {
  const card = aiRoot.querySelector('.ai-card');
  const old = card.querySelector('.ai-banner');
  if (old) old.remove();
  card.insertAdjacentHTML('afterbegin', '<div class="ai-banner ' + kind + '" role="status">' + text + '</div>');
}

// Khoá các nút quyết định sau khi chấp nhận / từ chối
function aiLock() {
  aiRoot.querySelectorAll('[data-ai=accept],[data-ai=reject],[data-ai=edit]').forEach((b) => { b.disabled = true; });
}

// Xử lý các nút trong khối AI
function handleAIAction(action) {
  const res = state.ai.result;

  if (action === 'accept') {
    const picked = res.items.filter((x) => res.selected.includes(x.vol.id));
    if (!picked.length) return showToast('Hãy chọn ít nhất một người để xếp.', 'bad');
    try {
      const shift = findShift(state.selectedShiftId);
      picked.forEach((x) => assign(x.vol, shift));
    } catch (e) {
      renderAll();
      return showToast(e.message, 'bad');
    }
    showToast('Đã xếp đội hình AI đề xuất vào ca.');
    aiBanner('ok', '✔ Đã xếp các tình nguyện viên được chọn vào ca.');
    aiLock();
    renderAll();
  }

  if (action === 'reject') {
    showToast('Đã từ chối. AI sẽ không áp dụng kết quả này.');
    aiBanner('bad', 'Bạn đã từ chối kết quả. Có thể tạo lại hoặc dùng thủ công.');
    aiLock();
  }

  if (action === 'save') {
    try { localStorage.setItem('vl_saved_roster_' + state.selectedShiftId, JSON.stringify(res.selected)); } catch (e) { /* bỏ qua */ }
    showToast('Đã lưu đội hình đề xuất cho ca này.');
    aiBanner('info', '💾 Đã lưu kết quả.');
  }

  if (action === 'regen') runAI(state.ai.attempt + 1);
  if (action === 'retry') runAI(state.ai.attempt);
  if (action === 'skip')  aiIdle();
  if (action === 'manual') document.getElementById('detail').scrollIntoView({ behavior: 'smooth' });
  if (action === 'report') showToast('Đã gửi báo cáo cho quản trị viên.');

  if (action === 'edit') {
    // Đặt thanh trượt theo trọng số hiện tại rồi mở modal
    weightForm.elements.skill.value = Math.round(res.weights.skill * 100);
    weightForm.elements.time.value  = Math.round(res.weights.time * 100);
    weightForm.elements.exp.value   = Math.round(res.weights.exp * 100);
    weightDlg.showModal();
  }
}


/* ---------- Sự kiện của khối AI ---------- */

// Nút "Nhờ AI gợi ý đội hình"
document.getElementById('run-ai').addEventListener('click', () => {
  if (!state.selectedShiftId) return showToast('Hãy chọn một ca cần ghép trước.', 'bad');
  runAI(0);
});

// Các nút trong khối AI
aiRoot.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-ai]');
  if (btn && !btn.disabled) handleAIAction(btn.dataset.ai);
});

// Tick / bỏ tick người trong đề xuất của AI
aiRoot.addEventListener('change', (e) => {
  if (!e.target.matches('input[type=checkbox]') || !state.ai.result) return;
  const id = e.target.dataset.volId;
  const list = state.ai.result.selected;
  if (e.target.checked && !list.includes(id)) list.push(id);
  if (!e.target.checked && list.includes(id)) list.splice(list.indexOf(id), 1);
  e.target.closest('.cand').classList.toggle('sel', e.target.checked);
});

// Modal trọng số: kiểm tra hợp lệ trước khi đóng
weightForm.addEventListener('submit', (e) => {
  if (!e.submitter || e.submitter.value !== 'ok') return;   // bấm Hủy / ✕ thì cứ đóng
  const total = +weightForm.elements.skill.value + +weightForm.elements.time.value + +weightForm.elements.exp.value;
  if (total === 0) {
    e.preventDefault();                                     // giữ modal mở
    showToast('Cần ít nhất một trọng số > 0.', 'bad');
  }
});

// Modal đóng bằng "Tính lại" -> tạo lại đề xuất với trọng số mới
weightDlg.addEventListener('close', () => {
  if (weightDlg.returnValue !== 'ok') return;
  weightDlg.returnValue = '';
  const w = {
    skill: +weightForm.elements.skill.value,
    time: +weightForm.elements.time.value,
    exp: +weightForm.elements.exp.value
  };
  showAIResult(buildSuggestion(w, state.ai.attempt));
});
