import {SHOP} from './catalog.mjs';
import {VFX_ASSETS,VFX_TILE,VFX_FRAMES,VFX_PAGE_ROWS} from './vfx-assets.mjs?v=grand-v1';
const hash=s=>[...String(s)].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export function effectTier(id){const price=SHOP.find(p=>p.id===Number(id))?.price||0;return price>=120?3:price>=30?2:price?1:0;}
export function moveVisual(last){if(last.type==='guard'||last.effect==='guard')return 'guard';if(last.type==='potion'||last.effect==='heal')return 'heal';if(last.effect==='focus')return 'focus';return moveDelivery(last);}
export function moveDelivery(last){
 if(last.type==='guard'||last.effect==='guard')return 'guard';if(last.type==='potion'||last.effect==='heal')return 'heal';if(last.effect==='focus')return 'focus';
 const n=last.moveName||'';
 if(/Thunder$|Bolt Strike|Judgment|Cosmic Strike|Fusion Bolt/.test(n))return 'sky';
 if(/Meteor|Psychic Storm|Solar Crash/.test(n))return 'meteor';
 if(/Earth Power|Earth Crush|Precipice|Geomancy|Fire Blast|Fusion Flare/.test(n))return 'eruption';
 if(/Spin|Lariat|Shadow Storm|Rift Crush|Night Burst/.test(n))return 'vortex';
 if(/Surf|Origin Pulse|Rift Wave|Lunar Wave/.test(n))return 'wave';
 if(/Beam|Pump|Flamethrower|Roar of Time|Flash Cannon|Divine Pulse|Oblivion Wing/.test(n))return 'beam';
 if(/Psychic$|Psystrike|Confusion|Extrasensory|Shadow Force|Psycho Boost|Time Break/.test(n))return 'target';
 if(/Swift|Swipes|Shuriken|Leaf Storm|Blizzard|Seed Burst|Pay Day/.test(n))return 'barrage';
 if(last.type==='struggle'||/Quick Attack|Extreme Speed|Tackle|Body Slam|Giga Impact|Flare Blitz|Dragon Ascent|Sunsteel Strike|Sky Attack/.test(n))return 'dash';
 if(/Claw|Slash|Combat|Kick|Punch|Palm|Pound|Fangs|Horn Leech|Spacial Rend|Aqua Tail/.test(n))return 'slash';
 if(/Earthquake/.test(n))return 'ground';
 return 'projectile';
}
export function targetReaction(last){return ({target:'lift',vortex:'lift',sky:'slam',meteor:'slam',eruption:'slam',ground:'slam',beam:'push',wave:'push',slash:'cut',barrage:'cut',dash:'push'})[moveDelivery(last)]||'shake';}
export const DELIVERY_LABELS={projectile:'Đạn năng lượng',beam:'Tia xuyên sân',sky:'Sấm từ trên cao',meteor:'Mưa thiên thạch',eruption:'Bùng lên dưới mục tiêu',vortex:'Xoáy quanh đối thủ',wave:'Sóng quét sân',target:'Tác động trực tiếp lên mục tiêu',barrage:'Chuỗi đòn đa hướng',dash:'Lao tới va chạm',slash:'Chém / cận chiến',ground:'Chấn động mặt đất',heal:'Hồi phục',guard:'Kết giới',focus:'Tích tụ sức mạnh'};
const families={
 electric:['chargeUp','warped_waveform','shockNova','sparkCore','#ffe566'],fire:['colorRing1','combat_fireball','sunFlare','fireCore','#ff984e'],water:['aquaOrb','warped_bolt','combat_water_lash','aquaWave','#61d6ff'],grass:['petalBloom','vineWhip','thornBurst','fallingLeaves','#99e767'],ice:['iceNova','iceLance','iceBreak','snowfall','#b8f7ff'],ghost:['ghostWisps','phantomFlare','darkNova','portalGate','#b6a2ff'],psychic:['runeGate','warped_charged','arcaneNova','nebulaBurst','#e0a5ff'],fairy:['holyCircle','colorRing2','divineNova','petalBloom','#ffc1e8'],fighting:['heroSurge','pierceHit','criticalHit','multiHit','#ffc889'],ground:['groundSlam','stoneSpire','combat_mud_smash','quakeNova','#d6b07c'],dragon:['vortexColor','warped_crossed','nebulaBurst','meteorImpact','#87f9d2'],dark:['portalGate','shadowBlade','voidNova','ghostWisps','#b892ec'],flying:['sonicBoom','spinCut','tornado','waterMist','#a1e9ed'],normal:['lite_heal_sparkles_nature','lite_slash_arc_steel','combat_hit_spark','multiHit','#ffe8aa'],steel:['guardShell','warped_pulse','plasmaBurst','crossCut','#b3d8ef']
};
const signatures={
 Thunder:['stormField','combat_lightning','combat_hit_spark','shockNova'],Thunderbolt:['chargeUp','goldTesla','goldPlasma','sparkCore'],
 'Solar Beam':['holyCircle','warped_pulse','sunFlare','lifeBloom'],'Flamethrower':['colorRing1','fireRibbon','fireCore','burningLand'],'Fire Blast':['moltenCore','fireMeteor','sunFlare','fireCore'],
 'Blue Flare':['runeGate','blueFire','nebulaBurst','phoenix'],'Fusion Flare':['moltenCore','fireMeteor','sunFlare','phoenix'],
 'Hydro Pump':['aquaOrb','warped_pulse','combat_water_lash','geyser'],'Origin Pulse':['holyCircle','aquaWave','combat_water_lash','geyser'],Surf:['aquaOrb','aquaWave','aquaBurst','waterMist'],
 'Water Shuriken':['aquaOrb','spinCut','impact_blue','combat_water_lash'],'Ice Beam':['iceNova','iceLance','iceBreak','iceHit'],Blizzard:['iceNova','iceLance','nebulaBurst','snowfall'],
 'Shadow Ball':['portalGate','phantomFlare','darkNova','voidNova'],'Shadow Force':['portalGate','spiritRise','voidNova','ghostWisps'],'Shadow Storm':['ghostWisps','portalGate','darkNova','vortex'],
 'Spacial Rend':['runeGate','crossCut','phantomFlare','portalGate'],'Roar of Time':['runeGate','warped_pulse','arcaneNova','portalGate'],'Time Break':['runeGate','holyCircle','colorRing3','vortex'],
 Judgment:['holyCircle','holyPillar','sunFlare','divineNova'],'Divine Pulse':['holyCircle','warped_pulse','divineNova','holyPillar'],
 'Moongeist Beam':['portalGate','warped_waveform','phantomFlare','nebulaBurst'],'Lunar Wave':['holyCircle','vortex','phantomFlare','ghostWisps'],
 'Sunsteel Strike':['moltenCore','phoenix','sunFlare','criticalHit'],'Solar Crash':['holyCircle','fireMeteor','sunFlare','moltenCore'],
 'Dragon Ascent':['sonicBoom','tornado','combat_hit_spark','tornado'],'Dragon Meteor':['vortexColor','fireMeteor','meteorImpact','nebulaBurst'],
 'Precipice Blades':['groundSlam','stoneSpire','combat_mud_smash','burningLand'],'Earth Crush':['groundSlam','stoneSpire','quakeNova','meteorImpact'],
 'Psychic Storm':['runeGate','warped_charged','nebulaBurst','arcaneNova'],Psystrike:['runeGate','holyCircle','arcaneNova','nebulaBurst'],
 'Psycho Boost':['runeGate','colorRing3','nebulaBurst','vortex'],'Cosmic Strike':['runeGate','fireMeteor','nebulaBurst','arcaneNova'],
 'Oblivion Wing':['portalGate','warped_waveform','voidNova','soulDrain'],'Bolt Strike':['chargeUp','combat_lightning','plasmaBurst','tesla'],'Fusion Bolt':['stormField','skyThunder','shockNova','sparkCore'],
 Geomancy:['lifeBloom','thornBurst','petalBloom','holyCircle'],'Horn Leech':['petalBloom','vineWhip','thornBurst','lifeBloom'],
 'Dragon Claw':['vortexColor','tripleClaw','tripleClaw','impact_green'],'Shadow Claw':['ghostWisps','tripleClaw','phantomFlare','impact_purple'],'Air Slash':['sonicBoom','spinCut','pierceHit','tornado'],
 'Pay Day':['lite_heal_sparkles_nature','colorRing3','multiHit','lite_explosion_small_fire'],
 'Fury Swipes':['heroSurge','tripleClaw','multiHit','impact_red'],'Close Combat':['heroSurge','crossCut','criticalHit','multiHit']
};
export function moveRecipe(last,actorId=25){const base=families[last.moveType]||families.normal,special=signatures[last.moveName];const seed=hash(`${actorId}:${last.moveName||last.type}`);return {charge:special?.[0]||base[0],travel:special?.[1]||base[1],impact:special?.[2]||base[2],accent:special?.[3]||base[3],color:base[4],delivery:moveDelivery(last),seed,tier:effectTier(actorId)};}
export function effectMarkup(last,self,actorId=25){
 if(!['move','struggle','guard','potion'].includes(last.type))return '';
 const r=moveRecipe(last,actorId),mode=r.delivery,support=['heal','guard','focus'].includes(mode),sx=self?58:196,sy=self?103:51,tx=self?196:58,ty=self?51:103,dir=self?1:-1,hit=last.hit!==false,power=Number(last.damage||0),scale=1+r.tier*.12;
 const frames=Array.from({length:VFX_FRAMES},(_,f)=>{
  const parts=[];
  const stamp=(key,x,y,w=48,h=w,frame=f,angle=0,opacity=1)=>{const a=VFX_ASSETS[key];if(!a)throw Error('Unknown VFX sequence '+key);const fi=Math.round(clamp(frame,0,15)),width=Math.round(w),height=Math.round(h);parts.push(`<g opacity="${opacity}"${angle?` transform="rotate(${Math.round(angle)} ${Math.round(x)} ${Math.round(y)})"`:''}><svg x="${Math.round(x-width/2)}" y="${Math.round(y-height/2)}" width="${width}" height="${height}" viewBox="${fi*VFX_TILE} ${a.row*VFX_TILE} ${VFX_TILE} ${VFX_TILE}" overflow="hidden"><image href="${a.file}?v=grand-v1" width="${VFX_TILE*VFX_FRAMES}" height="${VFX_TILE*VFX_PAGE_ROWS}"/></svg></g>`);};
  const pixels=(x,y,count,radius,phase,color=r.color)=>{for(let k=0;k<count;k++){const n=(r.seed+k*97)%360,a=n*Math.PI/180,d=radius*(.45+(k%4)*.18),size=2+(k%2);parts.push(`<rect x="${Math.round(x+Math.cos(a)*d)}" y="${Math.round(y+Math.sin(a)*d+phase)}" width="${size}" height="${size}" fill="${color}" opacity="${.85-k%3*.15}"/>`);}};
  const t=clamp((f-4)/5),impact=clamp((f-9)/6)*15,angle=Math.atan2(ty-sy,tx-sx)*180/Math.PI,ix=hit?tx:tx+dir*28,iy=hit?ty:ty-18;
  if(support){
   const seed=r.seed%3,keys=mode==='heal'?['healPulse','lifeBloom','lite_heal_sparkles_nature']:mode==='guard'?['guardShell','lite_shield_bubble_arcane','holyCircle']:['chargeUp','runeGate','heroSurge'];
   stamp(keys[seed],sx,sy-4,64+r.tier*8,64+r.tier*8,f);if(f>=4&&f<=12)stamp(mode==='heal'?'petalBloom':mode==='guard'?'runeGate':'colorRing3',sx,sy+12,50,22,(f-4)*1.8,0,.7);pixels(sx,sy,5+r.tier,18+f,f*-1.2);
  }else{
   if(f<5&& !['target','sky','ground','eruption'].includes(mode))stamp(r.charge,sx,sy,34+f*5,34+f*5,f*3,0,.9);
   if(f>=3&&f<=10){
    const x=sx+(ix-sx)*t,y=sy+(iy-sy)*t;
    if(mode==='sky'){
     if(f<6)stamp('stormField',tx,12,70,24,f*2,0,.8);
     if(f>=5){stamp(r.travel,ix,iy-30,32+f,100,(f-5)*2,0);if(f>=7)stamp('tesla',ix,iy-20,50,75,(f-6)*3,90,.85);}
    }else if(last.moveName==='Thunderbolt'){
     for(let k=0;k<3;k++)stamp('goldTesla',sx+(ix-sx)*(.25+k*.27),sy+(iy-sy)*(.25+k*.27)+(k%2?8:-6),60,25,(f-3)*2+k,angle,.9);stamp('goldWave',ix,iy,40,40,(f-4)*2,angle);
    }else if(mode==='meteor'){
     for(let k=0;k<3+r.tier;k++){const delay=k%3,fall=clamp((f-4-delay)/4);stamp(r.travel,ix-38+k*76/(2+r.tier),iy-85+fall*85,30+r.tier*4,50,(f-3-delay)*2,25*dir,.9);}
    }else if(mode==='eruption'){
     stamp('runeGate',ix,iy+17,76,24,(f-3)*2,0,.65);
     if(f>=6)for(let k=0;k<3+r.tier;k++)stamp(r.travel,ix-33+k*66/(2+r.tier),iy+20-(f-5)*7,28+r.tier*3,45+(f-6)*6,(f-5+k)*2,0,.95);
    }else if(mode==='target'){
     stamp(r.charge,ix,iy,78,48,(f-3)*2,0,.8);for(let k=0;k<3;k++){const a=(f*19+k*120)*Math.PI/180;stamp(r.travel,ix+Math.cos(a)*(36-t*20),iy+Math.sin(a)*(23-t*12),26,26,(f+k)*1.5,k*120);}
    }else if(mode==='vortex'){
     stamp(r.travel,ix,iy,72+f*3,72+f*3,(f-3)*2,0,.85);stamp('vortexColor',ix,iy+5,55,55,f,0,.55);
    }else if(mode==='beam'){
     const len=Math.hypot(ix-sx,iy-sy)*clamp((f-3)/2);stamp(r.travel,sx+dir*len*.43,sy+(iy-sy)*.43,Math.max(12,len),24+r.tier*5,(f-3)*2,angle,1);pixels(ix,iy,7,15,f-5);
    }else if(mode==='wave'){
     stamp(r.travel,x,y+9,60+r.tier*17,70+r.tier*13,(f-3)*2,0,.92);if(f>=6)stamp(r.accent,x-dir*25,y+15,40,24,(f-5)*2,0,.7);
    }else if(mode==='barrage'){
     for(let k=0;k<3+r.tier;k++){const q=clamp((f-4-k*.55)/4),side=k%2?1:-1;stamp(r.travel,sx+(ix-sx)*q,sy+(iy-sy)*q+Math.sin(q*Math.PI)*side*(14+k*5),20+r.tier*4,20+r.tier*4,(f-3+k)*1.4,k*55);}
    }else if(mode==='ground'){
     for(let k=0;k<7;k++)parts.push(`<rect x="${Math.round(ix-35+k*10)}" y="${Math.round(iy+17+(k%3-1)*3)}" width="12" height="3" fill="#755b41" opacity=".75"/>`);
     for(let k=0;k<5;k++){const q=k/4; if(q<=t+.1)stamp(r.travel,sx+(ix-sx)*q,sy+(iy-sy)*q+18,34,40,(f-k)*2,0,.9);}
    }else if(mode==='dash'){
     for(let k=2;k>=0;k--){const q=clamp(t-k*.12),x=sx+(ix-sx)*q,y=sy+(iy-sy)*q;parts.push(`<image href="${Number(actorId)}.png" x="${Math.round(x-21)}" y="${Math.round(y-25)}" width="42" height="42" opacity="${.75-k*.22}"/>`);}stamp('sonicBoom',x,y,42,42,f,0,.6);
    }else if(mode==='slash'){
     if(f>=6){const k=(f-6)%3;stamp(r.travel,ix+(k-1)*10,iy+(k-1)*5,68+r.tier*10,68+r.tier*10,(f-6)*2,dir*(k*55-35));}
    }else{const arc=(r.seed%3-1)*22;stamp(r.travel,x,y+Math.sin(t*Math.PI)*arc,35+r.tier*8,35+r.tier*8,(f-4)*2,angle);pixels(x-dir*12,y,3,9,0);}
   }
   if(f>=9&&hit){
    const size=(mode==='slash'?52:62)*scale;stamp(r.impact,tx,ty,size,size,impact);
    if(r.tier>=1&&f<=13)stamp(r.accent,tx,ty+16,64+r.tier*11,30+r.tier*8,impact,0,.7);
    pixels(tx,ty,6+r.tier*3,12+(f-9)*9,(f-9)*2);
    if(r.tier===3&&f<=13){const accent=({383:'stoneSpire',382:'geyser',384:'tornado',150:'arcaneNova',151:'divineNova',483:'runeGate',484:'portalGate',487:'ghostWisps',493:'holyPillar',643:'blueFire',644:'tesla',716:'lifeBloom',717:'soulDrain',791:'phoenix',792:'phantomFlare',386:'colorRing3'})[actorId]||r.accent;stamp(accent,tx-dir*32,ty+8,46,62,impact,0,.75);stamp(accent,tx+dir*32,ty-4,40,54,impact+3,0,.6);}
    if(last.effect==='poison'&&f>=12)stamp('toxicPool',tx,ty+17,46,18,(f-12)*4,0,.8);
    if(last.effect==='burn'&&f>=12)stamp('burningLand',tx,ty+16,42,25,(f-12)*4,0,.75);
    if(last.effect==='drain'&&f>=12){const q=(f-12)/3;stamp('soulDrain',tx+(sx-tx)*q,ty+(sy-ty)*q,34,34,(f-12)*4);stamp('healPulse',sx,sy,38,38,(f-12)*4,0,.7);}
   }
  }
  return `<g class="px-frame" style="--frame:${f}">${parts.join('')}</g>`;
 }).join('');
 return `<svg class="move-art pixel-art fx-${mode}" data-delivery="${mode}" data-effect-tier="${r.tier}" data-recipe="${r.charge}:${r.travel}:${r.impact}" viewBox="0 0 250 150" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${frames}</svg>${power?`<b class="fx-number ${self?'enemy-number':'self-number'}">−${power}</b>`:''}${last.heal?`<b class="fx-number heal-number ${self?'self-number':'enemy-number'}">+${Number(last.heal)} HP</b>`:''}`;
}
