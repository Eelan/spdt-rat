let teams = { left: [], right: [] };

function render(team) {
  const list = document.getElementById(`${team}-list`);
  const players = teams[team];
  const template = document.getElementById('player-template');
  document.getElementById(`${team}-count`).textContent = `${players.length} joueurs`;
  [...players].sort((a, b) => Number(b.creator) - Number(a.creator)).forEach(({ name, creator, rank }, index) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.classList.toggle('is-creator', creator);
    row.classList.add(`rank-${rank.toLowerCase()}`);
    row.querySelector('.position').textContent = index + 1;
    row.querySelector('.avatar').textContent = rank;
    row.querySelector('.player-name').textContent = name;
    if (creator) row.setAttribute('aria-label', `${name}, autorisé à créer les ralliements`);
    list.append(row);
  });
}

loadRoster().then(roster => {
  teams = roster;
  render('left'); render('right');
  document.getElementById('status').textContent = '';
}).catch(error => {
  document.getElementById('status').textContent = 'Impossible de charger les équipes. ' + error.message;
});
