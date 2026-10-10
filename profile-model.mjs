export const AVATARS = ['fox','cat','dog','panda','koala','rabbit','bear','frog','owl','penguin','duck','lion','tiger','monkey','pig','mouse','raccoon','elephant','deer','sloth'];
export const STARTERS = [25,133,3];
export const SHOP = [{id:6,price:8,tag:'Fire starter'},{id:9,price:8,tag:'Water guardian'},{id:94,price:15,tag:'Ghost trickster'},{id:131,price:18,tag:'Ice explorer'},{id:282,price:20,tag:'Psychic wonder'},{id:448,price:25,tag:'Aura champion'},{id:143,price:28,tag:'220 HP tank'},{id:149,price:35,tag:'Dragon powerhouse'},{id:445,price:45,tag:'Fast dragon champion'}];
export function freshProfile(name='Sunny',avatar='fox'){return {nickname:name.slice(0,20)||'Sunny',avatar:AVATARS.includes(avatar)?avatar:'fox',language:'vi',uiLanguage:'en',known:[],completed:[],stars:0,totalEarned:0,totalSpent:0,owned:[...STARTERS],minutes:0,goal:10,practiceDays:[],streak:1};}
export function reduceProfile(profile,action){
 const p=structuredClone(profile);
 switch(action.type){
 case 'settings': p.nickname=String(action.nickname??p.nickname).trim().slice(0,20)||'Sunny';p.avatar=AVATARS.includes(action.avatar)?action.avatar:p.avatar;p.goal=[5,10,15].includes(action.goal)?action.goal:p.goal;break;
 case 'language': if(['vi','en','zh'].includes(action.language))p.language=action.language;break;
 case 'ui': if(['vi','en','zh'].includes(action.language))p.uiLanguage=action.language;break;
 case 'reward': {
  if(!/^(learn|solve):(vi|en|zh):[a-z0-9-]+$/.test(action.key)||action.key.length>180)throw Error('Invalid learning reward');
  if(p.completed.includes(action.key)){const word=action.key.replace(/^(learn|solve):/,'');if(!p.known.includes(word))p.known.push(word);return p;}
  if(p.completed.length>=9000)throw Error('Your learning record is full. Contact the app owner.');
  p.completed.push(action.key);p.stars++;p.totalEarned++;p.minutes++;const word=action.key.replace(/^(learn|solve):/,'');if(!p.known.includes(word))p.known.push(word);const day=String(action.day||'').slice(0,10);if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&!p.practiceDays.includes(day))p.practiceDays.push(day);
  break;}
 case 'unlearn':p.known=p.known.filter(id=>id!==action.id);break;
 case 'buy':{const item=SHOP.find(x=>x.id===action.id);if(!item)throw Error('Unknown Pokémon');if(p.owned.includes(item.id))throw Error('You already own this Pokémon');if(p.stars<item.price)throw Error('Keep learning to earn more stars');p.stars-=item.price;p.totalSpent+=item.price;p.owned.push(item.id);break;}
 default:throw Error('Unknown account action');
 }
 return p;
}
export function learningState(p){return {...p,known:p.known.filter(k=>k.startsWith(p.language+':')).map(k=>k.slice(p.language.length+1))};}
