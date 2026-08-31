# Paste into browser_exec — creates one 4x8 stock plant from COMPOSE page.
# Args via globals: STRAIN_SEARCH, STRAIN_PICK, NICK, SPROUT, VESSEL_BTN, PRESET_BTN

import time

def wait(ms=800):
    time.sleep(ms / 1000)

def j(code):
    return js(code)

def goto_compose():
    goto_url("http://192.168.86.48:8787/#/grow/compose")
    wait_for_load()
    wait(2000)

def search_strain(q):
    j(
        "(function(){const inp=[...document.querySelectorAll('input')].find(i=>i.placeholder&&i.placeholder.toLowerCase().includes('strain'));if(inp){inp.focus();inp.value="
        + repr(q)
        + ";inp.dispatchEvent(new Event('input',{bubbles:true}));return 'ok';}return 'no';})()"
    )
    wait(1200)

def pick_strain(part):
    return j(
        "(function(){const p="
        + repr(part)
        + ";const b=[...document.querySelectorAll('.dsc-catalog-hits button')].find(x=>x.innerText.includes(p));if(!b)return 'not found';b.click();return b.innerText.slice(0,80);})()"
    )

def set_nick(n):
    j("(function(){const el=document.querySelector('[data-entity-id=\"input_text.dsc_build_nickname\"] input');if(el){el.focus();el.click();return 'ok';}return 'no';})()")
    wait(200)
    type_text(n)
    wait(400)

def set_sprout(d):
    return j(
        "(function(){const el=document.querySelector('[data-entity-id=\"input_datetime.dsc_build_sprout_date\"] input');if(!el)return 'no';el.value="
        + repr(d)
        + ";el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return el.value;})()"
    )

def set_probe_none():
    return j(
        "(function(){const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.value==='none'));sel.value='none';sel.dispatchEvent(new Event('change',{bubbles:true}));return sel.value;})()"
    )

def set_tent_4x8():
    return j(
        "(function(){const sel=[...document.querySelectorAll('label')].find(l=>l.innerText.includes('TENT'))?.querySelector('select');sel.value='4x8';sel.dispatchEvent(new Event('change',{bubbles:true}));return sel.value;})()"
    )

def click_next():
    j("document.querySelector('.dsc-wizard-footer button.dsc-btn-primary')?.click()")
    wait(1200)

def pick_preset(name):
    j(
        "(function(){const b=[...document.querySelectorAll('button')].find(x=>x.innerText.trim()==="
        + repr(name)
        + ");if(b)b.click();return 'ok';})()"
    )
    wait(500)

def pick_vessel(part):
    j(
        "(function(){const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes("
        + repr(part)
        + "));if(b)b.click();})()"
    )
    wait(500)

def skip_light():
    j("(function(){const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Skip light'));if(b)b.click();})()")
    wait(1500)

def commit_stock():
    j("(function(){const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Add to roster'));if(b)b.click();return b?.innerText;})()")
    wait(1200)
    j("(function(){const b=[...document.querySelectorAll('button')].find(x=>x.innerText.trim()==='Add to roster (stock)'||x.innerText.trim().startsWith('Add to roster'));if(b)b.click();return 'confirm';})()")
    wait(4000)

# --- run one plant ---
goto_compose()
search_strain(STRAIN_SEARCH)
print("pick:", pick_strain(STRAIN_PICK))
wait(800)
set_nick(NICK)
print("sprout:", set_sprout(SPROUT))
print("probe:", set_probe_none())
print("tent:", set_tent_4x8())
wait(500)
print("next1:", j("document.querySelector('.dsc-wizard-step.is-current .dsc-wizard-step-label')?.innerText"))
click_next()
pick_preset(PRESET_BTN)
pick_vessel(VESSEL_BTN)
click_next()  # feed
click_next()  # light -> or skip
skip_light()
print("review:", j("document.querySelector('.dsc-wizard-summary')?.innerText"))
commit_stock()
print("done:", NICK)
goto_url("http://192.168.86.48:8787/#/grow/roster")
wait_for_load()
wait(2000)
print(j("document.body.innerText.match(/ROSTER[\\s\\S]*/)?.[0]?.slice(0,1200)"))
