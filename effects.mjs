// Decorative SVG effects share the arena's coordinates; combat stays in engine.mjs.
export function moveVisual(last){
 if(last.type==='guard')return 'guard';
 if(last.type==='potion'||last.effect==='heal')return 'heal';
 if(last.effect==='focus')return 'focus';
 if(last.moveName==='Quick Attack')return 'dash';
 if(last.moveName==='Thunder')return 'thunder';
 if(last.moveName==='Thunderbolt')return 'lightning';
 return ({electric:'lightning',fire:'flame',water:'bubble',grass:'leaves',ice:'ice',ghost:'mist',psychic:'rings',fairy:'sparkles',fighting:'strike',ground:'stones',dragon:'spiral',dark:'slash',flying:'gust',normal:'dash'})[last.moveType]||'strike';
}
const palettes={lightning:['#fff3a5','#dfb743'],thunder:['#ffe998','#b9acd6'],dash:['#fff4c5','#c5d6b0'],flame:['#ffd3a3','#e89576'],bubble:['#c6ecf2','#79b5d4'],leaves:['#d9edb9','#86b482'],ice:['#ddf4f5','#97c7d1'],mist:['#e1d6f1','#ac97ca'],rings:['#efcee1','#ce9dbb'],sparkles:['#ffe1ee','#d9a8d4'],strike:['#ffe0bc','#cc9f87'],stones:['#eddcbc','#b8a184'],spiral:['#dfdef9','#a09dce'],slash:['#dcd9e9','#aaa2be'],gust:['#e2edf8','#a8c4d4'],heal:['#def0c9','#8fbd87'],focus:['#fff0b0','#cebd79'],guard:['#d5e7f1','#9bb9cb']};
export function effectMarkup(last,self){
 const visual=moveVisual(last),support=['heal','focus','guard'].includes(visual),[sx,sy]=self?[260,400]:[750,200], [tx,ty]=support?[sx,sy]:self?[750,200]:[260,400];
 const dx=tx-sx,dy=ty-sy,length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI,[light,ink]=palettes[visual];
 const path=(d,cls='')=>`<path class="${cls}" d="${d}"/>`;
 const star=(x,y,r=12)=>path(`M${x} ${y-r} Q${x+3} ${y-3} ${x+r} ${y} Q${x+3} ${y+3} ${x} ${y+r} Q${x-3} ${y+3} ${x-r} ${y} Q${x-3} ${y-3} ${x} ${y-r}Z`,'fx-star');
 let art='';
 if(visual==='lightning'){
  art=`<g class="fx-channel" transform="translate(${sx} ${sy}) rotate(${angle})">${path(`M0 0 L${length*.2} -9 L${length*.15} 16 L${length*.4} -12 L${length*.34} 15 L${length*.62} -10 L${length*.56} 13 L${length} 0`,'fx-lightning')}${path(`M${length*.35} 0 l40 -43 l-12 25 l60 -12 M${length*.6} 0 l40 42 l-8 -26 l48 20`,'fx-branch')}</g>`;
 }else if(visual==='thunder'){
  art=`<g class="fx-cloud" transform="translate(${tx} ${ty-180})"><ellipse cx="0" cy="0" rx="67" ry="25"/><ellipse cx="-36" cy="-9" rx="28" ry="24"/><ellipse cx="9" cy="-22" rx="35" ry="28"/><ellipse cx="40" cy="-8" rx="31" ry="26"/></g><g class="fx-sky-bolt" transform="translate(${tx} ${ty})">${path('M-10 -165 L-29 -100 L8 -110 L-14 -43 L19 -53 L0 0','fx-lightning')}${path('M-12 -60 l-40 -20 l9 26 l-20 13 M6 -110 l39 22 l-8 -21 l24 13','fx-branch')}</g>`;
 }else if(visual==='dash'||visual==='gust'){
  art=`<g class="fx-channel" transform="translate(${sx} ${sy}) rotate(${angle})">${[-20,0,20].map((y,i)=>path(`M${i*24} ${y} Q${length*.5} ${y-8} ${length-20} ${y}`,'fx-speed')).join('')}<ellipse class="fx-dash-head" cx="${length-20}" cy="0" rx="40" ry="17"/></g>`;
 }else if(support){
  art=`<g transform="translate(${tx} ${ty})"><ellipse class="fx-ring" cx="0" cy="0" rx="66" ry="38"/><ellipse class="fx-ring fx-ring-late" cx="0" cy="0" rx="89" ry="52"/>${visual==='heal'?path('M-9 -28 h18 v19 h19 v18 h-19 v19 h-18 v-19 h-19 v-18 h19Z','fx-cross'):visual==='guard'?path('M0 -60 Q30 -42 50 -45 V-7 Q44 24 0 46 Q-44 24 -50 -7 V-45 Q-30 -42 0 -60Z','fx-shield'):star(0,-42,23)}${[-1,1].map(n=>star(n*72,-35,9)).join('')}</g>`;
 }else{
  const shapes=Array.from({length:8},(_,i)=>{
   const x=length*(i+1)/9,y=Math.sin(i*2.4)*26;
   if(visual==='bubble')return `<circle class="fx-particle" cx="${x}" cy="${y}" r="${10+i%3*5}"/><path class="fx-glint" d="M${x-5} ${y-6} q3 -4 8 -3"/>`;
   if(visual==='flame')return path(`M${x} ${y-23} Q${x+27} ${y+12} ${x} ${y+17} Q${x-20} ${y+8} ${x} ${y-23}Z`,'fx-particle');
   if(visual==='leaves')return path(`M${x-16} ${y+12} Q${x-20} ${y-22} ${x+18} ${y-15} Q${x+22} ${y+18} ${x-16} ${y+12}Z`,'fx-particle');
   if(visual==='ice')return path(`M${x} ${y-22} l13 22 l-13 22 l-13 -22Z`,'fx-particle');
   if(visual==='stones')return path(`M${x-14} ${y-10} l17 -6 l11 16 l-9 15 l-20 -5Z`,'fx-particle');
   if(visual==='sparkles'||visual==='spiral')return star(x,y,12+i%2*6);
   if(visual==='slash'||visual==='strike')return path(`M${x-14} ${y+23} Q${x+20} ${y-6} ${x+13} ${y-23}`,'fx-slash');
   return `<ellipse class="fx-particle" cx="${x}" cy="${y}" rx="${visual==='mist'?27:12}" ry="${visual==='mist'?15:27}"/>`;
  }).join('');
  art=`<g class="fx-channel fx-stream" transform="translate(${sx} ${sy}) rotate(${angle})">${shapes}</g>`;
 }
 const impact=!support&&last.hit?`<g class="fx-impact" transform="translate(${tx} ${ty})"><ellipse cx="0" cy="0" rx="56" ry="38"/>${[-1,1].map(n=>star(n*49,-25,12)).join('')}${star(0,38,9)}</g>`:'';
 const numbers=`${last.damage?`<b class="fx-number ${self?'enemy-number':'self-number'}">−${last.damage}</b>`:''}${last.heal?`<b class="fx-number heal-number ${self?'self-number':'enemy-number'}">+${last.heal} HP</b>`:''}`;
 // A miss draws the travelling effect, but never an impact or damage number.
 return `<svg class="move-art fx-${visual}" viewBox="0 0 1000 600" preserveAspectRatio="none" style="--fx-light:${light};--fx-ink:${ink}" aria-hidden="true"><g class="fx-art">${art}${impact}</g></svg>${numbers}`;
}
