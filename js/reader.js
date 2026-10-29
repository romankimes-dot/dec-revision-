// Lecteur PDF intégré : s'ouvre par-dessus l'app, avec « Retour » et « Partager / Imprimer ».
// Rendu page par page avec PDF.js (chargé à la demande), seulement quand la page approche de l'écran.
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
let lib = null;
let state = null; // { url, title, buf, doc, obs }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadLib() {
  if (!lib) { lib = await import(PDFJS); lib.GlobalWorkerOptions.workerSrc = WORKER; }
  return lib;
}

async function fetchWithProgress(url, onProgress) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`document introuvable (${r.status})`);
  const total = +r.headers.get('content-length') || 0;
  if (!r.body || !total) return new Uint8Array(await r.arrayBuffer());
  const reader = r.body.getReader(); const parts = []; let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); got += value.length; onProgress(got / total); }
  const out = new Uint8Array(got); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

export function closeReader() {
  const el = document.getElementById('reader');
  if (state?.obs) state.obs.disconnect();
  if (state?.doc) state.doc.destroy();
  state = null;
  if (el) { el.hidden = true; el.innerHTML = ''; }
  document.body.classList.remove('reading');
  if (history.state?.reader) history.back();
}

export async function share(fileName) {
  if (!state?.buf) return { ok: false, msg: 'Document pas encore chargé' };
  const file = new File([state.buf], fileName, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: state.title }); return { ok: true }; }
    catch (e) { if (e.name === 'AbortError') return { ok: true }; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = fileName; a.click();
  return { ok: true, msg: 'Téléchargé : ouvre-le depuis Fichiers pour l\'imprimer' };
}

export async function openReader({ url, title, fileName, githubUrl, onToast }) {
  const el = document.getElementById('reader');
  el.hidden = false; document.body.classList.add('reading');
  history.pushState({ reader: 1 }, '');
  el.innerHTML = `<div class="rbar"><button class="rbtn" id="rClose">‹ Retour</button><div class="rtitle">${esc(title)}<small id="rInfo">Chargement…</small></div><button class="rbtn primary" id="rShare" disabled>Partager / Imprimer</button></div>
    <div class="rpages" id="rPages"><div class="rload"><div class="rprog"><span id="rProg"></span></div><p>Chargement du document…</p></div></div>`;
  el.querySelector('#rClose').onclick = closeReader;
  const me = state = { url, title };
  try {
    const [buf, pdfjs] = await Promise.all([fetchWithProgress(url, (p) => { const b = document.getElementById('rProg'); if (b) b.style.width = Math.round(p * 100) + '%'; }), loadLib()]);
    if (state !== me) return;
    me.buf = buf;
    const btn = el.querySelector('#rShare'); btn.disabled = false;
    btn.onclick = async () => { const r = await share(fileName); if (r.msg) onToast && onToast(r.msg); };
    const doc = me.doc = await pdfjs.getDocument({ data: buf.slice() }).promise;
    if (state !== me) { doc.destroy(); return; }
    const pages = document.getElementById('rPages');
    pages.innerHTML = Array.from({ length: doc.numPages }, (_, i) => `<div class="rpage" data-n="${i + 1}" style="aspect-ratio:0.707"></div>`).join('');
    const info = document.getElementById('rInfo');
    info.textContent = `${doc.numPages} pages`;
    const width = Math.min(pages.clientWidth - 16, 900);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const render = async (box) => {
      if (box.dataset.done) return; box.dataset.done = '1';
      const page = await doc.getPage(+box.dataset.n);
      const vp1 = page.getViewport({ scale: 1 });
      const scale = width / vp1.width;
      const vp = page.getViewport({ scale: scale * dpr });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      c.style.width = '100%'; box.style.aspectRatio = `${vp1.width} / ${vp1.height}`;
      box.appendChild(c);
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    };
    me.obs = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { render(e.target); info.textContent = `page ${e.target.dataset.n} / ${doc.numPages}`; }
    }, { root: pages, rootMargin: '600px 0px' });
    pages.querySelectorAll('.rpage').forEach((p) => me.obs.observe(p));
  } catch (e) {
    const pages = document.getElementById('rPages');
    if (pages) pages.innerHTML = `<div class="rload"><p>Impossible d'afficher le document ici (${esc(e.message || e)}).</p><p><a href="${esc(githubUrl)}" target="_blank" rel="noopener">L'ouvrir dans Safari</a></p></div>`;
  }
}

window.addEventListener('popstate', () => { if (state) closeReader(); });
