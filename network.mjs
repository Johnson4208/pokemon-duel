import {makeBattle,act,validTeam} from './engine.mjs';
const VERSION=1,PREFIX='lingua-pokemon-v1-';
export class Room {
 constructor({Peer,onChange=()=>{},onError=()=>{},onStatus=()=>{}}){this.Peer=Peer;this.onChange=onChange;this.onError=onError;this.onStatus=onStatus;this.epoch=0;this.reset();}
 reset(){this.host=false;this.connected=false;this.index=0;this.code='';this.conn=null;this.peer=null;this.battle=null;this.lobby={names:['Trainer 1','Trainer 2'],teams:[null,null],ready:[false,false],votes:[false,false]};}
 close(){this.epoch++;clearTimeout(this.timeout);clearTimeout(this.handshake);const peer=this.peer;this.reset();peer?.destroy();}
 snapshot(){return {index:this.index,host:this.host,code:this.code,connected:this.connected,lobby:structuredClone(this.lobby),battle:structuredClone(this.battle)};}
 emit(){this.onChange(this.snapshot());}
 send(data){if(this.conn?.open)this.conn.send({...data,v:VERSION});}
 sync(){this.send({type:'state',lobby:this.lobby,battle:this.battle});this.emit();}
 start(host,code,name){this.close();this.host=host;this.index=host?0:1;this.code=code;this.lobby.names[this.index]=name;const epoch=this.epoch;
  this.onStatus('Đang kết nối máy chủ phòng…');
  try{this.peer=host?new this.Peer(PREFIX+code,window.POKEMON_NETWORK||{}):new this.Peer(window.POKEMON_NETWORK||{});}catch(e){this.onError('Không khởi tạo được kết nối: '+e.message);return;}
  this.timeout=setTimeout(()=>{if(epoch!==this.epoch)return;this.onError('Kết nối quá lâu. Kiểm tra mạng rồi tạo / vào phòng lại.');this.close();this.emit();},20000);
  this.peer.on('open',()=>{if(epoch!==this.epoch)return;if(host){clearTimeout(this.timeout);this.onStatus('Phòng đã mở · chờ người thứ hai');this.emit();}else this.bind(this.peer.connect(PREFIX+code,{reliable:true,serialization:'json',metadata:{v:VERSION,name}}),epoch);});
  this.peer.on('connection',c=>{if(epoch!==this.epoch)return c.close();if(!host||this.conn){c.on('open',()=>{c.send({v:VERSION,type:'reject',reason:'Phòng đã đủ 2 người.'});setTimeout(()=>c.close(),300);});return;}this.bind(c,epoch);});
  this.peer.on('error',e=>{if(epoch!==this.epoch)return;const messages={'peer-unavailable':'Không tìm thấy phòng. Kiểm tra mã và đảm bảo chủ phòng đang mở trang.','unavailable-id':'Mã phòng đã được dùng. Hãy tạo lại.','network':'Không kết nối được máy chủ phòng. Kiểm tra mạng.','webrtc':'Mạng hiện tại chặn kết nối trực tiếp. Thử mạng khác hoặc cấu hình TURN.'};this.onError(messages[e.type]||`Kết nối thất bại (${e.type||'unknown'}).`);this.close();this.emit();});
  this.peer.on('disconnected',()=>{if(epoch!==this.epoch)return;this.onStatus(this.connected?'Máy chủ phòng gián đoạn · trận đang kết nối trực tiếp':'Mất kết nối máy chủ phòng. Hãy tạo lại phòng.');if(this.connected&&!this.peer.destroyed)try{this.peer.reconnect();}catch{};});
 }
 bind(c,epoch){this.conn=c;let opened=false;const handshake=this.handshake=setTimeout(()=>{if(epoch!==this.epoch||this.connected)return;this.onError('Chưa kết nối được người chơi. Thử mạng khác; mạng hạn chế có thể cần TURN.');this.close();this.emit();},20000);
  c.on('open',()=>{if(epoch!==this.epoch)return;opened=true;clearTimeout(this.timeout);if(!this.host)this.send({type:'hello',name:this.lobby.names[1]});});
  c.on('data',data=>{if(epoch!==this.epoch||!opened)return;try{this.receive(data);}catch{this.onError('Gói dữ liệu không hợp lệ.');}if(this.connected)clearTimeout(handshake);});
  c.on('close',()=>{clearTimeout(handshake);if(epoch!==this.epoch)return;this.onError('Người chơi còn lại đã rời phòng. Trận đã dừng; tạo phòng mới để chơi tiếp.');this.close();this.emit();});
  c.on('error',()=>{clearTimeout(handshake);if(epoch!==this.epoch)return;this.onError('Đường truyền bị gián đoạn. Hãy tạo phòng mới.');this.close();this.emit();});
 }
 receive(d){if(!d||d.v!==VERSION||typeof d.type!=='string')return;
  if(!this.host){if(d.type==='reject'){this.onError(d.reason);this.close();this.emit();}else if(d.type==='state'&&d.lobby&&Array.isArray(d.lobby.names)&&d.lobby.names.length===2){this.connected=true;this.lobby=d.lobby;this.battle=d.battle;this.onStatus('Đã kết nối · 2 người trong phòng');this.emit();}return;}
  if(d.type==='hello'&&!this.connected){this.connected=true;this.lobby.names[1]=typeof d.name==='string'?d.name.slice(0,20):'Trainer 2';this.onStatus('Đã kết nối · 2 người trong phòng');this.sync();}
  else if(!this.connected)return;
  else if(d.type==='ready')this.setReady(1,d.team);
  else if(d.type==='action')this.apply(1,d.action,d.revision);
  else if(d.type==='rematch')this.vote(1);
 }
 ready(team){if(!this.connected)return;if(this.host)this.setReady(0,team);else this.send({type:'ready',team});}
 setReady(i,team){if(this.battle||!validTeam(team)||this.lobby.ready[i])return;this.lobby.teams[i]=[...team];this.lobby.ready[i]=true;if(this.lobby.ready.every(Boolean))this.battle=makeBattle(this.lobby.teams,this.lobby.names,crypto.getRandomValues(new Uint32Array(1))[0]);this.sync();}
 action(action){if(!this.connected||!this.battle)return;if(this.host)this.apply(0,action,this.battle.revision);else this.send({type:'action',action,revision:this.battle.revision});}
 apply(i,action,revision){const r=act(this.battle,i,action,revision);if(r.ok){this.battle=r.state;this.sync();}}
 rematch(){if(this.host)this.vote(0);else this.send({type:'rematch'});}
 vote(i){if(this.battle?.phase!=='finished')return;this.lobby.votes[i]=true;if(this.lobby.votes.every(Boolean)){this.battle=null;this.lobby.teams=[null,null];this.lobby.ready=[false,false];this.lobby.votes=[false,false];}this.sync();}
}
