let teams = { left: [], right: [] };
let busy = false;
const status = document.getElementById('status');
const editor = document.getElementById('editor');

function formatPower(value) { return new Intl.NumberFormat('fr-FR').format(value); }
function render(team) {
  const list = document.getElementById(`${team}-list`);
  list.replaceChildren();
  document.getElementById(`${team}-count`).textContent = `${teams[team].length} joueurs`;
  [...teams[team]].sort((a,b) => Number(b.creator)-Number(a.creator)).forEach((player,index) => {
    const row = document.getElementById('player-template').content.firstElementChild.cloneNode(true);
    row.querySelector('.position').textContent = index + 1;
    const name = row.querySelector('.name');
    const power = row.querySelector('.power');
    const creator = row.querySelector('.creator');
    name.value = player.name;
    power.value = formatPower(player.power);
    creator.checked = player.creator;
    name.addEventListener('change', () => mutate(() => writePlayer(player.id, { name: name.value.trim() || 'Sans nom' })));
    power.addEventListener('change', () => mutate(() => {
      const value = power.value.replace(/[\s\u00a0\u202f]/g, '');
      if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) throw new Error('La puissance doit être un entier positif ou nul.');
      return writePlayer(player.id, { power: Number(value) });
    }));
    creator.addEventListener('change', () => mutate(() => writePlayer(player.id, { creator: creator.checked })));
    row.querySelector('.move').addEventListener('click', () => mutate(() => writePlayer(player.id, {
      team: team === 'left' ? 'right' : 'left', position: nextPosition(team === 'left' ? 'right' : 'left'),
    })));
    row.querySelector('.delete').addEventListener('click', () => {
      if (window.confirm(`Supprimer ${player.name} ?`)) mutate(() => deletePlayer(player.id));
    });
    list.append(row);
  });
}
function nextPosition(team) { return Math.max(-1, ...teams[team].map(p => p.position)) + 1; }
async function refresh() {
  teams = await loadRoster();
  render('left'); render('right');
}
async function mutate(operation) {
  if (busy) return;
  busy = true; editor.disabled = true; status.textContent = 'Enregistrement…';
  let saved = false;
  try { await operation(); saved = true; await refresh(); status.textContent = 'Modifications enregistrées.'; }
  catch (error) {
    status.textContent = saved ? `Modification enregistrée, mais rechargement impossible. ${error.message}` : error.message;
    render('left'); render('right');
  } finally { busy = false; editor.disabled = false; }
}
document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => mutate(() => writePlayer(null, {
  name: 'Nouveau joueur', power: 0, creator: false, rank: 'R3', team: button.dataset.team, position: nextPosition(button.dataset.team),
}))));
status.textContent = 'Chargement des équipes…';
refresh().then(() => {
  editor.disabled = false;
  status.textContent = '';
}).catch(error => { status.textContent = error.message; });
