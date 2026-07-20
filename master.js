
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Active sidebar link (auto-detected from filename) ---------- */
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });

  /* ---------- Sidebar toggle (mobile) ---------- */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  /* ---------- Dropdown menus (bell / user chip) ---------- */
  document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var menu = document.getElementById(btn.dataset.dropdownToggle);
      if (!menu) return;
      var wasOpen = menu.classList.contains('active');
      document.querySelectorAll('.dropdown-menu.active').forEach(function (m) { m.classList.remove('active'); });
      if (!wasOpen) menu.classList.add('active');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-menu.active').forEach(function (m) { m.classList.remove('active'); });
  });

  /* ---------- Modals ---------- */
  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById(btn.dataset.modalOpen);
      if (modal) modal.classList.add('active');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov) ov.classList.remove('active');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(function (m) { m.classList.remove('active'); });
    }
  });

  /* ---------- Tabs that switch panels (data-tab -> data-tab-panel) ---------- */
  document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.tabs');
      group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var target = btn.dataset.tab;
      document.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tabPanel === target);
      });
    });
  });

  /* ---------- Tabs that filter table rows (data-filter -> tr[data-status]) ---------- */
  document.querySelectorAll('.tab-btn[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.tabs');
      group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      var table = document.getElementById(group.dataset.table || 'mainTable');
      if (!table) return;
      table.querySelectorAll('tbody tr').forEach(function (row) {
        var key = row.dataset.type || row.dataset.status || '';
        row.style.display = (f === 'all' || key === f) ? '' : 'none';
      });
    });
  });

  /* ---------- Select filters (data-table-filter + data-filter-attr) ---------- */
  document.querySelectorAll('[data-table-filter]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      var table = document.getElementById(sel.dataset.tableFilter);
      if (!table) return;
      var attr = sel.dataset.filterAttr || 'role';
      var v = sel.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(function (row) {
        row.style.display = (v === 'all' || (row.dataset[attr] || '') === v) ? '' : 'none';
      });
    });
  });

  /* ---------- Table search (topbar search box) ---------- */
  document.querySelectorAll('[data-table-search]').forEach(function (input) {
    input.addEventListener('input', function () {
      var table = document.getElementById(input.dataset.tableSearch);
      if (!table) return;
      var q = input.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    });
  });

  /* ---------- Demo form submit: close modal + toast + reset ---------- */
  document.querySelectorAll('form.js-demo-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var modal = form.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      showToast(form.dataset.toast || 'Saved successfully!', 'success');
      form.reset();
    });
  });

  /* ---------- One-click toast buttons/links (data-toast) ---------- */
  document.querySelectorAll('[data-toast]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (el.tagName === 'A' && (el.getAttribute('href') || '#') === '#') e.preventDefault();
      showToast(el.dataset.toast, el.dataset.toastType || 'success');
    });
  });
});

/* ---------- Toast helper (global) ---------- */
function showToast(message, type) {
  type = type || 'success';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var icons = {
    success: 'fa-circle-check',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
    danger: 'fa-circle-xmark'
  };
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.success) + '"></i><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('hide');
    setTimeout(function () { toast.remove(); }, 300);
  }, 3200);
}