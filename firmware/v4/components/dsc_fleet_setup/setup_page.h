#pragma once
// Minimal captive setup UI for DSC-HUB SoftAP (served from flash).
static const char SETUP_PAGE_HTML[] = R"HTML(<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>DSC Setup</title>
<style>
:root{--bg:#0f1714;--card:#1a2822;--fg:#e8f0eb;--muted:#8aa396;--acc:#3d9b6e;--warn:#c4a035}
*{box-sizing:border-box}body{margin:0;font:16px/1.45 system-ui,sans-serif;background:linear-gradient(160deg,#0f1714,#15241c 50%,#0c1210);color:var(--fg);min-height:100vh}
main{max-width:420px;margin:0 auto;padding:1.25rem}
h1{font-size:1.35rem;margin:0 0 .25rem}p.lead{color:var(--muted);margin:0 0 1.25rem}
.card{background:var(--card);border-radius:12px;padding:1rem;margin:0 0 1rem}
label{display:block;font-size:.85rem;color:var(--muted);margin:.6rem 0 .25rem}
input,select,button{width:100%;padding:.7rem .75rem;border-radius:8px;border:1px solid #2d4038;background:#101a16;color:var(--fg);font:inherit}
button{background:var(--acc);border:none;font-weight:600;margin-top:.75rem;cursor:pointer}
button.secondary{background:#2a3d34}button:disabled{opacity:.5}
.row{display:flex;gap:.5rem}.row>*{flex:1}
.peer{font-size:.9rem;padding:.4rem 0;border-bottom:1px solid #24352e}.peer:last-child{border:0}
.ok{color:var(--acc)}.warn{color:var(--warn)}.err{color:#d66}
.note{font-size:.8rem;color:var(--muted);margin-top:.75rem}
</style>
</head>
<body>
<main>
<h1>Digital Stealth Care</h1>
<p class="lead">Set up HUB, Control, and pot sensors — no Home Assistant required.</p>
<div class="card" id="statusCard"><div id="status">Loading…</div></div>
<div class="card" id="modeCard">
<label>Network mode</label>
<select id="mode">
<option value="home">Home Wi‑Fi (internet optional)</option>
<option value="local">Local only (HUB hotspot)</option>
</select>
<div id="homeFields">
<label>2.4 GHz SSID</label>
<select id="ssidSelect"><option value="">Scanning…</option></select>
<input id="ssidCustom" placeholder="Or type SSID" style="margin-top:.4rem"/>
<label>Password</label>
<input id="pass" type="password" autocomplete="current-password"/>
<p class="note">Use a <b>fixed 2.4 GHz channel</b>. Mesh/Nest channel hops break ESP‑NOW.</p>
</div>
<div id="localFields" style="display:none">
<p class="note">Control and pots will join this HUB hotspot. No router needed. Photoperiod clock can be set below if you have no internet.</p>
<label>Set time (optional, local)</label>
<input id="timeLocal" type="datetime-local"/>
</div>
<div class="row">
<button id="btnApply">Save &amp; continue</button>
</div>
<p id="msg" class="note"></p>
</div>
<div class="card">
<strong>Devices</strong>
<div id="peers">Power Control and pots nearby — they join automatically.</div>
<div class="row">
<button class="secondary" id="btnRefresh">Refresh</button>
<button class="secondary" id="btnAdd">Add device window</button>
</div>
<button class="secondary" id="btnDone">Finish setup</button>
<button class="secondary" id="btnReset">Factory reset fleet config</button>
</div>
</main>
<script>
const $ = id => document.getElementById(id);
function showMsg(t, cls){ const el=$('msg'); el.className='note '+(cls||''); el.textContent=t||''; }
async function api(path, opts){
  const r = await fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, opts||{}));
  const t = await r.text();
  let j={}; try{j=JSON.parse(t)}catch(e){j={raw:t}}
  if(!r.ok) throw new Error(j.error||t||r.status);
  return j;
}
function renderStatus(s){
  const mode = s.net_mode==='home'?'Home Wi‑Fi':(s.net_mode==='local'?'Local hotspot':'Not configured');
  $('status').innerHTML = `<div><b>${s.hub_ssid||s.setup_ssid}</b></div>
    <div class="note">Mode: ${mode} · Hub MAC ${s.hub_mac||'—'}</div>
    <div class="note">${s.channel_note||''}</div>`;
  let html='';
  (s.peers||[]).forEach(p=>{
    html += `<div class="peer"><span class="ok">●</span> ${p.role} <b>${p.name||''}</b><br/><span class="note">${p.mac}</span></div>`;
  });
  $('peers').innerHTML = html || '<div class="note">Waiting for Control / pots…</div>';
  if(s.aps && s.aps.length){
    const sel=$('ssidSelect');
    const cur=sel.value;
    sel.innerHTML = '<option value="">Select network…</option>' + s.aps.map(a=>`<option value="${a.ssid}">${a.ssid} (${a.rssi}dBm)</option>`).join('');
    if(cur) sel.value=cur;
  }
}
async function refresh(){
  try{
    const s = await api('/setup/status');
    renderStatus(s);
  }catch(e){ showMsg(String(e),'err'); }
}
$('mode').onchange = ()=>{
  const local = $('mode').value==='local';
  $('homeFields').style.display = local?'none':'block';
  $('localFields').style.display = local?'block':'none';
};
$('btnApply').onclick = async ()=>{
  showMsg('Saving…');
  const mode=$('mode').value;
  const body={mode};
  if(mode==='home'){
    body.ssid = $('ssidCustom').value.trim() || $('ssidSelect').value;
    body.password = $('pass').value;
    if(!body.ssid){ showMsg('Choose or type an SSID','err'); return; }
  }
  if($('timeLocal').value) body.time_local = $('timeLocal').value;
  try{
    await api('/setup/mode',{method:'POST',body:JSON.stringify(body)});
    showMsg('Saved. Keep this page open and power Control, pots, then the ETH01 bridge.','ok');
    refresh();
  }catch(e){ showMsg(String(e),'err'); }
};
$('btnRefresh').onclick = refresh;
$('btnAdd').onclick = async ()=>{
  try{ await api('/setup/add-device',{method:'POST',body:'{}'}); showMsg('Setup hotspot open for pairing','ok'); refresh(); }
  catch(e){ showMsg(String(e),'err'); }
};
$('btnDone').onclick = async ()=>{
  try{ await api('/setup/complete',{method:'POST',body:'{}'}); showMsg('Setup complete. You can leave this network.','ok'); refresh(); }
  catch(e){ showMsg(String(e),'err'); }
};
$('btnReset').onclick = async ()=>{
  if(!confirm('Erase fleet Wi‑Fi / pairing on this HUB?')) return;
  try{ await api('/setup/reset',{method:'POST',body:'{}'}); showMsg('Reset. Reconfigure mode.','warn'); refresh(); }
  catch(e){ showMsg(String(e),'err'); }
};
refresh();
setInterval(refresh, 4000);
</script>
</body>
</html>)HTML";
