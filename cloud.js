/* Cloud save via Supabase (anonymous auth). Game tetap jalan offline jika gagal. */
(function () {
  'use strict';
  const cfg = window.SUPABASE_CONFIG;
  if (!window.supabase || !cfg) return;
  const sb = window.supabase.createClient(cfg.url, cfg.key);
  let uid = null, timer = null, getState = null;

  // Dipanggil sekali oleh app.js saat game mulai
  window.cloudInit = async function (get, set) {
    getState = get;
    try {
      let { data: { session } } = await sb.auth.getSession();
      if (!session) {
        const r = await sb.auth.signInAnonymously();
        if (r.error) throw r.error;
        session = r.data.session;
      }
      uid = session.user.id;
      const { data, error } = await sb.from('game_saves').select('data').eq('user_id', uid).maybeSingle();
      if (error) throw error;
      const local = get();
      if (data && data.data && (data.data.savedAt || 0) > (local.savedAt || 0)) set(data.data); // cloud lebih baru
      else push();                                                                               // lokal lebih baru
    } catch (e) { console.warn('Cloud save nonaktif:', e.message || e); }
  };

  // Dipanggil setiap save() (di-debounce 1.5 detik)
  window.cloudPush = function () {
    if (!uid) return;
    clearTimeout(timer);
    timer = setTimeout(push, 1500);
  };

  async function push() {
    if (!uid || !getState) return;
    const { error } = await sb.from('game_saves').upsert({ user_id: uid, data: getState(), updated_at: new Date().toISOString() });
    if (error) console.warn('Gagal sync:', error.message);
  }
})();
