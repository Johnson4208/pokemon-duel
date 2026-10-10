// Application smoke test with a DOM stub; this is not a browser/layout test.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('./duel.html',import.meta.url),'utf8');
const timers=new Map();let timerId=0;
class Element{constructor(id){this.id=id;this.hidden=false;this.disabled=false;this.value='';this.textContent='';this.innerHTML='';this.open=false;this.listeners={};this.attrs={};this.parentElement={scrollTop:0,scrollHeight:200};this.classList={toggle(){},remove(){},add(){}};}addEventListener(event,fn){this.listeners[event]=fn;}setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}showModal(){this.open=true;}close(){this.open=false;}click(){if(!this.disabled)this.onclick?.();}}
const elements=new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element(m[1])]));
globalThis.document={getElementById:id=>{assert.ok(elements.has(id),`Missing static HTML ID: ${id}`);return elements.get(id);}};
const learner={user:null,profile:{nickname:'Explorer',owned:[25,133,3,6,9,94,131,282,448,143,149,445]},addEventListener(){}};
globalThis.window={addEventListener(){},POKEMON_NETWORK:{},parent:{LinguaAccount:learner}};
globalThis.location={href:'https://example.github.io/little-lingua/pokemon/'};
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
globalThis.setTimeout=(cb,ms)=>{const id=++timerId;timers.set(id,{cb,ms});return id;};globalThis.clearTimeout=id=>timers.delete(id);
const el=id=>elements.get(id);
const ai=()=>{for(const [id,t]of timers)if(t.ms===950){timers.delete(id);t.cb();return true;}return false;};
await import('./app.mjs');
test('app initialization, selection, practice through result, rematch and exit',()=>{
 assert.equal((el('roster').innerHTML.match(/class="pokemon-card/g)||[]).length,12);
 assert.equal(el('selection-count').textContent,'3 / 3');
 learner.profile.nickname='<script>unsafe</script>';
 el('practice').click();assert.equal(el('battle').hidden,false);assert.equal(el('lobby').hidden,true);
 ai();assert.ok(el('self-info').innerHTML.includes('&lt;script&gt;'));
 if(el('guard').disabled)ai();el('guard').click();ai();
 let steps=0;
 while(!el('result-dialog').open&&steps++<250){if(ai())continue;const candidates=[...el('moves').innerHTML.matchAll(/<button[^>]*data-move="(\d+)"[^>]*>/g)],candidate=candidates.find(m=>!m[0].includes('disabled'));
  if(candidate){const button={disabled:false,dataset:{move:candidate[1]},hasAttribute:()=>false};el('moves').listeners.click({target:{closest:()=>button}});}else{const button={disabled:false,dataset:{},hasAttribute:()=>true};el('moves').listeners.click({target:{closest:()=>button}});}
 }
 assert.equal(el('result-dialog').open,true);assert.ok(steps<250);assert.match(el('result-copy').textContent,/đã thắng/);assert.ok(storage.has('pokemon-score:guest'));
 el('rematch').click();assert.equal(el('result-dialog').open,false);assert.equal(el('battle').hidden,false);
 el('exit-battle').click();assert.equal(el('confirm-dialog').open,true);el('confirm-leave').click();assert.equal(el('battle').hidden,true);assert.equal(el('lobby').hidden,false);assert.equal(el('confirm-dialog').open,false);
});
test('invalid room code and unavailable connection library show readable feedback',()=>{el('room-code').value='BAD';el('join-room').click();assert.match(el('toast').textContent,/8 ký tự/);el('create-room').click();assert.equal(el('network-error').hidden,false);assert.match(el('network-error').textContent,/Thư viện/);});

test('return to Lingua closes the embedded battle without navigating inside the frame',()=>{
 const messages=[];window.parent.postMessage=(data,origin)=>messages.push({data,origin});location.origin='https://example.github.io';
 el('practice').click();let prevented=false;el('return-lingua').onclick({preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(el('battle').hidden,true);assert.equal(el('lobby').hidden,false);assert.ok(![...timers.values()].some(t=>t.ms===950));
 assert.deepEqual(messages,[{data:{type:'lingua:close-duel'},origin:location.origin}]);
});
