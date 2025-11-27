/*Estado y utilidades (LocalStorage)*/
const LS_USERS_KEY   = 'newsportal_users';
const LS_CURRENT_KEY = 'newsportal_current_email';
const API_BASE = 'http://localhost:8080/api';

const loadUsers  = () => JSON.parse(localStorage.getItem(LS_USERS_KEY) || '{}');
const saveUsers  = (users) => localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
const setCurrent = (email)  => localStorage.setItem(LS_CURRENT_KEY, email || '');
const getCurrent = ()       => localStorage.getItem(LS_CURRENT_KEY) || '';

const getInitials = (name='', last='') => {
  const a = name.trim().charAt(0) || '';
  const b = last.trim().charAt(0) || '';
  return (a + b).toUpperCase() || (name || '?').charAt(0).toUpperCase();
};

const fileToBase64 = (file) => new Promise((resolve,reject)=>{
  if(!file) return resolve('');
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// Catálogo de noticias 
/*
const NEWS = {
  '1': { title: 'Ley de Seguridad Ciudadana', anchor: '#news-1' },
  '2': { title: 'Innovación tecnológica',     anchor: '#news-2' },
  '3': { title: 'Elecciones 2025',            anchor: '#news-3' },
};*/



async function cargarUltimasNoticiasSidebar() {
    try {
        const resp = await fetch(`${API_BASE}/noticias/ultimas?max=5`);
        const noticias = await resp.json();

        const ul = document.getElementById("ultimas-noticias-list");
        ul.innerHTML = "";  

        noticias.forEach((noticia, index) => {
            const li = document.createElement("li");
            const anchorId = `news-${index + 1}`; 

            li.innerHTML = `
                <a href="#${anchorId}" class="link-noticia">${noticia.titulo}</a>
            `;

            ul.appendChild(li);
        });

    } catch (err) {
        console.error("Error cargando últimas noticias:", err);
    }
}

  document.addEventListener("DOMContentLoaded", () => {
    cargarUltimasNoticiasSidebar();
});

document.addEventListener('DOMContentLoaded', () => {
  // Navbar / usuario
  const loginBtn      = document.getElementById('loginBtn');
  const registerBtn   = document.getElementById('registerBtn');
  const userMenu      = document.getElementById('userMenu');
  const userAvatarImg = document.getElementById('userAvatar');
  const userInitials  = document.getElementById('userInitials');
  const userNameSpan  = document.getElementById('userName');

  // Modelos
  const loginModal    = document.getElementById('loginModal');
  const closeLogin    = document.getElementById('closeLogin');
  const loginForm     = document.getElementById('loginForm');
  const loginEmail    = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const goRegister    = document.getElementById('goRegister');

  const registerModal = document.getElementById('registerModal');
  const closeRegister = document.getElementById('closeRegister');
  const registerForm  = document.getElementById('registerForm');
  const regName       = document.getElementById('regName');
  const regLast       = document.getElementById('regLast');
  const regEmail      = document.getElementById('regEmail');
  const regPassword   = document.getElementById('regPassword');
  const regPhoto      = document.getElementById('regPhoto');

  const profileModal  = document.getElementById('profileModal');
  const closeProfile  = document.getElementById('closeProfile');
  const profileForm   = document.getElementById('profileForm');
  const profName      = document.getElementById('profName');
  const profLast      = document.getElementById('profLast');
  const profEmail     = document.getElementById('profEmail');
  const profPhoto     = document.getElementById('profPhoto');
  const logoutBtn     = document.getElementById('logoutBtn');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileInit   = document.getElementById('profileInitials');

  
  const savedListUL   = document.getElementById('savedList');

 
  const show  = (el) => el && (el.style.display = '');
  const hide  = (el) => el && (el.style.display = 'none');
  const open  = (m)  => m && m.classList.add('active');
  const close = (m)  => m && m.classList.remove('active');

  const ensureUserState = (u) => {
    u.ratings = u.ratings || {};  
    u.saved   = Array.isArray(u.saved) ? u.saved : [];
    return u;
  };

  const currentUser = () => {
    const email = getCurrent();
    if (!email) return null;
    const users = loadUsers();
    return users[email] ? ensureUserState(users[email]) : null;
  };

  /* -------------------- NAVBAR -------------------- */
  function refreshNavbar() {
    const email = getCurrent();
    if (!email) {
      show(loginBtn); show(registerBtn); hide(userMenu);
      return;
    }
    const users = loadUsers();
    let u = users[email];
    if (!u) { setCurrent(''); refreshNavbar(); return; }
    u = ensureUserState(u);

    userNameSpan.textContent = ((u.name || '') + ' ' + (u.last || '')).trim();
    if (u.photo) {
      userAvatarImg.src = u.photo;
      userAvatarImg.style.display = 'block';
      userInitials.style.display = 'none';
    } else {
      userAvatarImg.style.display = 'none';
      userInitials.textContent = getInitials(u.name, u.last);
      userInitials.style.display = 'block';
    }
    hide(loginBtn); hide(registerBtn); show(userMenu);
  }

  function loadProfile() {
    const u = currentUser();
    if (!u) return;
    profName.value  = u.name || '';
    profLast.value  = u.last || '';
    profEmail.value = u.email || '';
    if (u.photo) {
      profileAvatar.src = u.photo;
      profileAvatar.style.display = 'block';
      profileInit.style.display = 'none';
    } else {
      profileAvatar.style.display = 'none';
      profileInit.textContent = getInitials(u.name, u.last);
      profileInit.style.display = 'flex';
    }
  }

  /* -------------------- MODELOS -------------------- */
  loginBtn?.addEventListener('click', (e)=>{ e.preventDefault(); open(loginModal); });
  registerBtn?.addEventListener('click', (e)=>{ e.preventDefault(); open(registerModal); });

  closeLogin?.addEventListener('click', ()=> close(loginModal));
  closeRegister?.addEventListener('click', ()=> close(registerModal));
  closeProfile?.addEventListener('click', ()=> close(profileModal));

  window.addEventListener('click', (e)=>{
    if (e.target === loginModal) close(loginModal);
    if (e.target === registerModal) close(registerModal);
    if (e.target === profileModal) close(profileModal);
  });
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){ close(loginModal); close(registerModal); close(profileModal); }
  });

  userMenu?.addEventListener('click', ()=>{
    loadProfile();
    open(profileModal);
  });

  goRegister?.addEventListener('click', (e)=>{
    e.preventDefault();
    close(loginModal);
    open(registerModal);
  });

  /* -------------------- REGISTRO / LOGIN / PERFIL -------------------- */
  registerForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const users = loadUsers();
    const email = regEmail.value.trim().toLowerCase();
    if (users[email]) { alert('Ese correo ya está registrado.'); return; }
    const photo64 = await fileToBase64(regPhoto.files[0]);
    users[email] = ensureUserState({
      name: regName.value.trim(),
      last: regLast.value.trim(),
      email,
      pass: regPassword.value, 
      photo: photo64 || ''
    });
    saveUsers(users);
    setCurrent(email);
    close(registerModal);
    refreshNavbar();
    refreshRatingsUI();
    refreshSavedUI();
  });

  loginForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const pass  = loginPassword.value;
    const users = loadUsers();
    const u = users[email];
    if (!u || u.pass !== pass) { alert('Correo o contraseña incorrectos.'); return; }
    setCurrent(email);
    close(loginModal);
    refreshNavbar();
    refreshRatingsUI();
    refreshSavedUI();
  });

  profileForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = getCurrent();
    const users = loadUsers();
    const u = users[email]; if (!u) return;
    u.name = profName.value.trim();
    u.last = profLast.value.trim();
    const newPhoto = await fileToBase64(profPhoto.files[0]);
    if (newPhoto) u.photo = newPhoto;
    saveUsers(users);
    refreshNavbar();
    loadProfile();
    alert('Perfil actualizado.');
  });

  logoutBtn?.addEventListener('click', ()=>{
    setCurrent('');
    refreshNavbar();
    refreshRatingsUI();
    refreshSavedUI();
    close(profileModal);
  });

  /* -------------------- CALIFICACIONES -------------------- */
  function setCardRatingUI(newsId, value) {
    const card  = document.querySelector('.card[data-id="${newsId}"]');
    if (!card) return;
    const stars = card.querySelectorAll('.star');
    const label = card.querySelector('#rating-${newsId}');
    stars.forEach(s => {
      const v = Number(s.dataset.value);
      s.classList.toggle('active', v <= value);
    });
    if (label) label.textContent = ('${value || 0}');
  }

  function refreshRatingsUI() {
    const u = currentUser();
    document.querySelectorAll('.card').forEach(card=>{
      const id = card.dataset.id;
      const value = u?.ratings?.[id] || 0;
      setCardRatingUI(id, value);
    });
  }

  /* -------------------- NOTICIAS GUARDADAS -------------------- */


  function isSaved(u, newsId) {
    return !!(u && Array.isArray(u.saved) && u.saved.includes(newsId));
  }

  function refreshSaveButtonsUI() {
    const u = currentUser();
    document.querySelectorAll('.save-btn').forEach(btn=>{
      const newsId = btn.dataset.save;
      const saved = isSaved(u, newsId);
      btn.classList.toggle('saved', saved);
      btn.textContent = saved ? '✓ Guardada' : '📎 Guardar';
    });
  }

  function refreshSavedUI() {
    const u = currentUser();
    if (!savedListUL) return;
    savedListUL.innerHTML = '';
    if (!u || !u.saved || u.saved.length === 0) {
      savedListUL.innerHTML = '<li class="muted small">No tienes guardados aún.</li>';
      return;
    }
    u.saved.forEach(id=>{
      const meta = NEWS[id];
      if (!meta) return;
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = meta.anchor || ('#news-${id}');
      a.textContent = meta.title;
      li.appendChild(a);
      savedListUL.appendChild(li);
    });
  }

  document.addEventListener('click', (e) => {
    const target = e.target;

    // 1) Calificaciones
    if (target.classList.contains('star')) {
      const card   = target.closest('.card');
      const newsId = card?.dataset.id;
      const value  = Number(target.dataset.value);
      const email  = getCurrent();

      if (!newsId || !value) return;
      if (!email) { alert('Inicia sesión para calificar.'); return; }

      const users = loadUsers();
      const u = ensureUserState(users[email] || {});
      u.ratings[newsId] = value;
      users[email] = u;
      saveUsers(users);

      setCardRatingUI(newsId, value);
      return;
    }

    // 2) GUARDAR  / Guardada
    if (target.classList.contains('save-btn')) {
      const newsId = target.dataset.save;
      const email  = getCurrent();
      if (!newsId) return;
      if (!email) { alert('Inicia sesión para guardar noticias.'); return; }

      const users = loadUsers();
      const u = ensureUserState(users[email] || {});
      if (isSaved(u, newsId)) {
        u.saved = u.saved.filter(id => id !== newsId);
      } else {
        u.saved.push(newsId);
      }
      users[email] = u;
      saveUsers(users);

      refreshSaveButtonsUI();
      refreshSavedUI();
      return;
    }
  });



  /* -------------------- INIT -------------------- */
  refreshNavbar();
  refreshRatingsUI();
  refreshSaveButtonsUI();
  refreshSavedUI();
});