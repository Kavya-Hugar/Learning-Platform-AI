// ===== STATE =====
const S = {
  user: null,
  enrollments: new Set(),
  progress: {},
  currentCourse: null,
  currentVid: null,
  simTimer: null,
  catFilter: 'all',
  searchQ: ''
};

// ===== HELPERS =====
function flatVids(course) {
  const a = [];
  course.sections.forEach(s => s.vids.forEach(v => a.push({ ...v, secId: s.id, cid: course.id })));
  return a;
}
function getCourse(id) { return COURSES.find(c => c.id === id); }
function getVidIdx(cid, vid) { return flatVids(getCourse(cid)).findIndex(v => v.id === vid); }
function isLocked(cid, vid) {
  const idx = getVidIdx(cid, vid);
  if (idx <= 0) return false;
  const all = flatVids(getCourse(cid));
  const prevId = all[idx - 1].id;
  return !S.progress[cid + '_' + prevId]?.completed;
}
function getCPct(cid) {
  const c = getCourse(cid); if (!c) return 0;
  const all = flatVids(c);
  const done = all.filter(v => S.progress[cid + '_' + v.id]?.completed).length;
  return Math.round(done / all.length * 100);
}
function parseDur(d) { const [m, s] = d.split(':').map(Number); return m * 60 + (s || 0); }
function fmtTime(secs) { const m = Math.floor(secs / 60), s = Math.floor(secs % 60); return m + ':' + (s < 10 ? '0' : '') + s; }
function initials(name) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }

// ===== SAVE / LOAD =====
function save() {
  if (!S.user) return;
  try { localStorage.setItem('lf_d_' + S.user.id, JSON.stringify({ progress: S.progress, enrollments: [...S.enrollments] })); } catch (e) {}
}
function load(user) {
  try {
    const d = JSON.parse(localStorage.getItem('lf_d_' + user.id) || '{}');
    S.progress = d.progress || {};
    S.enrollments = new Set(d.enrollments || []);
  } catch (e) { S.progress = {}; S.enrollments = new Set(); }
}

// ===== TOAST =====
function toast(msg, type = 'i') {
  const a = document.getElementById('toastArea');
  const el = document.createElement('div');
  el.className = 'toast t' + type;
  el.textContent = msg;
  a.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3200);
}

// ===== NAV =====
function updateNav() {
  const el = document.getElementById('navR');
  if (S.user) {
    const ini = initials(S.user.name);
    el.innerHTML = `<button class="nbtn" onclick="go('subjects')">Browse</button>
    <div class="av" onclick="toggleDD()" id="navAv">${ini}
      <div class="dd" id="navDD">
        <div class="ddi" onclick="go('profile');closeDD()">👤 My Learning</div>
        <div class="ddsep"></div>
        <div class="ddi danger" onclick="logout()">🚪 Sign out</div>
      </div>
    </div>`;
  } else {
    el.innerHTML = `<button class="nbtn" onclick="go('subjects')">Browse</button>
    <button class="nbtn" onclick="go('login')">Log in</button>
    <button class="nbtn p" onclick="go('register')">Sign up</button>`;
  }
}
function toggleDD() { document.getElementById('navDD')?.classList.toggle('open'); }
function closeDD() { document.getElementById('navDD')?.classList.remove('open'); }
document.addEventListener('click', e => { if (!e.target.closest('#navAv')) closeDD(); });

// ===== ROUTING =====
let curView = 'home';
function go(view, extra) {
  clearSimTimer();
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  curView = view;
  if (view === 'home') renderHome();
  else if (view === 'subjects') renderSubjects();
  else if (view === 'subject' && extra != null) renderSubject(extra);
  else if (view === 'video' && extra != null) renderVideoPage(extra.cid, extra.vid);
  else if (view === 'profile') renderProfile();
  document.querySelector('.view.active')?.scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

// ===== AUTH =====
function doLogin() {
  const email = document.getElementById('lemail').value.trim();
  const pass = document.getElementById('lpass').value;
  const err = document.getElementById('loginErr');
  if (!email || !pass) { showErr(err, 'Please fill in all fields.'); return; }
  const users = getUsers();
  const u = users.find(u => u.email === email && u.pass === pass);
  if (!u) { showErr(err, 'Wrong email or password.'); return; }
  err.style.display = 'none';
  setUser(u);
}
function doRegister() {
  const name = document.getElementById('rname').value.trim();
  const email = document.getElementById('remail').value.trim();
  const pass = document.getElementById('rpass').value;
  const err = document.getElementById('regErr');
  if (!name || !email || !pass) { showErr(err, 'Please fill in all fields.'); return; }
  if (pass.length < 6) { showErr(err, 'Password must be at least 6 characters.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr(err, 'Please enter a valid email.'); return; }
  const users = getUsers();
  if (users.find(u => u.email === email)) { showErr(err, 'This email is already registered.'); return; }
  const u = { id: Date.now(), name, email, pass, joined: new Date().toLocaleDateString() };
  users.push(u);
  try { localStorage.setItem('lf_users', JSON.stringify(users)); } catch (e) {}
  err.style.display = 'none';
  setUser(u);
}
function setUser(u) {
  S.user = u;
  load(u);
  try { localStorage.setItem('lf_sess', JSON.stringify(u)); } catch (e) {}
  updateNav();
  toast('Welcome, ' + u.name.split(' ')[0] + '! 👋', 's');
  go('home');
}
function logout() {
  clearSimTimer();
  save();
  S.user = null; S.enrollments = new Set(); S.progress = {};
  try { localStorage.removeItem('lf_sess'); } catch (e) {}
  updateNav();
  toast('Signed out.', 'i');
  go('home');
}
function getUsers() { try { return JSON.parse(localStorage.getItem('lf_users') || '[]'); } catch (e) { return []; } }
function showErr(el, msg) { el.style.display = 'block'; el.textContent = msg; }

// ===== ENROLL =====
function enroll(cid) {
  if (!S.user) { toast('Sign in to enroll!', 'e'); go('login'); return; }
  S.enrollments.add(cid);
  save();
  toast('Enrolled! Start learning 🚀', 's');
  renderSubject(cid);
}

// ===== HOME =====
function renderHome() {
  renderGrid('homeGrid', COURSES.slice(0, 4));
  if (S.user && S.enrollments.size > 0) {
    document.getElementById('contSec').style.display = 'block';
    renderGrid('contGrid', COURSES.filter(c => S.enrollments.has(c.id)), true);
  } else {
    document.getElementById('contSec').style.display = 'none';
  }
}
function renderGrid(id, list, showProg = false) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = list.map(c => {
    const pct = getCPct(c.id);
    const enrolled = S.enrollments.has(c.id);
    return `<div class="ccard" onclick="go('subject',${c.id})">
      <div class="cthumb" style="background:${c.bg}">${c.emoji}</div>
      <div class="cbody">
        <div class="ccat">${c.cat}</div>
        <div class="ctitle">${c.title}</div>
        <div class="cmeta"><span style="color:var(--accent)">★ ${c.rating}</span><span>(${c.students.toLocaleString()})</span><span>·</span><span>${flatVids(c).length} videos</span></div>
        ${enrolled
          ? `<div class="pbar" style="margin-top:10px"><div class="pfill" style="width:${pct}%"></div></div><div class="plabel">${pct}% complete</div>`
          : `<div class="cprice">$${c.price}</div>`}
      </div>
    </div>`;
  }).join('');
}

// ===== SUBJECTS =====
let catF = 'all', searchQ = '';
function filterCat(cat, btn) {
  catF = cat;
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderSubjects();
}
function onSearch(q) { searchQ = q; if (curView === 'subjects') renderSubjects(); }
function renderSubjects() {
  let list = COURSES;
  if (catF !== 'all') list = list.filter(c => c.cat === catF);
  if (searchQ) list = list.filter(c => c.title.toLowerCase().includes(searchQ.toLowerCase()));
  const el = document.getElementById('subjGrid'); if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-title">No courses found</div><div class="empty-sub">Try a different filter</div></div>`;
    return;
  }
  renderGrid('subjGrid', list);
}

// ===== COURSE DETAIL =====
function renderSubject(cid) {
  const c = getCourse(cid); if (!c) return;
  S.currentCourse = c;
  const enrolled = S.enrollments.has(cid);
  const pct = getCPct(cid);
  const all = flatVids(c);
  const firstVid = enrolled ? (all.find(v => !S.progress[cid + '_' + v.id]?.completed) || all[0]) : all[0];

  document.getElementById('courseMain').innerHTML = `
    <div class="chero" style="background:${c.bg}">${c.emoji}</div>
    <div class="pills">
      <span class="pill">${c.level}</span>
      <span class="pill">${all.length} videos</span>
      <span class="pill">${c.hours}h total</span>
      <span class="pill">★ ${c.rating}</span>
    </div>
    <h1 style="font-size:26px;font-weight:800;margin:10px 0 8px;letter-spacing:-0.5px">${c.title}</h1>
    <div class="cdesc">${c.desc}</div>
    <div class="wlearn">
      <h3>What you'll learn</h3>
      ${c.learns.map(l => `<div class="litem"><span class="lcheck">✓</span><span>${l}</span></div>`).join('')}
    </div>
    <div class="curr">
      <h2>Course Curriculum</h2>
      ${c.sections.map(s => {
        const done = s.vids.filter(v => S.progress[cid + '_' + v.id]?.completed).length;
        return `<div class="sec-item">
          <div class="sec-head" onclick="togSec('sv${s.id}','st${s.id}')">
            <div style="flex:1"><div class="sec-name">${s.title}</div><div class="sec-meta">${done}/${s.vids.length} completed</div></div>
            <span class="sec-tog open" id="st${s.id}">▾</span>
          </div>
          <div class="sec-vids open" id="sv${s.id}">
            ${s.vids.map(v => {
              const vkey = cid + '_' + v.id;
              const done = S.progress[vkey]?.completed;
              const locked = enrolled && isLocked(cid, v.id);
              const cls = locked ? ' locked' : '';
              const onclick = locked ? '' : `onclick="watchVideo(${cid},${v.id})"`;
              return `<div class="vid-row${cls}" ${onclick}>
                <div class="vic ${done ? 'vic-d' : locked ? 'vic-l' : 'vic-p'}">${done ? '✓' : locked ? '🔒' : '▶'}</div>
                <div class="vname">${v.title}</div>
                <div class="vdur">${v.dur}</div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;

  document.getElementById('courseSide').innerHTML = `
    <div class="ecard">
      <div class="eprice">${enrolled ? 'Enrolled ✓' : '$' + c.price}</div>
      ${enrolled ? `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:5px"><span>Progress</span><span>${pct}%</span></div>
          <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
        </div>
        <button class="ebtn" onclick="watchVideo(${cid},${firstVid.id})">${pct > 0 ? 'Continue Learning →' : 'Start Course →'}</button>
      ` : `<button class="ebtn" id="enrollBtn_${cid}" onclick="enroll(${cid})">Enroll Free</button>`}
      <div style="font-size:11px;color:var(--text3);text-align:center;margin-bottom:14px">Lifetime access · Certificate on completion</div>
      <div class="einc">
        <h4>This course includes:</h4>
        <div class="einc-item">🎬 ${all.length} video lessons</div>
        <div class="einc-item">⏱ ${c.hours} hours of content</div>
        <div class="einc-item">📱 Mobile & desktop access</div>
        <div class="einc-item">🏆 Certificate on completion</div>
        <div class="einc-item">♾ Lifetime access</div>
      </div>
    </div>`;
}

function togSec(vid, tid) {
  document.getElementById(vid)?.classList.toggle('open');
  document.getElementById(tid)?.classList.toggle('open');
}

// ===== WATCH VIDEO =====
function watchVideo(cid, vid) {
  if (!S.user) { toast('Please sign in first!', 'e'); go('login'); return; }
  if (!S.enrollments.has(cid)) { enroll(cid); return; }
  if (isLocked(cid, vid)) { toast('Complete the previous video first 🔒', 'e'); return; }
  S.currentCourse = getCourse(cid);
  S.currentVid = { ...flatVids(S.currentCourse).find(v => v.id === vid), cid };
  go('video', { cid, vid });
}

// ===== VIDEO PAGE =====
function renderVideoPage(cid, vid) {
  const c = getCourse(cid); if (!c) return;
  const all = flatVids(c);
  const idx = all.findIndex(v => v.id === vid);
  const cur = all[idx];
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;
  const vkey = cid + '_' + vid;
  const prog = S.progress[vkey] || {};
  const isDone = prog.completed || false;
  const ts = prog.timestamp || 0;
  const nextLocked = next && isLocked(cid, next.id);

  document.getElementById('vmain').innerHTML = `
    <div class="player-outer">
      <div class="player-inner">
        <div class="player-screen" id="playerScreen">
          <button class="playbtn" id="playBtn" onclick="startSim(${cid},${vid})">
            <div class="tri"></div>
          </button>
          <div class="player-title">${cur.title}</div>
          <div class="player-sub">${isDone ? '✓ Completed — watch again' : ts > 0 ? 'Resume from ' + fmtTime(ts) : 'Click to start · ' + cur.dur}</div>
          <div class="player-prog"><div class="player-prog-fill" id="ppfill" style="width:${isDone ? 100 : ts > 0 ? Math.round(ts / parseDur(cur.dur) * 100) : 0}%"></div></div>
        </div>
      </div>
    </div>
    <div id="playingBar" style="display:none" class="playing-indicator">
      <div class="pi-dot"></div>
      <div class="pi-text" id="playingText">Playing...</div>
      <button onclick="stopSim()" style="margin-left:auto;background:var(--bg3);border:1px solid var(--border);color:var(--text2);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit">⏸ Pause</button>
    </div>
    <div class="vinfo">
      <div class="vtitle">${cur.title}</div>
      <div class="vmeta">
        <div class="vmi">⏱ ${cur.dur}</div>
        <div class="vmi">📚 ${c.title}</div>
        ${isDone ? '<span class="badge bg">✓ Completed</span>' : ''}
        ${ts > 0 && !isDone ? `<span class="badge bb">▶ Saved at ${fmtTime(ts)}</span>` : ''}
      </div>
      <div class="vdesc">
        This lesson covers <strong>${cur.title}</strong> in depth with practical examples.
        ${isDone
          ? '<br><br>✅ You completed this lesson. Watch again anytime — your progress is saved.'
          : '<br><br>Click the play button above to start watching. Your progress saves automatically as you watch.'}
      </div>
      <div class="vnav">
        <button class="vnbtn" ${!prev ? 'disabled' : ''} onclick="${prev ? 'watchVideo(' + cid + ',' + prev.id + ')' : ''}">← Prev</button>
        ${!isDone
          ? `<button class="vnbtn btn-g" onclick="markDone(${cid},${vid})" style="background:var(--greenbg);border-color:var(--green);color:var(--green)">✓ Mark Complete</button>`
          : `<button class="vnbtn" style="background:var(--greenbg);border-color:var(--green);color:var(--green);cursor:default">✓ Completed</button>`}
        <button class="vnbtn next" ${!next || nextLocked ? 'disabled' : ''} onclick="${next && !nextLocked ? 'watchVideo(' + cid + ',' + next.id + ')' : ''}">Next →</button>
      </div>
    </div>`;

  renderVSidebar(cid, vid);
}

function renderVSidebar(cid, vid) {
  const c = getCourse(cid);
  const pct = getCPct(cid);
  const all = flatVids(c);
  let h = `<div class="sb-hdr">
    <div class="sb-title">${c.title}</div>
    <div class="sb-prog"><span>Progress</span><span style="color:var(--accent)">${pct}%</span></div>
    <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
    <div style="font-size:11px;color:var(--text3);margin-top:4px">${all.filter(v => S.progress[cid + '_' + v.id]?.completed).length}/${all.length} completed</div>
  </div>`;
  c.sections.forEach(s => {
    h += `<div class="sb-sec">${s.title}</div>`;
    s.vids.forEach(v => {
      const vkey = cid + '_' + v.id;
      const done = S.progress[vkey]?.completed;
      const locked = isLocked(cid, v.id);
      const active = v.id === vid;
      h += `<div class="vid-row${active ? ' active-vid' : ''}${locked ? ' locked' : ''}" onclick="${!locked ? 'watchVideo(' + cid + ',' + v.id + ')' : ''}">
        <div class="vic ${active ? 'vic-a' : done ? 'vic-d' : locked ? 'vic-l' : 'vic-p'}">${active ? '▶' : done ? '✓' : locked ? '🔒' : '▶'}</div>
        <div class="vname" style="${active ? 'color:var(--accent);font-weight:700' : ''}">${v.title}</div>
        <div class="vdur">${v.dur}</div>
      </div>`;
    });
  });
  document.getElementById('vsidebar').innerHTML = h;
}

// ===== VIDEO SIMULATION =====
let simTimer = null;
let simElapsed = 0;
let simTotal = 0;
let simCid = 0;
let simVid = 0;

function clearSimTimer() { if (simTimer) { clearInterval(simTimer); simTimer = null; } }

function startSim(cid, vid) {
  clearSimTimer();
  const vkey = cid + '_' + vid;
  const prog = S.progress[vkey] || {};
  const all = flatVids(getCourse(cid));
  const cur = all.find(v => v.id === vid);
  if (!cur) return;

  simCid = cid; simVid = vid;
  simTotal = parseDur(cur.dur);
  simElapsed = prog.timestamp || 0;

  const btn = document.getElementById('playBtn');
  if (btn) { btn.innerHTML = '<div style="width:12px;height:12px;border:2px solid #000;border-radius:2px"></div>'; btn.style.background = 'var(--accent2)'; }
  const bar = document.getElementById('playingBar');
  if (bar) bar.style.display = 'flex';

  toast('▶ Playing video — progress auto-saves', 'i');

  simTimer = setInterval(() => {
    simElapsed += 2;
    const pct = Math.min(100, Math.round(simElapsed / simTotal * 100));

    S.progress[vkey] = { timestamp: simElapsed, pct, completed: pct >= 80 };
    save();

    const ppf = document.getElementById('ppfill');
    if (ppf) ppf.style.width = pct + '%';

    const pt = document.getElementById('playingText');
    if (pt) pt.textContent = 'Playing: ' + fmtTime(simElapsed) + ' / ' + cur.dur + ' (' + pct + '%)';

    const sbpf = document.querySelector('#vsidebar .pfill');
    if (sbpf) sbpf.style.width = getCPct(cid) + '%';

    if (pct >= 80) {
      clearSimTimer();
      S.progress[vkey].completed = true;
      save();
      toast('🎉 Lesson complete! Next video unlocked.', 's');
      renderVideoPage(cid, vid);
      renderVSidebar(cid, vid);

      const idx = all.findIndex(v => v.id === vid);
      const nextV = all[idx + 1];
      if (nextV) {
        setTimeout(() => {
          toast('▶ Auto-playing next lesson...', 'i');
          setTimeout(() => watchVideo(cid, nextV.id), 800);
        }, 1800);
      }
    }
  }, 400);
}

function stopSim() {
  clearSimTimer();
  const bar = document.getElementById('playingBar');
  if (bar) bar.style.display = 'none';
  const btn = document.getElementById('playBtn');
  if (btn) { btn.innerHTML = '<div class="tri"></div>'; btn.style.background = 'var(--accent)'; }
  toast('Paused — progress saved', 'i');
}

function markDone(cid, vid) {
  clearSimTimer();
  const vkey = cid + '_' + vid;
  S.progress[vkey] = { ...(S.progress[vkey] || {}), completed: true, timestamp: parseDur(flatVids(getCourse(cid)).find(v => v.id === vid)?.dur || '0:0') };
  save();
  toast('✓ Marked complete!', 's');
  renderVideoPage(cid, vid);
  renderVSidebar(cid, vid);
}

// ===== PROFILE =====
function renderProfile() {
  if (!S.user) { go('login'); return; }
  const enrolled = COURSES.filter(c => S.enrollments.has(c.id));
  let totalDone = 0, totalVids = 0;
  enrolled.forEach(c => {
    const all = flatVids(c);
    totalVids += all.length;
    totalDone += all.filter(v => S.progress[c.id + '_' + v.id]?.completed).length;
  });
  const ini = initials(S.user.name);

  document.getElementById('profileContent').innerHTML = `
    <div class="phdr">
      <div class="pav">${ini}</div>
      <div>
        <div class="pname">${S.user.name}</div>
        <div class="pemail">${S.user.email}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px">Member since ${S.user.joined || '2024'}</div>
      </div>
    </div>
    <div class="stats-grid">
      <div class="scard"><div class="scard-n" style="color:var(--accent)">${enrolled.length}</div><div class="scard-l">Enrolled</div></div>
      <div class="scard"><div class="scard-n" style="color:var(--green)">${totalDone}</div><div class="scard-l">Completed</div></div>
      <div class="scard"><div class="scard-n" style="color:var(--blue)">${totalVids ? Math.round(totalDone / totalVids * 100) : 0}%</div><div class="scard-l">Progress</div></div>
    </div>
    <div style="font-size:18px;font-weight:700;margin-bottom:16px">My Courses</div>
    ${enrolled.length === 0
      ? `<div class="empty"><div class="empty-icon">📚</div><div class="empty-title">No courses yet</div><div class="empty-sub">Browse and enroll in your first course</div><button class="btn btn-a" style="margin-top:14px" onclick="go('subjects')">Browse Courses</button></div>`
      : ''}
    <div class="elist">
      ${enrolled.map(c => {
        const pct = getCPct(c.id);
        const all = flatVids(c);
        const firstInc = all.find(v => !S.progress[c.id + '_' + v.id]?.completed) || all[0];
        const done = all.filter(v => S.progress[c.id + '_' + v.id]?.completed).length;
        return `<div class="ecard2" onclick="watchVideo(${c.id},${firstInc.id})">
          <div class="ethumb" style="background:${c.bg}">${c.emoji}</div>
          <div class="einfo">
            <div class="ename">${c.title}</div>
            <div class="esub">${done}/${all.length} videos · ${pct}% complete</div>
            <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
          </div>
          <div class="eact">${pct === 100 ? '✓ Done' : 'Continue →'}</div>
        </div>`;
      }).join('')}
    </div>`;
}

// ===== INIT =====
(function init() {
  try {
    const sess = localStorage.getItem('lf_sess');
    if (sess) { const u = JSON.parse(sess); if (u && u.id) { S.user = u; load(u); } }
  } catch (e) {}
  updateNav();
  renderHome();
})();
