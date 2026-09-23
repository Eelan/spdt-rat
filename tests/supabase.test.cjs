const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(responses, configured = true) {
  const calls = [];
  const context = { window: { SPDT_CONFIG: configured ? {supabaseUrl:'https://example.supabase.co/',supabaseKey:'sb_publishable_test'} : {} }, fetch: async (url,options) => {
    calls.push({url,options}); const response = responses.shift();
    return { ok: response.status < 400, status: response.status, json: async () => response.body };
  }};
  vm.createContext(context); vm.runInContext(fs.readFileSync('supabase.js','utf8'),context);
  return {context,calls};
}
test('public read groups players and does not use publishable key as bearer', async () => {
  const {context,calls} = setup([{status:200,body:[{id:'a',team:'left'},{id:'b',team:'right'}]}]);
  const roster = await context.loadRoster();
  assert.equal(roster.left[0].id,'a'); assert.equal(roster.right[0].id,'b');
  assert.equal(calls[0].options.headers.Authorization,undefined);
  assert.equal(calls[0].options.headers.apikey,'sb_publishable_test');
});
test('public update sends only the changed field without a user token', async () => {
  const {context,calls} = setup([{status:200,body:[{id:'a',name:'Updated'}]}]);
  await context.writePlayer('a',{name:'Updated'});
  assert.equal(calls[0].options.method,'PATCH');
  assert.equal(calls[0].options.headers.Authorization,undefined);
  assert.equal(calls[0].options.body,'{"name":"Updated"}');
});
test('failed and silently denied writes report failure', async () => {
  const {context} = setup([{status:403},{status:200,body:[]}]);
  await assert.rejects(context.writePlayer('a',{name:'Test'}),/ne sont pas autorisées/);
  await assert.rejects(context.deletePlayer('a'),/non autorisée/);
});
test('missing config fails before network', async () => {
  const {context,calls} = setup([],false);
  await assert.rejects(context.loadRoster(),/config.js/); assert.equal(calls.length,0);
});
test('migration enables RLS with separate public read and restricted writes', () => {
  const sql = fs.readFileSync('supabase/001_roster.sql','utf8');
  assert.match(sql,/enable row level security/);
  assert.equal((sql.match(/app_metadata/g)||[]).length,4);
  assert.equal((sql.match(/^\('(left|right)'/gm)||[]).length,99);
});
