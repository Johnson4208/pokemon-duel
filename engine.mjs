import {ROSTER,TYPES} from './catalog.mjs?v=roles-v1';
export {ROSTER,TYPES,EFFECTS} from './catalog.mjs?v=roles-v1';
const dex=new Map(ROSTER.map(p=>[p.id,p]));
const strong={electric:['water','flying'],fire:['grass','ice'],water:['fire','ground'],grass:['water','ground'],ghost:['ghost','psychic'],dragon:['dragon'],fighting:['normal','ice','dark'],psychic:['fighting'],ground:['electric','fire'],ice:['dragon','ground','grass','flying'],fairy:['dragon','fighting','dark'],dark:['psychic','ghost'],flying:['grass','fighting']};
const weak={electric:['grass','dragon','electric'],fire:['water','dragon','fire'],water:['grass','dragon','water'],grass:['fire','dragon','grass'],ghost:['dark'],dragon:[],normal:[],fighting:['psychic','fairy','flying'],psychic:['psychic'],ground:['grass'],ice:['fire','water','ice'],fairy:['fire'],dark:['dark','fighting','fairy'],flying:['electric']};
export function effectiveness(attack,defense){if((attack==='electric'&&defense==='ground')||(attack==='normal'&&defense==='ghost')||(attack==='ghost'&&defense==='normal')||(attack==='psychic'&&defense==='dark')||(attack==='dragon'&&defense==='fairy')||(attack==='ground'&&defense==='flying')||(attack==='fighting'&&defense==='ghost'))return 0;return strong[attack]?.includes(defense)?2:weak[attack]?.includes(defense)?.5:1;}
export function validTeam(ids){return Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>dex.has(id));}
export function makeBattle(ids,names,seed=Date.now()){if(!ids.every(validTeam)||ids.length!==2)throw Error('Invalid teams');const players=ids.map((team,i)=>({name:String(names[i]||'Trainer').slice(0,20),active:0,potion:1,team:team.map(id=>({...structuredClone(dex.get(id)),maxHp:dex.get(id).hp,guard:false,guardPower:.5,status:null,statusTurns:0,focused:false,ultimateCooldown:0}))}));const turn=players[0].team[0].speed>=players[1].team[0].speed?0:1;return {players,turn,revision:0,seed:seed>>>0,phase:'battle',winner:null,log:[`Trận đấu bắt đầu! ${players[turn].name} đi trước.`],last:null};}
function roll(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function act(state,player,action,revision){
 if(!state||state.phase!=='battle'||state.turn!==player||state.revision!==revision||!action)return {ok:false,error:'Chưa đến lượt hoặc lượt đã thay đổi.'};
 const s=structuredClone(state),mine=s.players[player],enemy=s.players[1-player],p=mine.team[mine.active],q=enemy.team[enemy.active];const add=t=>s.log.push(t);let hit=false,damageDone=0,healed=0,moveType=p.type,moveName='',effect='',usedUltimate=false,isUltimate=false;
 if(action.type==='move'){
  if(!Number.isInteger(action.index)||!p.moves[action.index]||p.moves[action.index].pp<=0)return {ok:false,error:'Chiêu không hợp lệ hoặc đã hết PP.'};
  const m=p.moves[action.index];
  if(m.ultimate&&p.ultimateCooldown>0)return {ok:false,error:`Ultimate còn hồi chiêu ${p.ultimateCooldown} lượt.`};
  if(m.effect==='heal'&&p.hp===p.maxHp)return {ok:false,error:'HP is already full.'};
  if(m.effect==='focus'&&p.focused)return {ok:false,error:'Already focused. Use an attack next.'};
  m.pp--;p.guard=false;moveType=m.type;moveName=m.name;isUltimate=!!m.ultimate;usedUltimate=isUltimate;if(isUltimate)p.ultimateCooldown=3;
  if(roll(s)*100>=m.accuracy){add(`${p.name} dùng ${m.name}, nhưng trượt!`);}
  else if(m.power===0){effect=m.effect;if(m.effect==='heal'){healed=Math.min(p.maxHp-p.hp,Math.ceil(p.maxHp*(m.ultimate?.4:.2)));p.hp+=healed;add(`${p.name} → ${m.name}${m.ultimate?' · ULTIMATE':''}: +${healed} HP.`);}else if(m.effect==='focus'){p.focused=true;p.focusPower=m.ultimate?1.5:1.25;add(`${p.name} → ${m.name}${m.ultimate?' · ULTIMATE':''}: next hit +${m.ultimate?50:25}%.`);}else if(m.effect==='guard'){p.guard=true;p.guardPower=m.ultimate?.3:.5;add(`${p.name} → ${m.name}${m.ultimate?' · ULTIMATE':''}: next hit reduced by ${m.ultimate?70:50}%.`);}}
  else{
   const multiplier=effectiveness(m.type,q.type),crit=roll(s)<.0625?1.5:1;
   const damage=multiplier===0?0:Math.max(1,Math.floor((m.power*.58+p.attack*.3-q.defense*.18)*(p.type===m.type?1.2:1)*multiplier*crit*(.9+roll(s)*.1)*(m.ultimate?1.55:1)*(q.guard&&m.effect!=='pierce'?(q.guardPower??.5):1)*(p.focused?(p.focusPower??1.25):1)*(p.status==='chill'?.8:1)));
   damageDone=Math.min(q.hp,damage);q.hp=Math.max(0,q.hp-damage);q.guard=false;q.guardPower=.5;p.focused=false;p.focusPower=1.25;hit=damageDone>0;
   add(`${p.name} → ${m.name}${m.ultimate?' · ULTIMATE':''}: ${damageDone} sát thương.${multiplier===2?' Siêu hiệu quả!':multiplier===.5?' Không hiệu quả lắm.':multiplier===0?' Không có tác dụng.':''}${crit>1?' Chí mạng!':''}`);
   if(hit&&m.effect&&roll(s)*100<(m.chance??100)){
    effect=m.effect;
    if(effect==='drain'){healed=Math.min(p.maxHp-p.hp,Math.ceil(damageDone/2));p.hp+=healed;add(`${p.name}: +${healed} HP.`);}
    else if(['burn','poison','chill'].includes(effect)&&q.hp>0&&!q.status&&!(effect==='burn'&&q.type==='fire')&&!(effect==='chill'&&q.type==='ice')){q.status=effect;q.statusTurns=effect==='chill'?2:3;add(`${q.name}: ${effect} (${q.statusTurns} actions).`);}
   }
  }
 }else if(action.type==='guard'){p.guard=true;p.guardPower=.5;add(`${p.name} phòng thủ: giảm 50% đòn trúng kế tiếp.`);}
 else if(action.type==='potion'){if(mine.potion<=0||p.hp===p.maxHp)return {ok:false,error:'Không thể dùng thuốc lúc này.'};mine.potion--;const heal=Math.min(60,p.maxHp-p.hp);p.hp+=heal;healed=heal;p.guard=false;add(`${p.name} hồi ${heal} HP.`);}
 else if(action.type==='switch'){if(!Number.isInteger(action.index)||action.index===mine.active||!mine.team[action.index]||mine.team[action.index].hp<=0)return {ok:false,error:'Không thể đổi Pokémon này.'};p.guard=false;mine.active=action.index;add(`${mine.name} gọi ${mine.team[mine.active].name} vào sân.`);}
 else if(action.type==='struggle'){if(p.moves.some(m=>m.pp>0&&m.power>0))return {ok:false,error:'Vẫn còn chiêu tấn công có PP.'};p.guard=false;const damage=q.guard?12:25;q.guard=false;q.hp=Math.max(0,q.hp-damage);hit=true;damageDone=Math.min(damage,q.hp+damage);add(`${p.name} dùng Struggle: ${damage} sát thương.`);}
 else if(action.type==='surrender'){s.phase='finished';s.winner=1-player;add(`${mine.name} đầu hàng.`);}
 else return {ok:false,error:'Hành động không hợp lệ.'};
 if(q.hp===0&&s.phase==='battle'){add(`${q.name} đã gục!`);const next=enemy.team.findIndex(t=>t.hp>0);if(next<0){s.phase='finished';s.winner=player;add(`${mine.name} thắng trận!`);}else{enemy.active=next;add(`${enemy.name} gọi ${enemy.team[next].name} vào sân.`);}}
 if(s.phase==='battle'&&action.type!=='switch'&&p.status){
  const residual=p.status==='burn'?6:p.status==='poison'?8:0;p.hp=Math.max(0,p.hp-residual);if(residual)add(`${p.name}: ${p.status} −${residual} HP.`);
  p.statusTurns--;if(p.statusTurns<=0){p.status=null;p.statusTurns=0;}
  if(p.hp===0){add(`${p.name} đã gục!`);const next=mine.team.findIndex(t=>t.hp>0);if(next<0){s.phase='finished';s.winner=1-player;add(`${enemy.name} thắng trận!`);}else mine.active=next;}
 }
 if(!usedUltimate)for(const mon of mine.team)if(mon.ultimateCooldown>0)mon.ultimateCooldown--;
 s.revision++;s.turn=1-player;s.log=s.log.slice(-60);s.last={player,actorId:p.id,targetId:q.id,type:action.type,hit,damage:damageDone,heal:healed,moveType,moveName,effect,ultimate:isUltimate};return {ok:true,state:s};
}
export function chooseAI(s,player){const own=s.players[player],enemy=s.players[1-player].team[s.players[1-player].active],p=own.team[own.active];if(own.potion&&p.hp<p.maxHp*.3)return {type:'potion'};const usable=p.moves.map((m,i)=>({m,i})).filter(x=>x.m.pp>0&&(!x.m.ultimate||p.ultimateCooldown===0));const heal=usable.find(x=>x.m.effect==='heal');if(heal&&p.hp<p.maxHp*.58)return {type:'move',index:heal.i};if(!p.focused&&p.hp>p.maxHp*.55&&p.role==='support'){const focus=usable.find(x=>x.m.effect==='focus');if(focus)return {type:'move',index:focus.i};}const available=usable.filter(x=>x.m.power>0).map(({m,i})=>({i,ultimate:m.ultimate,score:m.power*effectiveness(m.type,enemy.type)*(p.type===m.type?1.2:1)*m.accuracy/100})).sort((a,b)=>b.score-a.score);const ultimate=available.find(x=>x.ultimate);if(ultimate)return {type:'move',index:ultimate.i};const finiteGuard=usable.find(x=>x.m.effect==='guard');return available.length?{type:'move',index:available[0].i}:finiteGuard?{type:'move',index:finiteGuard.i}:{type:'struggle'};}
