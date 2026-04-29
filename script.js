function updateClock() {
  const el = document.getElementById('topbarTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

setInterval(updateClock, 1000);
updateClock();

const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const pathEl = document.getElementById('topbarPath');

const pathMap = {
  encrypt: '// encrypt-message //',
  decrypt: '// decrypt-message //',
  report: '// report-bug //',
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

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const overlay = document.getElementById('overlay');

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
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'X';
    } else {
      input.type = 'password';
      btn.textContent = 'V';
    }
  });
});

const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const code = document.getElementById('generatedId').textContent;
    if (!code || code === '-') return;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
    });
  });
}

function generateId() {
  return 'ENC_' + Math.random().toString(36).substring(2, 15).toUpperCase() + '_' + Date.now();
}

function encryptMessage(message, password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const binaryString = String.fromCharCode.apply(null, data);
  return btoa(binaryString);
}

document.getElementById('encryptBtn').addEventListener('click', async () => {
  const msg = document.getElementById('encryptMsg').value.trim();
  const pass = document.getElementById('encryptPass').value.trim();
  
  if (!msg) {
    shake(document.getElementById('encryptMsg'));
    return;
  }

  showLoader('encryptBtn', true);
  
  try {
    const messageId = generateId();
    const encryptedMessage = encryptMessage(msg, pass);
    
    const messageData = {
      message: encryptedMessage,
      password: pass || null,
      timestamp: Date.now(),
      encrypted: true
    };

    await database.ref('messages/' + messageId).set(messageData);

    showLoader('encryptBtn', false);
    document.getElementById('generatedId').textContent = messageId;
    document.getElementById('encryptResult').classList.remove('hidden');
    
    document.getElementById('encryptMsg').value = '';
    document.getElementById('encryptPass').value = '';
    
  } catch (error) {
    showLoader('encryptBtn', false);
    alert('Error: ' + error.message);
  }
});

document.getElementById('decryptBtn').addEventListener('click', async () => {
  const id = document.getElementById('decryptId').value.trim();
  const pass = document.getElementById('decryptPass').value.trim();

  if (!id) {
    shake(document.getElementById('decryptId'));
    return;
  }

  showLoader('decryptBtn', true);

  try {
    const snapshot = await database.ref('messages/' + id).get();

    if (!snapshot.exists()) {
      showLoader('decryptBtn', false);
      shake(document.getElementById('decryptId'));
      alert('No message found for that ID.');
      return;
    }

    const data = snapshot.val();

    if (data.password && data.password !== pass) {
      showLoader('decryptBtn', false);
      shake(document.getElementById('decryptPass'));
      alert('Incorrect password.');
      return;
    }

    const decoded = atob(data.message);
    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
    const originalMessage = new TextDecoder().decode(bytes);

    showLoader('decryptBtn', false);
    document.getElementById('decryptedMsg').textContent = originalMessage;
    document.getElementById('decryptResult').classList.remove('hidden');

  } catch (error) {
    showLoader('decryptBtn', false);
    alert('Error: ' + error.message);
  }
});

document.getElementById('reportBtn').addEventListener('click', () => {
  const title = document.getElementById('bugTitle').value.trim();
  const desc = document.getElementById('bugDesc').value.trim();
  
  if (!title) {
    shake(document.getElementById('bugTitle'));
    return;
  }
  if (!desc) {
    shake(document.getElementById('bugDesc'));
    return;
  }
  
  showLoader('reportBtn', true);
  setTimeout(() => {
    showLoader('reportBtn', false);
    document.getElementById('reportResult').classList.remove('hidden');
    document.getElementById('bugTitle').value = '';
    document.getElementById('bugDesc').value = '';
  }, 1200);
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  document.getElementById('decryptResult').classList.add('hidden');
  document.getElementById('decryptedMsg').textContent = '';
  document.getElementById('decryptId').value = '';
  document.getElementById('decryptPass').value = '';
});

function showLoader(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  el.focus();
}

document.querySelectorAll('.severity-opt input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.severity-opt').forEach(opt => {
      opt.classList.remove('checked');
    });
    radio.parentElement.classList.add('checked');
  });
});

document.querySelector('.severity-opt').classList.add('checked');