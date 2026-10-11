// Low-resolution, frame-by-frame pixel effects. Every mark occupies an integer grid cell.
export function moveVisual(last){
 if(last.type==='guard')return 'guard';
 if(last.type==='potion'||last.effect==='heal')return 'heal';
 if(last.effect==='focus')return 'focus';
 if(last.moveName==='Quick Attack')return 'dash';
 if(last.moveName==='Thunder')return 'thunder';
 if(last.moveName==='Thunderbolt')return 'lightning';
 return ({electric:'lightning',fire:'flame',water:'bubble',grass:'leaves',ice:'ice',ghost:'mist',psychic:'rings',fairy:'sparkles',fighting:'strike',ground:'stones',dragon:'spiral',dark:'slash',flying:'gust',normal:'dash'})[last.moveType]||'strike';
}
const palettes={lightning:['#80521e','#ffb520','#fff18c'],thunder:['#5d477b','#ffc52a','#fff7ba'],dash:['#595380','#b9ddf3','#fff7cc'],flame:['#a63739','#ff7c2c','#ffe87b'],bubble:['#315888','#369bd3','#b2f5ff'],leaves:['#386145','#70bb4d','#d0ed82'],ice:['#497baf','#77cfe5','#d6ffff'],mist:['#4c396b','#9271bf','#dec5ff'],rings:['#893e8b','#e577ca','#ffd1f5'],sparkles:['#a34e97','#f5a0d0','#fff6bb'],strike:['#914b38','#ed9860','#fff0b4'],stones:['#635047','#b59064','#ead29a'],spiral:['#49468b','#8d84e5','#d4e2ff'],slash:['#302b4c','#716284','#c9b6e2'],gust:['#526a92','#abcce5','#efffff'],heal:['#39794d','#79d879','#d3ffaf'],focus:['#9d641a','#ffc62b','#fff6ae'],guard:['#436d92','#8fcce8','#d3faff']};
export function effectMarkup(last,self,actorId=25){
 if(!['move','struggle','guard','potion'].includes(last.type))return '';
 const visual=moveVisual(last),support=['heal','focus','guard'].includes(visual),sx=self?58:196,sy=self?103:51,tx=support?sx:self?196:58,ty=support?sy:self?51:103,palette=palettes[visual];
 const frames=Array.from({length:8},(_,f)=>{
  const pixels=new Map();
  const dot=(x,y,size=1,color=1)=>{x=Math.round(x);y=Math.round(y);for(let a=0;a<size;a++)for(let b=0;b<size;b++)if(x+a>=0&&x+a<250&&y+b>=0&&y+b<150)pixels.set(`${x+a},${y+b}`,color);};
  const line=(x,y,xx,yy,size=1,color=1)=>{const steps=Math.max(Math.abs(xx-x),Math.abs(yy-y),1);for(let i=0;i<=steps;i++)dot(x+(xx-x)*i/steps,y+(yy-y)*i/steps,size,color);};
  const bolt=(points,width=3)=>{for(const [size,color]of [[width+3,0],[width+1,1],[Math.max(1,width-1),2]])for(let i=1;i<points.length;i++)line(points[i-1][0]-size/2,points[i-1][1]-size/2,points[i][0]-size/2,points[i][1]-size/2,size,color);};
  const cross=(x,y,r=3,c=2)=>{line(x-r,y,x+r,y,2,c);line(x,y-r,x,y+r,2,c);};
  const ring=(x,y,r,c=1)=>{for(let a=0;a<60;a++){const t=a*Math.PI/30;dot(x+Math.cos(t)*r,y+Math.sin(t)*r*.65,2,c);}};
  const burst=(x,y,strength=1)=>{for(let j=0;j<18;j++){const a=j*Math.PI/9,r=(6+f*3+(j%3)*3)*strength;line(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5,x+Math.cos(a)*r,y+Math.sin(a)*r,2,j%3);dot(x+Math.cos(a)*(r+5),y+Math.sin(a)*(r+5),j%2+1,2);}ring(x,y,(f-2)*7+8,1);cross(x,y,4,2);};
  if(visual==='lightning'){
   if(f<3){ring(sx,sy,8+f*5);for(let i=0;i<8;i++)cross(sx+Math.cos(i)*17,sy+Math.sin(i)*15,2);}
   if(f>=2&&f<=5){const end=Math.min(1,(f-1)/2),ex=sx+(tx-sx)*end,ey=sy+(ty-sy)*end,points=[[sx,sy]];for(let i=1;i<9;i++)points.push([sx+(ex-sx)*i/9+((i+f)%2?5:-5),sy+(ey-sy)*i/9+(i%2?6:-6)]);points.push([ex,ey]);bolt(points,3);for(let i=2;i<8;i+=2){const [x,y]=points[i];bolt([[x,y],[x+8,y-13],[x+4,y-8],[x+15,y-20]],1);}}
   if(f>=4&&last.hit)burst(tx,ty,1.1);
  }else if(visual==='thunder'){
   // Chunky storm cloud, three descending bolts, then a large radial electric impact.
   if(f<6)for(let x=-29;x<=29;x++)for(let y=-5;y<=8;y++)if(Math.abs(x)<25-(Math.abs(y)%4))dot(tx+x,11+y,1,(y<0?3:0));
   if(f>=2&&f<=5){for(let side=-1;side<=1;side++){const x=tx+side*21;bolt([[x,16],[x-7,27],[x+3,25],[x-5,38],[tx+side*7,ty-4],[tx,ty]],side===0?5:2);}}
   if(f>=3&&last.hit){burst(tx,ty,1.6);for(let i=-3;i<=3;i++)dot(tx+i*10,ty+20+(i%2)*3,4,i%2?1:0);}
  }else if(visual==='dash'||visual==='gust'){
   const t=Math.min(1,(f+1)/5),x=sx+(tx-sx)*t,y=sy+(ty-sy)*t;
   for(let j=-3;j<=3;j++){line(sx+(tx-sx)*Math.max(0,t-.6),sy+(ty-sy)*Math.max(0,t-.6)+j*4,x,y+j*4,2,(j+3)%3);}
   if(f>3&&last.hit)burst(tx,ty,.8);
  }else if(support){
   ring(sx,sy,9+f*3,1);ring(sx,sy,15+f*3,0);
   if(visual==='heal'){cross(sx,sy-10-f*2,6);for(let i=-1;i<=1;i++)cross(sx+i*20,sy+6-f*4,3,1);}
   else if(visual==='guard'){const points=[[sx-13,sy-17],[sx+13,sy-17],[sx+13,sy+2],[sx,sy+14],[sx-13,sy+2],[sx-13,sy-17]];bolt(points,2);}
   else{for(let j=0;j<10;j++){const a=j*Math.PI/5,r=Math.max(4,28-f*3);cross(sx+Math.cos(a)*r,sy+Math.sin(a)*r,3);}if(f>4)burst(sx,sy,.6);}
  }else{
   for(let i=0;i<12;i++){
    const t=Math.min(1,Math.max(0,(f*2-i+4)/12)),x=sx+(tx-sx)*t,y=sy+(ty-sy)*t+Math.sin(i*2+f)*6;
    if(visual==='flame'){for(let j=0;j<5;j++){const w=6-j;line(x-w,y-j*3,x+w,y-j*3,3,j>2?2:j?1:0);}dot(x-1,y-19,2,2);}
    else if(visual==='bubble'||visual==='rings'){ring(x,y,4+i%3,i%3);dot(x-2,y-3,2,2);}
    else if(visual==='leaves'){for(let j=-4;j<=4;j++)line(x-Math.max(0,4-Math.abs(j)),y+j,x+Math.max(0,4-Math.abs(j)),y+j,2,1);line(x-2,y+3,x+2,y-3,1,2);}
    else if(visual==='ice'){bolt([[x,y-9],[x+4,y],[x,y+9],[x-4,y],[x,y-9]],1);}
    else if(visual==='stones'){dot(x-4,y-4,8,0);dot(x-3,y-4,6,1);dot(x-2,y-3,3,2);}
    else if(visual==='slash'||visual==='strike'){bolt([[x-6,y+7],[x,y],[x+5,y-8]],2);}
    else if(visual==='mist'){dot(x-5,y-3,8,0);dot(x-3,y-5,6,1);dot(x+1,y-1,2,2);}
    else cross(x,y,3+i%3,i%3);
   }
   if(f>4&&last.hit)burst(tx,ty,1);
  }
  const art=[...pixels].map(([xy,c])=>{const [x,y]=xy.split(',');return `<rect x="${x}" y="${y}" width="1" height="1" fill="${c===3?'#83749c':palette[c]}"/>`;}).join('');
  const ghosts=visual==='dash'&&f<5?[0,1,2].map(i=>{const t=Math.max(0,(f-i)/5);return `<image href="${Number(actorId)}.png" x="${sx+(tx-sx)*t-22}" y="${sy+(ty-sy)*t-25}" width="44" height="44" opacity="${.5-i*.13}"/>`;}).join(''):'';
  return `<g class="px-frame" style="--frame:${f}">${ghosts}${art}</g>`;
 }).join('');
 return `<svg class="move-art pixel-art fx-${visual}" viewBox="0 0 250 150" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${frames}</svg>${last.damage?`<b class="fx-number ${self?'enemy-number':'self-number'}">−${last.damage}</b>`:''}${last.heal?`<b class="fx-number heal-number ${self?'self-number':'enemy-number'}">+${last.heal} HP</b>`:''}`;
}
