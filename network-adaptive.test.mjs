import {test} from 'node:test';import assert from 'node:assert/strict';import {EventEmitter} from 'node:events';import {Room} from './network.mjs';
const flush=()=>new Promise(resolve=>setImmediate(resolve));
class Clock{constructor(){this.now=0;this.next=0;this.jobs=new Map();}setTimeout(fn,ms){const id=++this.next;this.jobs.set(id,{at:this.now+ms,fn});return id;}clearTimeout(id){this.jobs.delete(id);}async tick(ms){const end=this.now+ms;let loops=0;for(;;){const entries=[...this.jobs.entries()].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at);if(!entries.length)break;if(++loops>1000)throw Error('Timer loop');const [id,job]=entries[0];this.now=job.at;this.jobs.delete(id);job.fn();await flush();}this.now=end;await flush();}}
const servers=[{urls:['turn:relay.example:3478?transport=udp','turn:relay.example:3478?transport=tcp','turns:relay.example:443?transport=tcp'],username:'test-temp',credential:'test-temp-password'}];
function setup(allow=()=>true){const peers=new Map(),dials=[],clock=new Clock(),storage=new Map();let sequence=0;
 globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
 class Connection extends EventEmitter{constructor(){super();this.open=false;this.closed=false;this.peerConnection=new EventTarget();this.peerConnection.iceConnectionState='checking';}send(value){if(this.open)queueMicrotask(()=>{if(this.other?.open)this.other.emit('data',structuredClone(value));});}close(){if(this.closed)return;this.closed=true;this.open=false;this.emit('close');this.other?.close();}ice(state){this.peerConnection.iceConnectionState=state;this.peerConnection.dispatchEvent(new Event('iceconnectionstatechange'));}}
 class Peer extends EventEmitter{constructor(id,options){super();this.id=typeof id==='string'?id:'guest'+(++sequence);this.options=typeof id==='string'?options:id;this.connections=[];this.destroyed=false;peers.set(this.id,this);queueMicrotask(()=>{if(!this.destroyed)this.emit('open');});}connect(id,options){const c=new Connection();this.connections.push(c);dials.push({config:structuredClone(this.options.config),c,peer:this});if(!allow(this.options.config))return c;queueMicrotask(()=>{const host=peers.get(id);if(!host){this.emit('error',{type:'peer-unavailable'});return;}const other=new Connection();other.metadata=options.metadata;other.other=c;c.other=other;host.connections.push(other);host.emit('connection',other);c.open=other.open=true;other.emit('open');c.emit('open');});return c;}destroy(){if(this.destroyed)return;this.destroyed=true;if(peers.get(this.id)===this)peers.delete(this.id);for(const c of this.connections)c.close();}reconnect(){this.disconnected=false;queueMicrotask(()=>this.emit('open'));}}
 const options={config:{iceServers:servers},handshakeTimeoutMs:5000,signalingTimeoutMs:10000,retryDelayMs:100,disconnectGraceMs:1000,maxConnectionAttempts:3};
 const create=(extra={})=>{const errors=[],snapshots=[];const room=new Room({Peer,clock,options,onError:e=>errors.push(e),onChange:s=>snapshots.push(s),...extra});return {room,errors,snapshots};};
 return {create,clock,dials,storage,peers,options};
}
test('automatic attempts fall back to relay then TCP/TLS; the host keeps the same room code',async()=>{
 const f=setup(cfg=>cfg.iceTransportPolicy==='relay'&&cfg.iceServers.every(s=>s.urls.every(url=>url.startsWith('turns:')||url.includes('transport=tcp')))),a=f.create(),b=f.create();
 try{a.room.start(true,'TESTROOM','Host');await flush();const hostPeer=a.room.peer;b.room.start(false,'TESTROOM','Guest');await flush();await f.clock.tick(5200);await f.clock.tick(5400);
 assert.equal(f.dials.length,3);assert.equal(f.dials[0].config.iceTransportPolicy,'all');assert.equal(f.dials[1].config.iceTransportPolicy,'relay');assert.ok(f.dials[2].config.iceServers[0].urls.every(url=>!url.includes('transport=udp')));assert.ok(a.room.connected&&b.room.connected);assert.equal(a.room.peer,hostPeer);assert.equal(a.room.code,'TESTROOM');assert.equal(b.errors.length,0);
 }finally{a.room.close();b.room.close();}
});
test('failed attempts stop at the limit; leaving cancels retries and old connection callbacks cannot reset a new one',async()=>{
 const f=setup(()=>false),a=f.create(),b=f.create();try{a.room.start(true,'TESTROOM','Host');await flush();b.room.start(false,'TESTROOM','Guest');await flush();const old=f.dials[0].c;await f.clock.tick(16000);assert.equal(f.dials.length,3);assert.equal(b.room.connection.phase,'failed');assert.equal(b.errors.length,1);assert.equal(a.room.code,'TESTROOM');assert.ok(a.room.peer);
 b.room.retry();await flush();assert.equal(f.dials.length,4);old.emit('error',Error('late error'));assert.equal(b.room.peer,f.dials[3].peer);b.room.close();await f.clock.tick(30000);assert.equal(f.dials.length,4);assert.equal(b.room.peer,null);
 }finally{a.room.close();b.room.close();}
});
test('VPN-like path loss reconnects automatically with the same player token and unchanged battle',async()=>{
 const f=setup(),a=f.create(),b=f.create();try{a.room.start(true,'TESTROOM','Host');await flush();b.room.start(false,'TESTROOM','Guest');await flush();a.room.ready([25,6,9]);b.room.ready([3,131,143]);await flush();const battle=structuredClone(a.room.battle),token=b.room.token,old=b.room.conn;
 old.ice('failed');assert.equal(a.room.connected,false);a.room.action({type:'move',index:0});assert.deepEqual(a.room.battle,battle);await f.clock.tick(150);assert.ok(a.room.connected&&b.room.connected);assert.equal(b.room.token,token);assert.deepEqual(b.room.battle,battle);assert.equal(f.dials.at(-1).config.iceTransportPolicy,'relay');
 old.emit('close');assert.ok(b.room.connected);assert.notEqual(b.room.conn,old);
 }finally{a.room.close();b.room.close();}
});
test('temporary ICE interruption recovers without replacing a healthy channel; signaling reopen never dials a duplicate',async()=>{
 const f=setup(),a=f.create(),b=f.create();try{a.room.start(true,'TESTROOM','Host');await flush();b.room.start(false,'TESTROOM','Guest');await flush();const channel=b.room.conn;channel.ice('disconnected');await f.clock.tick(500);channel.ice('connected');await f.clock.tick(1500);assert.equal(b.room.conn,channel);assert.equal(f.dials.length,1);
 b.room.peer.emit('open');await flush();assert.equal(b.room.conn,channel);assert.equal(f.dials.length,1);
 }finally{a.room.close();b.room.close();}
});
test('host connection failure leaves its room available for another incoming attempt',async()=>{
 const f=setup(),a=f.create(),b=f.create();try{a.room.start(true,'TESTROOM','Host');await flush();b.room.start(false,'TESTROOM','Guest');await flush();const host=a.room.peer;a.room.conn.ice('failed');assert.equal(a.room.peer,host);assert.equal(a.room.code,'TESTROOM');await f.clock.tick(150);assert.ok(a.room.connected&&b.room.connected);
 }finally{a.room.close();b.room.close();}
});
test('private relay credentials expire in memory; stale endpoint responses cannot reopen a room after leave',async()=>{
 const f=setup();let resolve;const room=f.create({options:{...f.options,turnCredentialsUrl:'https://access.example/credentials'},getToken:async()=> 'signed',fetcher:()=>new Promise(r=>resolve=r)}).room;
 room.start(true,'TESTROOM','Host');await flush();assert.equal(room.peer,null);assert.equal(room.connection.phase,'credentials');room.close();resolve(new Response(JSON.stringify({iceServers:servers,expiresAt:Date.now()+3600000})));await flush();await flush();assert.equal(room.peer,null);assert.equal(room.code,'');
});
test('a blocked authentication or credential request times out, uses fallback and remains cancelable',async()=>{
 const f=setup(),a=f.create({options:{...f.options,turnCredentialsUrl:'https://access.example/credentials',credentialsTimeoutMs:1000},getToken:()=>new Promise(()=>{})});try{a.room.start(true,'TESTROOM','Host');await f.clock.tick(1100);await flush();assert.ok(a.room.peer);assert.equal(a.room.connection.privateRelay,false);assert.match(a.room.connection.relayStatus,/timed out/);}finally{a.room.close();}
});
test('private relay setup offers its full transports before connecting and does not persist any credentials',async()=>{
 const f=setup(),a=f.create({options:{...f.options,turnCredentialsUrl:'https://access.example/credentials'},getToken:async()=> 'signed',fetcher:async()=>new Response(JSON.stringify({iceServers:servers,expiresAt:Date.now()+3600000}))});try{a.room.start(true,'TESTROOM','Host');await flush();await flush();assert.equal(a.room.connection.privateRelay,true);assert.deepEqual(a.room.peer.options.config.iceServers,servers);const stored=[...f.storage.values()].join('');assert.ok(!stored.includes('test-temp-password'));assert.ok(!JSON.stringify(a.room.snapshot()).includes('test-temp-password'));}finally{a.room.close();}
});
