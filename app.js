function updateClock() {
  const el = document.getElementById('topbarTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

const navItems = document.querySelectorAll('.nav-item');
const panels   = document.querySelectorAll('.panel');
const pathEl   = document.getElementById('topbarPath');

const pathMap = {
  encrypt: '// encrypt-message //',
  decrypt: '// decrypt-message //',
  report:  '// report-bug //',
};

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.panel;

    navItems.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('panel-' + target).classList.add('active');

    if (pathEl) pathEl.textContent = pathMap[target] || ('// ' + target);

    closeSidebar();
  });
});

const sidebar    = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const overlay    = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
});

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
}

document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const img = btn.querySelector('.eye-icon');
    if (input.type === 'password') {
      input.type = 'text';
      img.src = 'pics/close.png';
      img.alt = 'hide password';
    } else {
      input.type = 'password';
      img.src = 'pics/open.png';
      img.alt = 'show password';
    }
  });
});

const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const code = document.getElementById('generatedId').textContent;
    if (!code || code === '-') return;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy ID'; }, 2000);
    });
  });
}

document.getElementById('encryptBtn').addEventListener('click', () => {
  const msg = document.getElementById('encryptMsg').value.trim();
  if (!msg) return shake(document.getElementById('encryptMsg'));
  showLoader('encryptBtn', true);
  setTimeout(() => {
    showLoader('encryptBtn', false);
    document.getElementById('generatedId').textContent = 'FIREBASE_ID_HERE';
    document.getElementById('encryptResult').classList.remove('hidden');
  }, 800);
});

document.getElementById('decryptBtn').addEventListener('click', () => {
  const id = document.getElementById('decryptId').value.trim();
  if (!id) return shake(document.getElementById('decryptId'));
  showLoader('decryptBtn', true);
  setTimeout(() => {
    showLoader('decryptBtn', false);
    document.getElementById('decryptedMsg').textContent = 'Your decrypted message will appear here once Firebase is connected.';
    document.getElementById('decryptResult').classList.remove('hidden');
  }, 800);
});

document.getElementById('reportBtn').addEventListener('click', () => {
  const title = document.getElementById('bugTitle').value.trim();
  const desc  = document.getElementById('bugDesc').value.trim();
  if (!title) return shake(document.getElementById('bugTitle'));
  if (!desc)  return shake(document.getElementById('bugDesc'));
  showLoader('reportBtn', true);
  setTimeout(() => {
    showLoader('reportBtn', false);
    document.getElementById('reportResult').classList.remove('hidden');
    document.getElementById('bugTitle').value = '';
    document.getElementById('bugDesc').value  = '';
  }, 800);
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  document.getElementById('decryptResult').classList.add('hidden');
  document.getElementById('decryptId').value = '';
});

function showLoader(btnId, loading) {
  const btn    = document.getElementById(btnId);
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  text.classList.toggle('hidden', loading);
  loader.classList.toggle('hidden', !loading);
  btn.disabled = loading;
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  el.focus();
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }';
document.head.appendChild(shakeStyle);