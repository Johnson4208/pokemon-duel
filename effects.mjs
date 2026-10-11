import {SHOP} from './catalog.mjs';
// Runtime atlas: 56 animation sequences selected from the supplied pixel VFX packs.
const ROWS={"charge":0,"bolt":1,"chain":2,"thunder":3,"electricHit":4,"fire":5,"fireOrb":6,"fireRing":7,"fireBlast":8,"rock":9,"earth":10,"dust":11,"water":12,"wind":13,"frost":14,"heal":15,"shield":16,"focus":17,"aura":18,"star":19,"coins":20,"claw":21,"slash":22,"darkSlash":23,"punch":24,"heavy":25,"critical":26,"shuriken":27,"leaf":28,"poison":29,"dragon":30,"snow":31,"waterfall":32,"priest":33,"holy":34,"iceSlash":35,"iceWave":36,"shadow":37,"phantom":38,"meteor":39,"cosmic":40,"starStorm":41,"warlock":42,"darkStorm":43,"darkRing":44,"combat":45,"night":46,"wood":47,"iceSpikes":48,"acid":49,"smoke":50,"smear":51,"bubbles":52,"fairy":53,"sun":54,"spiral":55};
const ATLAS_WIDTH=1024,ATLAS_HEIGHT=7168;
export function moveVisual(last){
 if(last.type==='guard')return 'guard';
 if(last.type==='potion'||last.effect==='heal')return 'heal';
 if(last.effect==='focus')return 'focus';
 if(/Quick Attack|Extreme Speed/.test(last.moveName||''))return 'dash';
 if(last.moveName==='Thunder')return 'thunder';
 return ({electric:'lightning',fire:'flame',water:'bubble',grass:'leaves',ice:'ice',ghost:'mist',psychic:'rings',fairy:'sparkles',fighting:'strike',ground:'stones',dragon:'spiral',dark:'slash',flying:'gust',normal:'dash'})[last.moveType]||'strike';
}
const families={
 electric:['charge','chain','electricHit'],fire:['fireRing','fireOrb','fireBlast'],water:['bubbles','water','water'],grass:['leaf','wood','leaf'],ice:['frost','iceSpikes','frost'],ghost:['shadow','phantom','shadow'],psychic:['aura','aura','fairy'],fairy:['star','star','fairy'],fighting:['focus','punch','combat'],ground:['dust','rock','earth'],dragon:['aura','dragon','dragon'],dark:['darkSlash','shadow','night'],flying:['wind','wind','slash'],normal:['star','smear','heavy']
};
const overrides={
 Thunder:['charge','bolt','thunder'],Thunderbolt:['charge','chain','electricHit'],
 'Solar Beam':['sun','cosmic','sun'],'Flamethrower':['fireRing','fire','fireBlast'],'Fire Blast':['fireRing','fireOrb','sun'],
 'Fire Spin':['fireRing','spiral','spiral'],'Flare Blitz':['fireRing','combat','sun'],'Flame Punch':['fireRing','combat','fireBlast'],'Fire Punch':['fireRing','punch','fireBlast'],
 'Hydro Pump':['bubbles','water','waterfall'],Surf:['bubbles','water','waterfall'],'Origin Pulse':['bubbles','water','waterfall'],
 'Water Shuriken':['bubbles','shuriken','water'],'Ice Beam':['frost','iceSpikes','iceWave'],Blizzard:['snow','iceSpikes','iceWave'],
 'Shadow Ball':['shadow','aura','warlock'],'Shadow Storm':['shadow','phantom','darkStorm'],'Shadow Claw':['shadow','claw','shadow'],
 'Phantom Burst':['shadow','phantom','warlock'],'Dark Pulse':['shadow','darkStorm','night'],'Night Burst':['shadow','phantom','night'],
 'Darkest Lariat':['shadow','darkSlash','darkRing'],Bite:['shadow','claw','darkSlash'],
 Psychic:['aura','cosmic','fairy'],Psystrike:['aura','cosmic','starStorm'],'Psychic Storm':['aura','meteor','starStorm'],
 'Psycho Burst':['aura','aura','fairy'],'Star Burst':['star','cosmic','starStorm'],Moonblast:['star','aura','fairy'],
 'Aura Sphere':['focus','aura','combat'],'Aura Burst':['focus','punch','combat'],'Close Combat':['focus','punch','combat'],
 'Dragon Claw':['aura','claw','combat'],'Dragon Meteor':['aura','cosmic','meteor'],'Dragon Ascent':['wind','phantom','meteor'],
 Outrage:['aura','claw','dragon'],'Air Slash':['wind','slash','iceSlash'],
 Earthquake:['dust','rock','earth'],'Earth Crush':['dust','rock','earth'],'Precipice Blades':['dust','wood','earth'],
 'Body Slam':['focus','smear','heavy'],'Giga Impact':['focus','smear','critical'],
 'Pay Day':['coins','coins','coins'],Swift:['star','star','star'],'Fury Swipes':['focus','claw','claw'],'Double Kick':['focus','punch','punch'],
 'Leaf Storm':['leaf','leaf','wood'],'Seed Burst':['leaf','wood','leaf'],'Giga Drain':['leaf','leaf','wood'],'Leaf Drain':['leaf','leaf','wood'],
 'Draining Kiss':['star','star','holy'],'Play Rough':['star','combat','fairy']
};
export function effectTier(actorId){const price=SHOP.find(p=>p.id===Number(actorId))?.price||0;return price>=75?3:price>=30?2:price?1:0;}
export function effectMarkup(last,self,actorId=25){
 if(!['move','struggle','guard','potion'].includes(last.type))return '';
 const visual=moveVisual(last),support=['heal','focus','guard'].includes(visual),sx=self?58:196,sy=self?103:51,tx=support?sx:self?196:58,ty=support?sy:self?51:103,tier=effectTier(actorId);
 const name=last.moveName||'',type=last.moveType||'normal',family=overrides[name]||families[type]||families.normal;
 const frames=Array.from({length:8},(_,f)=>{
  const pieces=[];
  const sprite=(key,x,y,size,frame=f,angle=0,opacity=1)=>{
   const row=ROWS[key];if(row===undefined)throw new Error('Unknown effect '+key);
   const ff=Math.max(0,Math.min(7,Math.round(frame))),xx=Math.round(x-size/2),yy=Math.round(y-size/2);
   pieces.push(`<g opacity="${opacity}"${angle?` transform="rotate(${Math.round(angle)} ${Math.round(x)} ${Math.round(y)})"`:''}><svg x="${xx}" y="${yy}" width="${size}" height="${size}" viewBox="${ff*128} ${row*128} 128 128" overflow="hidden"><image href="battle-vfx-atlas.png?v=pack-v9" width="${ATLAS_WIDTH}" height="${ATLAS_HEIGHT}"/></svg></g>`);
  };
  const impactFrame=Math.min(7,Math.max(0,(f-3)*2+1)),travel=Math.min(1,Math.max(0,(f-1)/3)),cx=sx+(tx-sx)*travel,cy=sy+(ty-sy)*travel,angle=Math.atan2(ty-sy,tx-sx)*180/Math.PI;
  if(support){
   const key=visual==='heal'?(tier>1?'holy':'heal'):visual==='guard'?'shield':tier>1?'priest':'focus';
   sprite(key,sx,sy-6,48+tier*10,f);
   if(tier&&f>=2)sprite(visual==='heal'?'star':'charge',sx,sy,64+tier*7,f,0,.75);
  }else if(visual==='dash'&&/Quick Attack|Extreme Speed|Tackle|Slam|Impact|Last Resort/.test(name)||last.type==='struggle'){
   if(f>=1&&f<=4){
    for(let k=0;k<3+tier;k++){const t=Math.max(0,travel-k*.12),x=sx+(tx-sx)*t,y=sy+(ty-sy)*t;pieces.push(`<image href="${Number(actorId)}.png" x="${Math.round(x-20)}" y="${Math.round(y-24)}" width="40" height="40" opacity="${Math.max(.12,.65-k*.14)}"/>`);}
    sprite('smear',cx,cy,66+tier*8,f,angle);sprite('dust',sx,sy+13,34,f);
   }
   if(f>=3&&last.hit){sprite(name==='Giga Impact'?'critical':'heavy',tx,ty,44+tier*12,impactFrame);if(tier>1)sprite('combat',tx,ty,70,impactFrame,angle);}
  }else{
   if(f<3)sprite(family[0],sx,sy-3,32+tier*7,f*2+1);
   if(f>=1&&f<=4){
    const beam=/Beam|Pump|Pulse|Flamethrower|Psystrike|Breath/.test(name),storm=/Storm|Blizzard|Meteor|Ascent/.test(name),ground=/Earthquake|Crush|Blades/.test(name);
    if(name==='Thunder'){sprite('bolt',tx,ty-21,72,f,0);if(f>=2)sprite('chain',tx-16,ty-13,48,f,0);}
    else if(beam){for(let k=0;k<5+tier;k++){const t=travel*k/(4+tier);sprite(family[1],sx+(tx-sx)*t,sy+(ty-sy)*t,24+tier*4,(f+k)%8,angle);}}
    else if(storm){for(let k=0;k<3+tier;k++)sprite(family[1],tx-25+k*50/(2+tier),ty-40+f*9,30+tier*5,(f+k)%8,35);}
    else if(ground){for(let k=0;k<4+tier;k++){const t=travel*k/(3+tier);sprite(family[1],sx+(tx-sx)*t,sy+(ty-sy)*t+12,22+tier*4,(f+k)%8);}}
    else sprite(family[1],cx,cy,34+tier*6,(f-1)*2,angle);
   }
   if(f>=3&&last.hit){
    sprite(family[2],tx,ty,46+tier*13,impactFrame);
    if(/Claw|Slash|Swipes|Combat|Kick/.test(name))for(let k=0;k<(tier?2:1);k++)sprite(family[2],tx-8+k*16,ty,42+tier*7,Math.min(7,impactFrame+k),k*70);
    if(tier)sprite(({electric:'electricHit',fire:'fireRing',water:'bubbles',ground:'dust',grass:'leaf',ice:'snow',ghost:'shadow',psychic:'star',fairy:'fairy',fighting:'smoke',dragon:'charge',dark:'smoke',flying:'wind',normal:'critical'})[type]||'critical',tx,ty,64+tier*10,impactFrame,0,.7);
   }
   if(last.effect==='poison'&&last.hit&&f>=5)sprite('acid',tx,ty+12,28,f-4,0,.75);
   if(last.effect==='drain'&&last.hit&&f>=5){const t=(f-5)/2;sprite('heal',tx+(sx-tx)*t,ty+(sy-ty)*t,24,f-4);}
  }
  // Rare species get their own environmental accent rather than more opaque clutter.
  if(tier>=2&&f>=3&&(support||last.hit)&&(support||/Blitz|Burst|Storm|Meteor|Ascent|Blades|Blizzard|Outrage|Close Combat|Impact|Pump|Origin Pulse|Psystrike|Earth Crush/.test(name))){
   const x=support?sx:tx,y=support?sy:ty;
   const premium={6:'spiral',9:'waterfall',59:'sun',197:'shadow',700:'holy',94:'warlock',778:'phantom',131:'iceWave',282:'holy',658:'shuriken',448:'combat',143:'dust',727:'darkRing',149:'dragon',373:'meteor',445:'earth',151:'cosmic',150:name==='Psystrike'?'cosmic':'starStorm',384:'meteor',383:'wood',382:'waterfall'}[Number(actorId)]||family[2];
   sprite(premium,x,y+3,72+tier*12,impactFrame,0,.85);
   if(tier===3&&!support){
    if(Number(actorId)===383){for(let k=0;k<3;k++)sprite('earth',tx-27+k*27,ty+18,37,impactFrame+k);}
    else if(Number(actorId)===382){sprite('water',tx-25,ty+17,58,impactFrame);sprite('water',tx+25,ty+17,58,impactFrame+1);}
    else if(Number(actorId)===384){sprite('wind',tx,ty+17,90,impactFrame,0,.7);}
    else sprite('star',tx,ty,95,impactFrame,0,.75);
   }
  }
  return `<g class="px-frame" style="--frame:${f}">${pieces.join('')}</g>`;
 }).join('');
 return `<svg class="move-art pixel-art fx-${visual}" data-effect-tier="${tier}" viewBox="0 0 250 150" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${frames}</svg>${last.damage?`<b class="fx-number ${self?'enemy-number':'self-number'}">−${last.damage}</b>`:''}${last.heal?`<b class="fx-number heal-number ${self?'self-number':'enemy-number'}">+${last.heal} HP</b>`:''}`;
}
