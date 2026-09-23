let teams = loadRoster();

function parsePower(value) { return Number(String(value).replace(/\D/g, '')) || 0; }
function formatPower(value) { return new Intl.NumberFormat('fr-FR').format(value); }
function persist() { saveRoster(teams); }

function render(team) {
  const list = document.getElementById(`${team}-list`);
  const players = teams[team];
  const template = document.getElementById('player-template');
  list.replaceChildren();
  document.getElementById(`${team}-count`).textContent = `${players.length} joueurs`;
  players
    .map((player, sourceIndex) => ({ player, sourceIndex }))
    .sort((a, b) => Number(b.player.creator) - Number(a.player.creator))
    .forEach(({ player, sourceIndex }, index) => {
      const row = template.content.firstElementChild.cloneNode(true);
      row.querySelector('.position').textContent = index + 1;
      const name = row.querySelector('.name');
      const power = row.querySelector('.power');
      const creator = row.querySelector('.creator');
      name.value = player.name;
      power.value = formatPower(player.power);
      creator.checked = player.creator;
      name.addEventListener('change', () => { player.name = name.value.trim() || 'Sans nom'; persist(); });
      power.addEventListener('change', () => { player.power = parsePower(power.value); power.value = formatPower(player.power); persist(); });
      creator.addEventListener('change', () => { player.creator = creator.checked; persist(); render(team); });
      row.querySelector('.move').addEventListener('click', () => {
        const destination = team === 'left' ? 'right' : 'left';
        teams[team].splice(sourceIndex, 1);
        teams[destination].push(player);
        persist();
        render('left');
        render('right');
      });
      row.querySelector('.delete').addEventListener('click', () => {
        if (!window.confirm(`Supprimer définitivement ${player.name} du RAT ${team === 'left' ? 'Gauche' : 'Droite'} ?`)) return;
        teams[team].splice(sourceIndex, 1);
        persist();
        render(team);
      });
      list.append(row);
    });
}

document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => {
  teams[button.dataset.team].push({ name: 'Nouveau joueur', power: 0, creator: false });
  persist();
  render(button.dataset.team);
}));

render('left');
render('right');
