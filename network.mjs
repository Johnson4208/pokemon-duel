import {makeBattle,act,validTeam} from './engine.mjs?v=grand-v2';
import {settings,routeConfig,routeName,fetchTurnCredentials} from './connection-options.mjs?v=adaptive-v1';
const VERSION=4,PREFIX='lingua-pokemon-v4-';
const readSave=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
export class Room {
 constructor({Peer,onChange=()=>{},onError=()=>{},onStatus=()=>{},getToken,fetcher=globalThis.fetch,clock={setTimeout:(fn,ms)=>setTimeout(fn,ms),clearTimeout:id=>clearTimeout(id)},options}={}){this.Peer=Peer;this.onChange=onChange;this.onError=onError;this.onStatus=onStatus;this.getToken=getToken;this.fetcher=fetcher;this.clock=clock;this.options=options;this.epoch=0;this.timers=new Set();this.reset();}
 reset(){this.host=false;this.connected=false;this.index=0;this.code='';this.conn=null;this.peer=null;this.battle=null;this.connecting=false;this.attempt=0;this.recovering=false;this.token=null;this.guestToken=null;this.connection={phase:'idle',route:'Automatic',attempt:0,maxAttempts:3,privateRelay:false,relayStatus:'Public relay only',iceState:'new'};this.lobby={names:['Trainer 1','Trainer 2'],teams:[null,null],ready:[false,false],votes:[false,false],battlefield:'meadow'};}
 later(fn,ms){const id=this.clock.setTimeout(()=>{this.timers.delete(id);fn();},ms);this.timers.add(id);return id;}
 cancel(id){if(id!==undefined){this.clock.clearTimeout(id);this.timers.delete(id);}}
 close(){this.epoch++;this.credentialsAbort?.abort();for(const id of this.timers)this.clock.clearTimeout(id);this.timers.clear();const peer=this.peer;this.reset();peer?.destroy();}
 snapshot(){return {index:this.index,host:this.host,code:this.code,connected:this.connected,lobby:structuredClone(this.lobby),battle:structuredClone(this.battle),connection:{...this.connection}};}
 persist(){if(this.code)save('duel-room:'+this.code,{host:this.host,lobby:this.lobby,battle:this.battle,guestToken:this.guestToken,token:this.token});}
 emit(){this.persist();this.onChange(this.snapshot());}
 status(message,phase){if(phase)this.connection.phase=phase;this.onStatus(message);}
 send(data){if(this.conn?.open)this.conn.send({...data,v:VERSION});}
 sync(){this.send({type:'state',lobby:this.lobby,battle:this.battle});this.emit();}
 start(host,code,name,battlefield='meadow'){
  const cached=readSave('duel-room:'+code);this.close();this.host=host;this.index=host?0:1;this.code=code;this.connecting=true;this.lobby.names[this.index]=name;if(host)this.lobby.battlefield=['meadow','forest','desert','whitewood','ice-castle'].includes(battlefield)?battlefield:'meadow';this.token=cached?.token||Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');this.guestToken=cached?.guestToken||null;
  if(cached?.battle?.phase==='battle'&&cached.host===host){this.battle=cached.battle;this.lobby=cached.lobby;}
  try{this.settings=settings(this.options||globalThis.window?.POKEMON_NETWORK||{});}catch(error){this.connecting=false;this.status('Connection configuration needs attention.','failed');this.onError(error.message);this.emit();return;}
  this.rtc=this.settings.rtc;if(this.settings.customIce)this.connection.relayStatus='Custom ICE configuration';this.connection.maxAttempts=this.settings.maxAttempts;const epoch=this.epoch;
  if(this.settings.credentialsUrl){this.status('Preparing a secure relay…','credentials');this.emit();void this.refreshCredentials(epoch).then(()=>{if(epoch===this.epoch)this.openPeer(epoch);});}else this.openPeer(epoch);
 }
 routeAttempt(){return this.host?0:this.attempt+(this.recovering?1:0);}
 async refreshCredentials(epoch){
  this.credentialsAbort?.abort();const controller=this.credentialsAbort=new AbortController(),timeout=this.later(()=>controller.abort(),this.settings.credentialMs);
  try{const data=await Promise.race([fetchTurnCredentials({url:this.settings.credentialsUrl,getToken:this.getToken,requireAuth:this.settings.requireAuth,fetcher:this.fetcher,signal:controller.signal}),new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(new DOMException('Timed out','AbortError')),{once:true}))]);if(epoch!==this.epoch)return;
   const stun=this.settings.rtc.iceServers.map(server=>({urls:server.urls.filter(url=>/^stuns?:/.test(url))})).filter(server=>server.urls.length);this.rtc={...this.rtc,iceServers:[...stun,...data.iceServers]};this.connection.privateRelay=true;this.connection.relayStatus=data.iceServers.some(s=>s.urls.some(url=>/^turns:/.test(url)||url.includes('transport=tcp')))?'Private relay configured · TCP/TLS offered':'Private relay configured · no TCP/TLS URL';
   this.cancel(this.credentialRefresh);this.credentialRefresh=this.later(()=>{if(epoch===this.epoch&&this.code)void this.refreshCredentials(epoch).then(()=>{if(epoch===this.epoch&&this.peer?.options)this.peer.options.config=routeConfig(this.rtc,this.routeAttempt());});},Math.max(60000,data.expiresAt-Date.now()-120000));
  }catch(error){if(epoch===this.epoch){this.connection.privateRelay=false;this.connection.relayStatus=error.name==='AbortError'?'Private relay timed out · using fallback configuration':error.message+' Using fallback configuration.';this.rtc=this.settings.rtc;this.cancel(this.credentialRefresh);this.credentialRefresh=this.later(()=>{if(epoch===this.epoch&&this.code)void this.refreshCredentials(epoch).then(()=>{if(epoch===this.epoch&&this.peer?.options)this.peer.options.config=routeConfig(this.rtc,this.routeAttempt());});},300000);}}
  finally{this.cancel(timeout);}
 }
 openPeer(epoch){
  if(epoch!==this.epoch)return;this.connecting=true;this.connection.attempt=this.attempt+1;this.connection.route=routeName(this.rtc,this.routeAttempt());this.connection.iceState='new';this.status(`Connecting · ${this.connection.route} · attempt ${this.attempt+1}/${this.settings.maxAttempts}`,'signaling');
  const peerOptions={...this.settings.peer,config:routeConfig(this.rtc,this.routeAttempt())};
  let peer;try{peer=this.host?new this.Peer(PREFIX+this.code,peerOptions):new this.Peer(peerOptions);}catch{this.fail('Could not initialize the connection. Refresh the page or use practice mode.',true);return;}this.peer=peer;const live=()=>epoch===this.epoch&&this.peer===peer;
  this.cancel(this.timeout);this.timeout=this.later(()=>{if(live())this.fail('The room server did not respond.');},this.settings.signalingMs);
  peer.on('open',()=>{if(!live())return;this.cancel(this.timeout);if(this.connected){this.status('Connected · 2 players in the room','connected');this.emit();return;}if(this.conn)return;if(this.host){this.connecting=false;this.status('Room open · waiting for a friend','waiting');this.emit();}else this.dial(epoch,peer);});
  peer.on('connection',c=>{if(!live())return c.close();if(!this.host||this.conn){c.on('open',()=>{c.send({v:VERSION,type:'reject',reason:'This room already has 2 players.'});this.later(()=>c.close(),300);});return;}this.bind(c,epoch,peer);});
  peer.on('error',error=>{if(!live())return;
   const messages={'peer-unavailable':'Room not found. Check the code and make sure the host has the page open.','unavailable-id':'This room code is already in use. Create a new room.','network':'Could not reach the room server.','webrtc':'The network could not establish a game connection.','server-error':'The room server is unavailable.','socket-error':'The room server connection failed.'};
   if(this.connected){this.status('Room server interrupted · the current match remains connected','connected');return;}
   this.fail(messages[error.type]||'The connection could not be established.',['peer-unavailable','unavailable-id','browser-incompatible','invalid-id','invalid-key'].includes(error.type));
  });
  peer.on('disconnected',()=>{if(!live())return;this.status(this.connected?'Room server interrupted · the current match remains connected':'Reconnecting to the room server…',this.connected?'connected':'signaling');let tries=0;const reconnect=()=>{if(!live()||!peer.disconnected)return;try{peer.reconnect();}catch{}if(++tries<this.settings.maxAttempts)this.later(reconnect,this.settings.retryMs*tries);else if(!this.connected){this.connecting=false;this.status('Room server disconnected. Select Retry connection.','failed');this.emit();}};this.later(reconnect,this.settings.retryMs);});
  this.emit();
 }
 dial(epoch,peer){if(epoch!==this.epoch||this.peer!==peer)return;try{const c=peer.connect(PREFIX+this.code,{reliable:true,serialization:'json',metadata:{v:VERSION,name:this.lobby.names[1]}});this.bind(c,epoch,peer);}catch{this.fail('Could not contact the host.');}}
 dropConnection(){this.cancel(this.handshake);this.cancel(this.disconnectTimer);this.cancel(this.gatherTimer);const c=this.conn;this.conn=null;this.statsFor=null;this.connected=false;c?.close();}
 fail(message,fatal=false){
  this.cancel(this.timeout);this.dropConnection();
  if(this.host&&this.peer&&!fatal){this.connecting=false;this.status('Player could not connect · room kept open for another attempt','waiting');this.connection.iceState='failed';this.connection.lastFailure=message;this.emit();return;}
  const peer=this.peer;this.peer=null;peer?.destroy();
  if(!fatal&&this.attempt+1<this.settings.maxAttempts){this.attempt++;this.connecting=true;this.status(`Retrying automatically · ${routeName(this.rtc,this.routeAttempt())} · attempt ${this.attempt+1}/${this.settings.maxAttempts}`,'retrying');const epoch=this.epoch;this.cancel(this.retryTimer);this.retryTimer=this.later(()=>this.openPeer(epoch),this.settings.retryMs*this.attempt);this.emit();return;}
  this.connecting=false;this.status('Connection paused · select Retry connection','failed');this.onError(message+(fatal?'':' All automatic attempts were used. Retry after checking your network or relay setup.'));this.emit();
 }
 bind(c,epoch,peer){
  this.conn=c;const live=()=>epoch===this.epoch&&this.peer===peer&&this.conn===c;let opened=false;
  this.connecting=true;this.status(`Connecting to player · ${this.connection.route}`,'handshake');
  this.cancel(this.handshake);this.handshake=this.later(()=>{if(live()&&!this.connected)this.fail('Could not connect to the other player.');},this.settings.handshakeMs);
  c.on('open',()=>{if(!live())return;opened=true;this.cancel(this.timeout);if(!this.host)this.send({type:'hello',name:this.lobby.names[1],token:this.token});});
  c.on('data',data=>{if(!live()||!opened)return;try{this.receive(data);}catch{this.onError('Invalid connection data.');}if(this.connected){this.connecting=false;this.cancel(this.handshake);this.cancel(this.disconnectTimer);if(this.statsFor!==c){this.statsFor=c;void this.describeRoute(c);this.later(()=>this.describeRoute(c),1000);}}});
  const lost=()=>{if(!live())return;this.cancel(this.handshake);const wasConnected=this.connected;this.connected=false;if(!this.host&&wasConnected){this.attempt=-1;this.recovering=true;}if(this.host){this.dropConnection();this.connecting=false;if(!this.battle)this.lobby.ready=[false,false];this.status('Waiting for your opponent to reconnect · same room code','waiting');this.emit();}else this.fail('The game connection was interrupted.');};
  c.on('close',lost);c.on('error',lost);
  const pc=c.peerConnection;
  if(pc?.addEventListener){const state=()=>{if(!live())return;this.connection.iceState=pc.iceConnectionState||pc.connectionState||'unknown';if(['failed','closed'].includes(this.connection.iceState))lost();else if(this.connection.iceState==='disconnected'){this.cancel(this.disconnectTimer);this.disconnectTimer=this.later(()=>{if(live()&&pc.iceConnectionState==='disconnected')lost();},this.settings.graceMs);}else if(['connected','completed'].includes(this.connection.iceState))this.cancel(this.disconnectTimer);};pc.addEventListener('iceconnectionstatechange',state);}
  this.emit();
 }
 async describeRoute(c){
  if(!c.peerConnection?.getStats)return;
  try{const stats=await c.peerConnection.getStats();if(this.conn!==c||!this.connected)return;let pair;stats.forEach(item=>{if(item.type==='transport'&&item.selectedCandidatePairId)pair=stats.get(item.selectedCandidatePairId);});if(!pair)stats.forEach(item=>{if(item.type==='candidate-pair'&&item.state==='succeeded'&&item.nominated)pair=item;});if(!pair)return;const local=stats.get(pair.localCandidateId),remote=stats.get(pair.remoteCandidateId),relay=local?.candidateType==='relay'||remote?.candidateType==='relay';this.connection.route=relay?'Relay'+(local?.relayProtocol?' · '+local.relayProtocol.toUpperCase():''):'Direct'+(local?.protocol?' · '+local.protocol.toUpperCase():'');this.connection.iceState='connected';this.status('Connected · 2 players · '+this.connection.route,'connected');this.emit();}catch{}
 }
 retry(){if(!this.code||this.connected||this.connecting)return;this.cancel(this.retryTimer);this.attempt=0;this.recovering=false;this.connecting=true;const epoch=this.epoch;const begin=()=>{if(epoch!==this.epoch)return;if(this.host&&this.peer&&!this.peer.destroyed){if(this.peer.options)this.peer.options.config=routeConfig(this.rtc,0);if(this.peer.disconnected)try{this.peer.reconnect();}catch{}this.connecting=false;this.status('Room open · waiting for a friend to retry','waiting');this.emit();}else this.openPeer(epoch);};if(this.settings.credentialsUrl){this.status('Refreshing secure relay access…','credentials');this.emit();void this.refreshCredentials(epoch).then(begin);}else begin();}
 receive(d){if(!d||d.v!==VERSION||typeof d.type!=='string')return;
  if(!this.host){if(d.type==='reject'){this.fail(typeof d.reason==='string'?d.reason:'The room rejected this connection.',true);}else if(d.type==='state'&&d.lobby&&Array.isArray(d.lobby.names)&&d.lobby.names.length===2){this.connected=true;this.connecting=false;this.lobby=d.lobby;this.battle=d.battle;this.status('Connected · 2 players in the room','connected');this.emit();}return;}
  if(d.type==='hello'&&!this.connected){if(this.guestToken&&d.token!==this.guestToken){this.send({type:'reject',reason:'This room is reserved for its previous player. Rejoin using the same browser.'});const rejected=this.conn;this.conn=null;this.cancel(this.handshake);this.connecting=false;this.later(()=>rejected?.close(),100);this.emit();return;}this.guestToken=d.token;this.connected=true;this.connecting=false;this.lobby.names[1]=typeof d.name==='string'?d.name.slice(0,20):'Trainer 2';this.status('Connected · 2 players in the room','connected');this.sync();}
  else if(!this.connected)return;
  else if(d.type==='ready')this.setReady(1,d.team);
  else if(d.type==='action')this.apply(1,d.action,d.revision);
  else if(d.type==='rematch')this.vote(1);
 }
 ready(team){if(!this.connected)return;if(this.host)this.setReady(0,team);else this.send({type:'ready',team});}
 setReady(i,team){if(this.battle||!validTeam(team)||this.lobby.ready[i])return;this.lobby.teams[i]=[...team];this.lobby.ready[i]=true;if(this.lobby.ready.every(Boolean)){this.battle=makeBattle(this.lobby.teams,this.lobby.names,crypto.getRandomValues(new Uint32Array(1))[0]);this.battle.battlefield=this.lobby.battlefield||'meadow';}this.sync();}
 setBattlefield(id){if(!this.host||this.battle||this.lobby.ready.some(Boolean)||!['meadow','forest','desert','whitewood','ice-castle'].includes(id))return;this.lobby.battlefield=id;this.sync();}
 action(action){if(!this.connected||!this.battle)return;if(this.host)this.apply(0,action,this.battle.revision);else this.send({type:'action',action,revision:this.battle.revision});}
 apply(i,action,revision){if(!this.connected)return;const r=act(this.battle,i,action,revision);if(r.ok){this.battle=r.state;this.sync();}}
 rematch(){if(this.host)this.vote(0);else this.send({type:'rematch'});}
 vote(i){if(this.battle?.phase!=='finished')return;this.lobby.votes[i]=true;if(this.lobby.votes.every(Boolean)){this.battle=null;this.lobby.teams=[null,null];this.lobby.ready=[false,false];this.lobby.votes=[false,false];}this.sync();}
}
