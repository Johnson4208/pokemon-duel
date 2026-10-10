export const TYPES={electric:['Điện','#edb72e','⚡'],fire:['Lửa','#ee7752','🔥'],water:['Nước','#599fe1','💧'],grass:['Cỏ','#6dad69','🌿'],ghost:['Ma','#967bc5','👻'],dragon:['Rồng','#7a82d1','🐉'],normal:['Thường','#a79c8c','✦'],fighting:['Giác đấu','#c16d66','🥊'],psychic:['Siêu linh','#d278a3','🔮'],ground:['Đất','#b99b6b','⛰'],ice:['Băng','#78bfc3','❄']};
const move=(name,type,power,pp=10,accuracy=100)=>({name,type,power,pp,accuracy});
export const ROSTER=[
{id:25,name:'Pikachu',type:'electric',hp:120,attack:56,defense:44,speed:90,moves:[move('Thunderbolt','electric',65),move('Quick Attack','normal',45,15),move('Thunder','electric',90,5,75),move('Iron Tail','normal',70,8,90)]},
{id:6,name:'Charizard',type:'fire',hp:155,attack:68,defense:61,speed:100,moves:[move('Flamethrower','fire',65),move('Dragon Claw','dragon',55),move('Fire Blast','fire',90,5,75),move('Slash','normal',50,15)]},
{id:9,name:'Blastoise',type:'water',hp:165,attack:64,defense:78,speed:78,moves:[move('Surf','water',65),move('Ice Beam','ice',55),move('Hydro Pump','water',90,5,75),move('Bite','normal',50,15)]},
{id:3,name:'Venusaur',type:'grass',hp:160,attack:65,defense:69,speed:80,moves:[move('Energy Ball','grass',65),move('Tackle','normal',45,15),move('Solar Beam','grass',90,5,75),move('Earth Power','ground',55)]},
{id:94,name:'Gengar',type:'ghost',hp:130,attack:76,defense:50,speed:110,moves:[move('Shadow Ball','ghost',65),move('Psychic','psychic',55),move('Shadow Storm','ghost',90,5,75),move('Thunderbolt','electric',55)]},
{id:149,name:'Dragonite',type:'dragon',hp:175,attack:74,defense:69,speed:80,moves:[move('Dragon Pulse','dragon',65),move('Fire Punch','fire',55),move('Outrage','dragon',90,5,75),move('Ice Punch','ice',55)]},
{id:143,name:'Snorlax',type:'normal',hp:220,attack:68,defense:59,speed:30,moves:[move('Body Slam','normal',65),move('Earthquake','ground',55),move('Giga Impact','normal',90,5,75),move('Ice Punch','ice',55)]},
{id:448,name:'Lucario',type:'fighting',hp:145,attack:76,defense:58,speed:90,moves:[move('Aura Sphere','fighting',65),move('Dragon Pulse','dragon',55),move('Close Combat','fighting',90,5,75),move('Quick Attack','normal',45,15)]},
{id:282,name:'Gardevoir',type:'psychic',hp:140,attack:78,defense:51,speed:80,moves:[move('Psychic','psychic',65),move('Shadow Ball','ghost',55),move('Psycho Burst','psychic',90,5,75),move('Energy Ball','grass',55)]},
{id:445,name:'Garchomp',type:'ground',hp:175,attack:76,defense:68,speed:102,moves:[move('Earthquake','ground',65),move('Dragon Claw','dragon',55),move('Earth Crush','ground',90,5,75),move('Fire Fang','fire',55)]},
{id:131,name:'Lapras',type:'ice',hp:195,attack:62,defense:63,speed:60,moves:[move('Ice Beam','ice',65),move('Surf','water',55),move('Blizzard','ice',90,5,75),move('Body Slam','normal',50,15)]},
{id:133,name:'Eevee',type:'normal',hp:130,attack:55,defense:50,speed:65,moves:[move('Swift','normal',65),move('Bite','ghost',55),move('Last Resort','normal',90,5,75),move('Double Kick','fighting',55)]}
];
const dex=new Map(ROSTER.map(p=>[p.id,p]));
const strong={electric:['water'],fire:['grass','ice'],water:['fire','ground'],grass:['water','ground'],ghost:['ghost','psychic'],dragon:['dragon'],fighting:['normal','ice'],psychic:['fighting'],ground:['electric','fire'],ice:['dragon','ground','grass']};
const weak={electric:['grass','dragon','electric'],fire:['water','dragon','fire'],water:['grass','dragon','water'],grass:['fire','dragon','grass'],ghost:[],dragon:[],normal:[],fighting:['psychic'],psychic:['psychic'],ground:['grass'],ice:['fire','water','ice']};
export function effectiveness(attack,defense){if((attack==='electric'&&defense==='ground')||(attack==='normal'&&defense==='ghost')||(attack==='ghost'&&defense==='normal'))return 0;return strong[attack]?.includes(defense)?2:weak[attack]?.includes(defense)?.5:1;}
export function validTeam(ids){return Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>dex.has(id));}
export function makeBattle(ids,names,seed=Date.now()){if(!ids.every(validTeam)||ids.length!==2)throw Error('Invalid teams');const players=ids.map((team,i)=>({name:String(names[i]||'Trainer').slice(0,20),active:0,potion:1,team:team.map(id=>({...structuredClone(dex.get(id)),maxHp:dex.get(id).hp,guard:false}))}));const turn=players[0].team[0].speed>=players[1].team[0].speed?0:1;return {players,turn,revision:0,seed:seed>>>0,phase:'battle',winner:null,log:[`Trận đấu bắt đầu! ${players[turn].name} đi trước.`],last:null};}
function roll(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function act(state,player,action,revision){
 if(!state||state.phase!=='battle'||state.turn!==player||state.revision!==revision||!action)return {ok:false,error:'Chưa đến lượt hoặc lượt đã thay đổi.'};
 const s=structuredClone(state),mine=s.players[player],enemy=s.players[1-player],p=mine.team[mine.active],q=enemy.team[enemy.active];const add=t=>s.log.push(t);let hit=false;
 if(action.type==='move'){
  if(!Number.isInteger(action.index)||!p.moves[action.index]||p.moves[action.index].pp<=0)return {ok:false,error:'Chiêu không hợp lệ hoặc đã hết PP.'};
  const m=p.moves[action.index];m.pp--;p.guard=false;
  if(roll(s)*100>=m.accuracy){add(`${p.name} dùng ${m.name}, nhưng trượt!`);}
  else{const multiplier=effectiveness(m.type,q.type),crit=roll(s)<.0625?1.5:1;const damage=multiplier===0?0:Math.max(1,Math.floor((m.power*.58+p.attack*.3-q.defense*.18)*(p.type===m.type?1.2:1)*multiplier*crit*(.9+roll(s)*.1)*(q.guard?.5:1)));q.hp=Math.max(0,q.hp-damage);q.guard=false;hit=damage>0;add(`${p.name} → ${m.name}: ${damage} sát thương.${multiplier===2?' Siêu hiệu quả!':multiplier===.5?' Không hiệu quả lắm.':multiplier===0?' Không có tác dụng.':''}${crit>1?' Chí mạng!':''}`);}
 }else if(action.type==='guard'){p.guard=true;add(`${p.name} phòng thủ: giảm 50% đòn trúng kế tiếp.`);}
 else if(action.type==='potion'){if(mine.potion<=0||p.hp===p.maxHp)return {ok:false,error:'Không thể dùng thuốc lúc này.'};mine.potion--;const heal=Math.min(60,p.maxHp-p.hp);p.hp+=heal;p.guard=false;add(`${p.name} hồi ${heal} HP.`);}
 else if(action.type==='switch'){if(!Number.isInteger(action.index)||action.index===mine.active||!mine.team[action.index]||mine.team[action.index].hp<=0)return {ok:false,error:'Không thể đổi Pokémon này.'};p.guard=false;mine.active=action.index;add(`${mine.name} gọi ${mine.team[mine.active].name} vào sân.`);}
 else if(action.type==='struggle'){if(p.moves.some(m=>m.pp>0))return {ok:false,error:'Vẫn còn chiêu có PP.'};p.guard=false;const damage=q.guard?12:25;q.guard=false;q.hp=Math.max(0,q.hp-damage);hit=true;add(`${p.name} dùng Struggle: ${damage} sát thương.`);}
 else if(action.type==='surrender'){s.phase='finished';s.winner=1-player;add(`${mine.name} đầu hàng.`);}
 else return {ok:false,error:'Hành động không hợp lệ.'};
 if(q.hp===0&&s.phase==='battle'){add(`${q.name} đã gục!`);const next=enemy.team.findIndex(t=>t.hp>0);if(next<0){s.phase='finished';s.winner=player;add(`${mine.name} thắng trận!`);}else{enemy.active=next;add(`${enemy.name} gọi ${enemy.team[next].name} vào sân.`);}}
 s.revision++;s.turn=1-player;s.log=s.log.slice(-60);s.last={player,type:action.type,hit};return {ok:true,state:s};
}
export function chooseAI(s,player){const own=s.players[player],enemy=s.players[1-player].team[s.players[1-player].active],p=own.team[own.active];if(own.potion&&p.hp<p.maxHp*.3)return {type:'potion'};const available=p.moves.map((m,i)=>({i,score:m.power*effectiveness(m.type,enemy.type)*(p.type===m.type?1.2:1)*m.accuracy/100,pp:m.pp})).filter(m=>m.pp>0).sort((a,b)=>b.score-a.score);return available.length?{type:'move',index:available[0].i}:{type:'struggle'};}
