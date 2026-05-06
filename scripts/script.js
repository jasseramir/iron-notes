// ─── Storage Key ────────────────────────────────────────────────────────────

const KEY = 'workout_log_ar';

// ─── localStorage Helpers ────────────────────────────────────────────────────

/**
 * Load all exercises from localStorage.
 * @returns {Array} Array of exercise objects.
 */
function load() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Save an array of exercises to localStorage.
 * @param {Array} data - Array of exercise objects to persist.
 */
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str - Raw string to escape.
 * @returns {string} HTML-safe string.
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Build the inner HTML for an editable table cell.
 * Shows the value if present, or a dash placeholder if empty.
 * @param {number} index - Row index in the data array.
 * @param {string} field - Field name: 'sets' or 'reps'.
 * @param {string} val   - Current value of the field.
 * @returns {string} HTML string for the cell content.
 */
function cellHTML(index, field, val) {
  const hasVal = val !== '' && val !== null && val !== undefined;
  return hasVal
    ? `<span class="cell-value" onclick="startEdit(${index},'${field}',this)">${esc(val)}</span>`
    : `<span class="cell-value empty-val" onclick="startEdit(${index},'${field}',this)">—</span>`;
}

// ─── Render ──────────────────────────────────────────────────────────────────

/**
 * Re-render the full exercise table from localStorage data.
 * Shows the empty-state message and hides action buttons when no data exists.
 */
function render() {
  const data       = load();
  const wrapper    = document.getElementById('table-wrapper');
  const actionBtns = document.getElementById('action-btns');

  if (data.length === 0) {
    wrapper.innerHTML = '<p class="empty">لا توجد تمارين حتى الآن — أضف تمريناً من الأعلى.</p>';
    actionBtns.style.display = 'none';
    swapMargins();
    return;
  }

  actionBtns.style.display = 'flex';

  let html = `
    <table>
      <thead>
        <tr>
          <th class="num-col">#</th>
          <th>التمرين</th>
          <th class="num-col">المجموعات</th>
          <th class="num-col">التكرارات</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((ex, i) => {
    html += `
      <tr data-index="${i}">
        <td class="num-col">${i + 1}</td>
        <td class="exercise-name">${esc(ex.name)}</td>
        <td class="editable-cell" id="cell-sets-${i}">${cellHTML(i, 'sets', ex.sets)}</td>
        <td class="editable-cell" id="cell-reps-${i}">${cellHTML(i, 'reps', ex.reps)}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  wrapper.innerHTML = html;
  swapMargins();
}

// ─── Inline Edit ─────────────────────────────────────────────────────────────

/**
 * Replace a cell's display span with an <input> for inline editing.
 * Commits the new value on blur or Enter, cancels on Escape.
 * @param {number} index  - Row index in the data array.
 * @param {string} field  - Field name: 'sets' or 'reps'.
 * @param {Element} spanEl - The clicked span element.
 */
function startEdit(index, field, spanEl) {
  const cell       = spanEl.parentElement;
  const data       = load();
  const currentVal = data[index][field] ?? '';

  const input    = document.createElement('input');
  input.type     = 'number';
  input.className = 'inline-edit';
  input.value    = currentVal;
  input.min      = 0;

  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();
  input.select();

  let committed = false;

  function commit() {
    if (committed) return;
    committed = true;
    const val = input.value.trim();
    data[index][field] = val !== '' ? val : '';
    save(data);
    render();
  }

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { commit(); }
    if (e.key === 'Escape') { committed = true; render(); }
  });
}

// ─── Add Exercise ─────────────────────────────────────────────────────────────

let timeId;

/**
 * Read form inputs, validate, push a new exercise to localStorage, and re-render.
 * Requires at minimum an exercise name; sets and reps are optional.
 */
function addExercise() {
  const nameEl = document.getElementById('input-name');
  const setsEl = document.getElementById('input-sets');
  const repsEl = document.getElementById('input-reps');
  const notiEl = document.getElementById('notification');

  const name = nameEl.value.trim();
  const sets = setsEl.value.trim();
  const reps = repsEl.value.trim();

  if (!name) {
    nameEl.focus();
    return;
  }

  const data = load();
  clearTimeout(timeId);
  
  for (const datium of data) {
    if (datium?.name === name) {
      nameEl.value = '';
      notiEl.textContent = 'هذا التمرين قد تم إضافته من قبل.';
      notiEl.style.display = 'block';
      swapMargins();
      
      timeId = setTimeout(() => {
        notiEl.style.display = 'none';
        notiEl.textContent = '';
        swapMargins();
      }, 3000);
      
      return;
    }
  }
  
  notiEl.style.display = 'none';
  notiEl.textContent = '';
  
  data.push({ name, sets: sets || '', reps: reps || '' });
  save(data);
  render();

  nameEl.value = '';
  setsEl.value = '';
  repsEl.value = '';
  nameEl.focus();
}

// ─── Swapping Margins ──────────────────────────────────────────────────────────

/**
 * Adjust the form's bottom margin based on what is currently visible below it.
 *
 * Priority (highest → lowest):
 *  1. No exercises at all  → 0px  (empty state, nothing below the form)
 *  2. Notification visible → 0px  (notification sits directly below)
 *  3. Table is present     → 36px (normal gap before the table)
 */
function swapMargins() {
  const data = load();
  const form = document.querySelector('.add-form');
  const noti = document.getElementById('notification');
  const notiVisible = noti && window.getComputedStyle(noti).display !== 'none';

  if (!form) return;

  if (notiVisible || data.length === 0) {
    form.style.marginBottom = '0px';
    return;
  }

  form.style.marginBottom = '36px';
}

// ─── Clear & Delete ───────────────────────────────────────────────────────────

/**
 * Clear the sets and reps values for all exercises while keeping exercise names.
 * Values become editable again via inline click-to-edit.
 */
function clearInfo() {
  const data    = load();
  const updated = data.map(ex => ({ ...ex, sets: '', reps: '' }));
  save(updated);
  render();
}

/**
 * Remove all exercise data from localStorage and reset the UI.
 */
function deleteTable() {
  localStorage.removeItem(KEY);
  render();
}

// ─── Enter Key Support ────────────────────────────────────────────────────────

['input-name', 'input-sets', 'input-reps'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') addExercise();
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────────

render();
