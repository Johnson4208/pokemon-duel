import {makeBattle,act,validTeam} from './engine.mjs?v=grand-v2';
const VERSION=4,PREFIX='lingua-pokemon-v4-';
const readSave=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
export class Room {
 constructor({Peer,onChange=()=>{},onError=()=>{},onStatus=()=>{}}){this.Peer=Peer;this.onChange=onChange;this.onError=onError;this.onStatus=onStatus;this.epoch=0;this.reset();}
 reset(){this.host=false;this.connected=false;this.index=0;this.code='';this.conn=null;this.peer=null;this.battle=null;this.lobby={names:['Trainer 1','Trainer 2'],teams:[null,null],ready:[false,false],votes:[false,false],battlefield:'meadow'};}
 close(){this.epoch++;clearTimeout(this.timeout);clearTimeout(this.handshake);const peer=this.peer;this.reset();peer?.destroy();}
 snapshot(){return {index:this.index,host:this.host,code:this.code,connected:this.connected,lobby:structuredClone(this.lobby),battle:structuredClone(this.battle)};}
 persist(){if(this.code&&this.battle)save('duel-room:'+this.code,{host:this.host,lobby:this.lobby,battle:this.battle,guestToken:this.guestToken,token:this.token});}
 emit(){this.persist();this.onChange(this.snapshot());}
 send(data){if(this.conn?.open)this.conn.send({...data,v:VERSION});}
 sync(){this.send({type:'state',lobby:this.lobby,battle:this.battle});this.emit();}
 start(host,code,name,battlefield='meadow'){const cached=readSave('duel-room:'+code);this.close();this.host=host;this.index=host?0:1;this.code=code;this.lobby.names[this.index]=name;if(host)this.lobby.battlefield=['meadow','forest','desert','whitewood','ice-castle'].includes(battlefield)?battlefield:'meadow';this.token=cached?.token||Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');this.guestToken=cached?.guestToken||null;if(cached?.battle?.phase==='battle'&&cached.host===host){this.battle=cached.battle;this.lobby=cached.lobby;}const epoch=this.epoch;
  this.onStatus('Connecting to the room server…');
  try{this.peer=host?new this.Peer(PREFIX+code,window.POKEMON_NETWORK||{}):new this.Peer(window.POKEMON_NETWORK||{});}catch(e){this.onError('Could not start the connection: '+e.message);return;}
  this.timeout=setTimeout(()=>{if(epoch!==this.epoch)return;this.onError('Connection timed out. Check your network, then create or join the room again.');this.close();this.emit();},20000);
  this.peer.on('open',()=>{if(epoch!==this.epoch)return;if(host){clearTimeout(this.timeout);this.onStatus('Room open · waiting for a friend');this.emit();}else this.bind(this.peer.connect(PREFIX+code,{reliable:true,serialization:'json',metadata:{v:VERSION,name}}),epoch);});
  this.peer.on('connection',c=>{if(epoch!==this.epoch)return c.close();if(!host||this.conn){c.on('open',()=>{c.send({v:VERSION,type:'reject',reason:'This room already has 2 players.'});setTimeout(()=>c.close(),300);});return;}this.bind(c,epoch);});
  this.peer.on('error',e=>{if(epoch!==this.epoch)return;const messages={'peer-unavailable':'Room not found. Check the code and make sure the host has the page open.','unavailable-id':'This room code is already in use. Create a new room.','network':'Could not reach the room server. Check your network.','webrtc':'This network blocks direct connections. Try another network or ask the owner to configure TURN.'};this.onError(messages[e.type]||`Connection failed (${e.type||'unknown'}).`);this.close();this.emit();});
  this.peer.on('disconnected',()=>{if(epoch!==this.epoch)return;this.onStatus(this.connected?'Room server interrupted · the match is still connected directly':'Disconnected from the room server. Create the room again.');if(this.connected&&!this.peer.destroyed)try{this.peer.reconnect();}catch{};});
 }
 bind(c,epoch){this.conn=c;let opened=false;const handshake=this.handshake=setTimeout(()=>{if(epoch!==this.epoch||this.connected)return;this.onError('Could not connect to the other player. Try another network; restricted networks may need TURN.');this.close();this.emit();},20000);
  c.on('open',()=>{if(epoch!==this.epoch)return;opened=true;clearTimeout(this.timeout);if(!this.host)this.send({type:'hello',name:this.lobby.names[1],token:this.token});});
  c.on('data',data=>{if(epoch!==this.epoch||!opened)return;try{this.receive(data);}catch{this.onError('Invalid connection data.');}if(this.connected)clearTimeout(handshake);});
  c.on('close',()=>{clearTimeout(handshake);if(epoch!==this.epoch)return;this.connected=false;this.conn=null;this.onStatus('Paused · waiting for your opponent to rejoin with the same room code.');this.emit();});
  c.on('error',()=>{clearTimeout(handshake);if(epoch!==this.epoch)return;this.connected=false;this.conn=null;this.onStatus('Disconnected · rejoin with the same room code to continue.');this.emit();});
 }
 receive(d){if(!d||d.v!==VERSION||typeof d.type!=='string')return;
  if(!this.host){if(d.type==='reject'){this.onError(d.reason);this.close();this.emit();}else if(d.type==='state'&&d.lobby&&Array.isArray(d.lobby.names)&&d.lobby.names.length===2){this.connected=true;this.lobby=d.lobby;this.battle=d.battle;this.onStatus('Connected · 2 players in the room');this.emit();}return;}
  if(d.type==='hello'&&!this.connected){if(this.guestToken&&d.token!==this.guestToken){this.send({type:'reject',reason:'This room is reserved for its previous player. Rejoin using the same browser.'});const rejected=this.conn;this.conn=null;setTimeout(()=>rejected?.close(),100);return;}this.guestToken=d.token;this.connected=true;this.lobby.names[1]=typeof d.name==='string'?d.name.slice(0,20):'Trainer 2';this.onStatus('Connected · 2 players in the room');this.sync();}
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

