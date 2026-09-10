
(() => {
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.primary-nav');
  if (menu && nav) menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });

  const checks = [...document.querySelectorAll('.warning-check')];
  const count = document.getElementById('warning-count');
  if (checks.length && count) {
    const update = () => count.textContent = `${checks.filter(c => c.checked).length} of ${checks.length}`;
    checks.forEach(c => c.addEventListener('change', update)); update();
  }

  const form = document.getElementById('timeline-form');
  if (!form) return;
  const key = 'administrativeDisplacementTimelineV2';
  const list = document.getElementById('timeline-list');
  const empty = document.getElementById('timeline-empty');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const load = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const save = data => localStorage.setItem(key, JSON.stringify(data));
  const render = () => {
    const data = load().sort((a,b) => (a.date || '').localeCompare(b.date || ''));
    empty.hidden = data.length > 0; list.innerHTML = '';
    data.forEach(item => {
      const el = document.createElement('article'); el.className = 'timeline-entry';
      el.innerHTML = `<div class="timeline-entry-top"><div><p class="example-label">${esc(item.date || 'Date not entered')}</p><h3>${esc(item.org || 'Organization / role not entered')}</h3></div><button type="button" data-delete="${esc(item.id)}">Delete</button></div><p><strong>What happened:</strong> ${esc(item.what)}</p>${item.record ? `<p><strong>Supporting record:</strong> ${esc(item.record)}</p>` : ''}${item.effect ? `<p><strong>Housing effect / unresolved question:</strong> ${esc(item.effect)}</p>` : ''}`;
      list.appendChild(el);
    });
    list.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => { save(load().filter(x => x.id !== btn.dataset.delete)); render(); }));
  };
  form.addEventListener('submit', e => { e.preventDefault(); const data=load(); data.push({id:String(Date.now())+Math.random().toString(16).slice(2),date:document.getElementById('event-date').value,org:document.getElementById('event-org').value.trim(),what:document.getElementById('event-what').value.trim(),record:document.getElementById('event-record').value.trim(),effect:document.getElementById('event-effect').value.trim()}); save(data); form.reset(); render(); });
  document.getElementById('clear-timeline')?.addEventListener('click', () => { if (confirm('Clear every locally stored chronology entry on this device?')) { localStorage.removeItem(key); render(); } });
  document.getElementById('export-timeline')?.addEventListener('click', () => { const data=load().sort((a,b)=>(a.date||'').localeCompare(b.date||'')); if(!data.length){alert('Add at least one event before exporting.');return;} const lines=['ADMINISTRATIVE DISPLACEMENT — LOCAL CHRONOLOGY','',...data.flatMap((x,i)=>[`${i+1}. ${x.date || 'Date not entered'} — ${x.org || 'Organization / role not entered'}`,`What happened: ${x.what}`,x.record?`Supporting record: ${x.record}`:'',x.effect?`Housing effect / unresolved question: ${x.effect}`:'',''].filter(Boolean))]; const blob=new Blob([lines.join('\n')],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='administrative-displacement-chronology.txt'; a.click(); URL.revokeObjectURL(a.href); });
  render();
})();
