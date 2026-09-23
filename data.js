const SPDT_STORAGE_KEY = 'spdt-event-planner-roster-v6';

const SPDT_DEFAULT_ROSTER = {
  left: [
    ['Batoon35', 52800645], ['StrangerWho', 48092902], ['Vodee', 43779279], ['Kero52', 37801745], ['Phiphixx', 34849100], ['Plastic69', 33686363], ['XxChe', 32451218], ['DoctorMaden', 32377237], ['AyuTateishi', 32060685, 1], ['Libel5962', 30268691, 1], ['ArnoldT800', 29917922], ['Honorien', 28817882, 1], ['lilielafolle', 28547064], ['Inouk', 28250771], ['konan2026', 28229733], ['zarwild', 27751818], ['doc-AMH', 27651160], ['r-cabo', 27422524], ['MaTnOoOob', 26941259], ['vbilolo', 26919641], ['PCVTEAM', 26461934], ['sittingbull82', 25936294], ['magnum13', 25157913], ['RhapsodyScath', 25103173], ['xEelanx', 24581601, 1], ['Augustini', 24470245], ['Titie', 24403675], ['Kiwimi', 23240599], ['8Batman8', 19343672], ['Dams1310', 19329213], ['Mathilda85', 19224520], ['DocDarkKnight', 19178217], ['Calixtea', 18909987], ['LaGrandeFoxy', 18848413], ['Matias4781', 18213831], ['Kal69', 18154549], ['Csajes', 17809590], ['Alibubba', 17738445], ['Hel13', 17303917], ['LeToulousain', 17094442], ['laetilafurtive', 16963318], ['Drakkar1997', 16432024], ['Stinio', 16396336], ['matranquil', 16331304], ['BanlieuesArts', 15693780], ['goldorack', 15515228], ['aerianne360', 15436874], ['Mayhie', 15150728], ['psycho71', 10343519], ['sayatonova', 11827929],
  ],
  right: [
    ['roromams', 51212147], ['AruElwe', 45801811, 1], ['Skytoun', 41278778], ['VV2', 37661108], ['HakuKoji', 36960521], ['Yjam', 36578517], ['HouyoXx', 34871596], ['wolk108', 34744197], ['Bout2Ficelle', 34600180], ['darkDrwho2013', 34578621], ['floflo171', 33823170], ['SayaOswald', 33694240], ['redgecko', 32758858], ['Purplebluelagon', 32425617], ['AshMedai', 31712677, 1], ['ubbe29', 31608540, 1], ['Darknesst', 30395612, 1], ['Kahena222106', 30212232], ['Aiko65', 27680732], ['Maaroushkaa', 25047129], ['Dominange', 24414595], ['Pixelly', 24374376], ['Lou85', 23879471], ['Bapt-le-fromager', 22818447], ['Marine2611', 22565168], ['Gomly', 22457748], ['Cris38', 21713638], ['Vily43', 20977873], ['Hydre', 20957859], ['lenoil', 20762739], ['celou', 20716624], ['miaka56', 20632385], ['Vertige007', 20628907], ['Lesuédois', 20557640], ['DameEmilie', 20441566], ['Doud007', 20098079], ['titouuu', 20079208], ['BakerBooba', 17670063], ['Cudder', 17079575], ['Adolphe', 17025440], ['Steph3728', 16935287], ['Gargoyle50', 14310318], ['LenSeyLow', 13558946], ['noelwhynot', 12383227], ['LittlePower', 11922421], ['njnj7478', 10747582], ['ManocheDeScamatt', 9477745], ['AstralGarden', 6999601], ['noona31', 15379471],
  ],
};

function rosterFromDefault() {
  return Object.fromEntries(Object.entries(SPDT_DEFAULT_ROSTER).map(([team, players]) => [team, players.map(([name, power, creator]) => ({ name, power, creator: Boolean(creator), rank: rankFor(name, creator) }))]));
}
function rankFor(name, creator) {
  if (['Alibubba', 'Adolphe', 'noelwhynot', 'njnj7478', 'AstralGarden'].includes(name)) return 'R1';
  if (name === 'Batoon35') return 'R5';
  return creator ? 'R4' : 'R3';
}
function normaliseRoster(roster) {
  return Object.fromEntries(Object.entries(roster).map(([team, players]) => [team, players.map(player => ({ ...player, rank: player.rank || rankFor(player.name, player.creator) }))]));
}
function loadRoster() {
  try { const stored = JSON.parse(localStorage.getItem(SPDT_STORAGE_KEY)); if (stored?.left && stored?.right) return normaliseRoster(stored); } catch { /* use default */ }
  return rosterFromDefault();
}
function saveRoster(roster) { localStorage.setItem(SPDT_STORAGE_KEY, JSON.stringify(roster)); }
