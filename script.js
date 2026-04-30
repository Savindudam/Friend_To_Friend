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

function encryptMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const binaryString = String.fromCharCode.apply(null, data);
  return btoa(binaryString);
}

function decryptMessage(encoded) {
  const binaryString = atob(encoded);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
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
    const encryptedMessage = encryptMessage(msg);

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

let currentDecryptedId = null;

document.getElementById('decryptBtn').addEventListener('click', async () => {
  const id = document.getElementById('decryptId').value.trim();
  const pass = document.getElementById('decryptPass').value.trim();

  if (!id) {
    shake(document.getElementById('decryptId'));
    return;
  }

  showLoader('decryptBtn', true);
  document.getElementById('decryptResult').classList.add('hidden');
  currentDecryptedId = null;

  try {
    const snapshot = await database.ref('messages/' + id).once('value');

    if (!snapshot.exists()) {
      showLoader('decryptBtn', false);
      alert('No message found with that ID.');
      return;
    }

    const data = snapshot.val();

    if (data.password && data.password !== pass) {
      showLoader('decryptBtn', false);
      shake(document.getElementById('decryptPass'));
      alert('Incorrect password.');
      return;
    }

    const plainText = decryptMessage(data.message);

    showLoader('decryptBtn', false);
    currentDecryptedId = id;
    document.getElementById('decryptedMsg').textContent = plainText;
    document.getElementById('decryptResult').classList.remove('hidden');

  } catch (error) {
    showLoader('decryptBtn', false);
    alert('Error: ' + error.message);
  }
});

document.getElementById('deleteBtn').addEventListener('click', async () => {
  if (!currentDecryptedId) return;

  try {
    await database.ref('messages/' + currentDecryptedId).remove();
    currentDecryptedId = null;
    document.getElementById('decryptResult').classList.add('hidden');
    document.getElementById('decryptId').value = '';
    document.getElementById('decryptPass').value = '';
  } catch (error) {
    alert('Error deleting message: ' + error.message);
  }
});

document.getElementById('reportBtn').addEventListener('click', async () => {
  const title = document.getElementById('bugTitle').value.trim();
  const desc = document.getElementById('bugDesc').value.trim();
  const severity = document.querySelector('input[name="severity"]:checked').value;

  if (!title) {
    shake(document.getElementById('bugTitle'));
    return;
  }
  if (!desc) {
    shake(document.getElementById('bugDesc'));
    return;
  }

  showLoader('reportBtn', true);

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '[' + severity.toUpperCase() + '] ' + title,
          description: desc,
          color: severity === 'critical' ? 0xe0425a : severity === 'high' ? 0xf0a500 : severity === 'medium' ? 0xf5c518 : 0x00e5a0,
          timestamp: new Date().toISOString()
        }]
      })
    });

    showLoader('reportBtn', false);
    document.getElementById('reportResult').classList.remove('hidden');
    document.getElementById('bugTitle').value = '';
    document.getElementById('bugDesc').value = '';

  } catch (error) {
    showLoader('reportBtn', false);
    alert('Error: ' + error.message);
  }
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