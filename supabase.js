
function supabaseConfigured() {
  return Boolean(window.SPDT_CONFIG?.supabaseUrl && window.SPDT_CONFIG?.supabaseKey);
}
async function supabaseRequest(path, options = {}) {
  if (!supabaseConfigured()) throw new Error('Renseignez le projet Supabase dans config.js.');
  const { supabaseUrl, supabaseKey } = window.SPDT_CONFIG;
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: { apikey: supabaseKey, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Accès refusé. Vérifiez la clé publique et les droits Supabase.');
    if (response.status === 403) throw new Error('Les modifications publiques ne sont pas autorisées. Appliquez la migration 002 dans Supabase.');
    throw new Error(`Opération refusée (${response.status}). Vérifiez la connexion et la configuration Supabase.`);
  }
  return response.status === 204 ? null : response.json();
}
async function loadRoster() {
  const players = await supabaseRequest('/rest/v1/players?select=*&order=position.asc,id.asc');
  return { left: players.filter(p => p.team === 'left'), right: players.filter(p => p.team === 'right') };
}
async function writePlayer(id, changes) {
  const rows = await supabaseRequest(`/rest/v1/players${id ? `?id=eq.${encodeURIComponent(id)}` : ''}`, {
    method: id ? 'PATCH' : 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(changes),
  });
  if (rows.length !== 1) throw new Error('Joueur absent ou modification non autorisée. Rechargez la liste.');
  return rows[0];
}
async function deletePlayer(id) {
  const rows = await supabaseRequest(`/rest/v1/players?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: { Prefer: 'return=representation' },
  });
  if (rows.length !== 1) throw new Error('Suppression non autorisée ou joueur déjà supprimé.');
}
