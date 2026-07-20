(function() {
  const session = localStorage.getItem('campuscare_user');
  if (!session) {
    window.location.href = '/index.html';
    return;
  }
  const user = JSON.parse(session);
  // Determine current folder from URL
  const path = window.location.pathname;
  const folder = path.split('/').slice(-2, -1)[0];
  if (folder && folder !== user.role) {
    window.location.href = '../index.html';
    return;
  }
  // Populate user chip if exists
  document.addEventListener('DOMContentLoaded', function() {
    const nameEl = document.querySelector('.user-meta strong');
    const roleEl = document.querySelector('.user-meta small');
    const avatarEl = document.querySelector('.user-chip .avatar');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (avatarEl) avatarEl.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  });
})();

function logout() {
  localStorage.removeItem('campuscare_user');
  window.location.href = '/index.html';
}