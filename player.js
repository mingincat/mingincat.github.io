(function () {
  var T = (window.TRACKS || []).filter(function (t) { return t && t.src; });
  var a = document.getElementById('audio'), pp = document.getElementById('pp'),
      now = document.getElementById('now'), seek = document.getElementById('seek'),
      cur = document.getElementById('cur'), dur = document.getElementById('dur'),
      vol = document.getElementById('vol');
  var idx = -1, rows = [], missing = {}, seeking = false;

  function fmt(s) { if (!isFinite(s)) return '0:00'; s = Math.floor(s);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = ('0' + s % 60).slice(-2);
    return h ? h + ':' + ('0' + m).slice(-2) + ':' + x : m + ':' + x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  // build lists
  ['track', 'mix'].forEach(function (type) {
    var ul = document.getElementById('list-' + type), n = 0;
    T.forEach(function (t, i) {
      if ((t.type === 'mix' ? 'mix' : 'track') !== type) return;
      var li = document.createElement('li'); li.className = 'row';
      li.innerHTML = '<span class="n">' + (++n < 10 ? '0' : '') + n + '</span>' +
        (t.cover ? '<img class="cv" alt="" src="' + esc(t.cover) + '">' : '<span class="cv"></span>') +
        '<span class="tt">' + esc(t.title) + '</span><span class="yr">' + esc(t.year) + '</span><span class="du">--:--</span>';
      var img = li.querySelector('img'); if (img) img.onerror = function () { var s = document.createElement('span'); s.className = 'cv'; img.replaceWith(s); };
      li.onclick = function () { if (!missing[i]) play(i); };
      ul.appendChild(li); rows[i] = li;
      // probe file: get duration or mark missing
      var p = new Audio(); p.preload = 'metadata';
      p.onloadedmetadata = function () { li.querySelector('.du').textContent = fmt(p.duration); p.onerror = null; p.removeAttribute('src'); p.load(); };
      p.onerror = function () { markMissing(i); };
      p.src = t.src;
    });
    if (!n) ul.innerHTML = '<li class="empty">No ' + type + 's yet - add some in tracks.js</li>';
  });

  function markMissing(i) {
    if (missing[i]) return; missing[i] = true;
    var r = rows[i]; if (r) { r.classList.add('missing'); r.querySelector('.du').textContent = 'file not found'; }
  }
  function playable(from, dir) {
    for (var k = 1; k <= T.length; k++) { var j = (from + dir * k + T.length * 2) % T.length; if (!missing[j]) return j; }
    return -1;
  }
  function play(i) {
    if (i < 0 || i >= T.length) return;
    idx = i; rows.forEach(function (r) { r && r.classList.remove('playing'); });
    if (rows[i]) rows[i].classList.add('playing');
    now.classList.remove('err'); now.textContent = T[i].title + (T[i].type === 'mix' ? '  [MIX]' : '');
    a.src = T[i].src;
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function next() { var j = playable(idx < 0 ? -1 : idx, 1); if (j >= 0) play(j); }
  function prev() { if (a.currentTime > 3) { a.currentTime = 0; return; } var j = playable(idx < 0 ? 0 : idx, -1); if (j >= 0) play(j); }

  pp.onclick = function () {
    if (idx < 0) { next(); return; }
    if (a.paused) a.play().catch(function () {}); else a.pause();
  };
  document.getElementById('next').onclick = next;
  document.getElementById('prev').onclick = prev;
  a.onplay = function () { pp.innerHTML = '&#10074;&#10074;'; };
  a.onpause = function () { pp.innerHTML = '&#9654;'; };
  a.onended = next; // continuous playback
  a.onerror = function () {
    if (idx < 0 || !a.getAttribute('src')) return;
    markMissing(idx); now.classList.add('err'); now.textContent = T[idx].title + ' - file not found';
    var bad = idx; setTimeout(function () { if (idx === bad) { var j = playable(bad, 1); if (j >= 0 && j !== bad) play(j); } }, 1200);
  };
  a.ontimeupdate = function () {
    cur.textContent = fmt(a.currentTime);
    if (!seeking && a.duration) seek.value = a.currentTime / a.duration * 1000;
  };
  a.onloadedmetadata = function () { dur.textContent = fmt(a.duration); };
  seek.oninput = function () { seeking = true; if (a.duration) cur.textContent = fmt(seek.value / 1000 * a.duration); };
  seek.onchange = function () { if (a.duration) a.currentTime = seek.value / 1000 * a.duration; seeking = false; };
  vol.oninput = function () { a.volume = vol.value; };
  a.volume = vol.value;

  // tabs
  document.querySelectorAll('.tab').forEach(function (b) {
    b.onclick = function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('on'); });
      document.querySelectorAll('.panel').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); document.getElementById('panel-' + b.dataset.tab).classList.add('on');
    };
  });
  // space bar = play/pause
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); pp.onclick(); }
  });
})();
