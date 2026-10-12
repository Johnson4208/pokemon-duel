// A familiar collection with distinct battle roles and meaningful progression.
export const STARTERS=[25,133,3];
export const FREE_POKEMON=[25,133,1,4,7,39,54,52,37,722,447,3];
export const ROLE_LABELS={support:'Pure support',attrition:'Attrition',tank:'Tank',striker:'Striker',balanced:'Balanced',legendary:'Legendary'};
export const ROLE_TRANSLATIONS={en:ROLE_LABELS,vi:{support:'Hỗ trợ thuần',attrition:'Cấu rỉa',tank:'Chống chịu',striker:'Tấn công nhanh',balanced:'Cân bằng',legendary:'Huyền thoại'},zh:{support:'纯辅助',attrition:'持续消耗',tank:'防御坦克',striker:'强力攻击',balanced:'均衡型',legendary:'传说宝可梦'}};
export const ROLE_ICONS={support:'✚',attrition:'☠',tank:'◈',striker:'⚡',balanced:'✦',legendary:'✧'};
export const SHOP=[
 {id:6,price:12,tag:'Fire superstar',rank:3},{id:9,price:12,tag:'Water guardian'},
 {id:59,price:15,tag:'Flame companion'},{id:197,price:18,tag:'Moonlight friend'},
 {id:700,price:18,tag:'Ribbon magic'},{id:94,price:23,tag:'Ghost trickster'},
 {id:778,price:23,tag:'Little disguise',rank:10},{id:131,price:27,tag:'Ice explorer'},
 {id:282,price:30,tag:'Psychic wonder'},{id:658,price:33,tag:'Water ninja'},
 {id:448,price:38,tag:'Aura champion'},{id:143,price:42,tag:'Gentle giant'},
 {id:727,price:45,tag:'Fire champion',rank:4},{id:149,price:53,tag:'Dragon friend'},
 {id:373,price:60,tag:'Sky dragon',rank:9},{id:445,price:68,tag:'Dragon champion',rank:7},
 {id:113,price:20,tag:'Healing heart'},{id:36,price:24,tag:'Moonlight helper'},
 {id:531,price:32,tag:'Kindness companion'},{id:242,price:48,tag:'Healing champion'},
 {id:151,price:128,tag:'Mythical wonder',legendary:true},{id:150,price:180,tag:'Psychic legend',legendary:true},
 {id:384,price:220,tag:'Sky legend',legendary:true,rank:8},{id:383,price:175,tag:'Land legend',legendary:true,rank:2},
 {id:382,price:175,tag:'Ocean legend',legendary:true,rank:1},{id:386,price:145,tag:'DNA legend',legendary:true},
 {id:483,price:190,tag:'Time legend',legendary:true},{id:484,price:190,tag:'Space legend',legendary:true},
 {id:487,price:210,tag:'Distortion legend',legendary:true},{id:493,price:260,tag:'Creator legend',legendary:true},
 {id:643,price:170,tag:'Truth legend',legendary:true},{id:644,price:170,tag:'Ideals legend',legendary:true},
 {id:716,price:160,tag:'Life legend',legendary:true},{id:717,price:160,tag:'Destruction legend',legendary:true},
 {id:791,price:185,tag:'Sun legend',legendary:true},{id:792,price:185,tag:'Moon legend',legendary:true}
];
export const collection=p=>[...new Set([...FREE_POKEMON,...(p?.owned||STARTERS)])];
export const TYPES={electric:['Điện','#edb72e','⚡'],fire:['Lửa','#ee7752','🔥'],water:['Nước','#599fe1','💧'],grass:['Cỏ','#6dad69','🌿'],ghost:['Ma','#967bc5','👻'],dragon:['Rồng','#7a82d1','🐉'],normal:['Thường','#a79c8c','✦'],fighting:['Giác đấu','#c16d66','🥊'],psychic:['Siêu linh','#d278a3','🔮'],ground:['Đất','#b99b6b','⛰'],ice:['Băng','#78bfc3','❄'],fairy:['Tiên','#e18fbe','✿'],dark:['Bóng tối','#74738d','☾'],flying:['Bay','#86a9d9','🪽'],steel:['Thép','#91a6b4','⚙']};
export const EFFECTS={burn:'🔥 Burn: 6 HP after each of 3 actions',poison:'☁ Poison: 8 HP after each of 3 actions',chill:'❄ Chill: 20% less damage for 2 actions',drain:'🌿 Restore half the damage dealt',heal:'💚 Restore 20% of maximum HP',focus:'✨ Next hit deals 25% more damage',guard:'◈ Reduce the next hit by 50%',pierce:'💥 This move passes through Guard'};
const m=(name,type,power,pp=10,accuracy=100,effect='',chance=100)=>({name,type,power,pp,accuracy,effect,chance});
const effectFor={fire:'burn',grass:'drain',ghost:'poison',ice:'chill',fighting:'pierce',fairy:'drain',dark:'poison'};
const supportMoves=(type,names)=>[m(names[0],type,0,5,100,'heal'),m(names[1],type,0,6,100,'focus'),m(names[2],type,0,6,100,'guard')];
const mon=(id,name,type,hp,attack,defense,speed,names,coverage,role='balanced',attritionEffect='')=>{
 const nativeEffect=attritionEffect||effectFor[type]||'';
 let moves;
 if(role==='support')moves=[m(names[0],type,35,14),...supportMoves(type,names.slice(1))];
 else if(role==='tank')moves=[m(names[0],type,38,14),m(names[1],coverage,42,12),m(names[2],type,52,7),m(names[3],type,0,5,100,'guard')];
 else if(role==='attrition')moves=[m(names[0],type,58,10,100,attritionEffect||nativeEffect||'poison',45),m(names[1],coverage,52,12),m(names[2],type,78,6,90,attritionEffect||nativeEffect||'poison',65),m(names[3],type,44,8,100,attritionEffect||nativeEffect||'poison',30)];
 else moves=[m(names[0],type,65,10,100,nativeEffect,['burn','poison','chill'].includes(nativeEffect)?35:100),m(names[1],coverage,50,15),m(names[2],type,85,5,85),m(names[3],coverage,56,8,95)];
 if(role==='striker')moves=[m(names[0],type,75,10,100,nativeEffect),m(names[1],coverage,60,12),m(names[2],type,100,4,80),m(names[3],coverage,62,7,92)];
 // The strongest damaging move is each Pokémon's signature Ultimate. Support
 // Pokémon instead empower their first healing move so the whole roster has one.
 const ultimate=role==='support'?moves.find(move=>move.effect==='heal'):moves.filter(move=>move.power>0).sort((a,b)=>b.power-a.power)[0];
 if(ultimate)ultimate.ultimate=true;
 return {id,name,type,hp,attack,defense,speed,role,moves};
};
export const ROSTER=[
 mon(25,'Pikachu','electric',120,56,44,90,['Thunderbolt','Quick Attack','Thunder','Charge'],'normal','striker'),
 mon(133,'Eevee','normal',130,55,50,65,['Swift','Wish','Bright Wish','Cozy Guard'],'fighting','support'),
 mon(1,'Bulbasaur','grass',125,55,53,60,['Giga Drain','Tackle','Seed Burst','Synthesis'],'normal','attrition','poison'),
 mon(4,'Charmander','fire',120,57,45,75,['Ember','Dragon Breath','Flame Burst','Sunny Spark'],'dragon','striker'),
 mon(7,'Squirtle','water',158,50,75,55,['Water Pulse','Ice Shard','Bubble Blast','Shell Focus'],'ice','tank'),
 mon(39,'Jigglypuff','fairy',165,52,43,40,['Pound','Sweet Song','Soothing Wish','Dream Guard'],'normal','support'),
 mon(54,'Psyduck','water',135,57,52,65,['Water Pulse','Confusion','Surf','Calm Focus'],'psychic','balanced'),
 mon(52,'Meowth','normal',120,56,45,95,['Pay Day','Bite','Fury Swipes','Lucky Focus'],'dark','striker'),
 mon(37,'Vulpix','fire',125,55,50,80,['Ember','Extrasensory','Fire Spin','Warm Wish'],'psychic','attrition','burn'),
 mon(722,'Rowlet','grass',140,55,55,60,['Leaf Drain','Air Slash','Leaf Storm','Roost'],'flying','attrition','poison'),
 mon(447,'Riolu','fighting',125,60,48,85,['Force Palm','Quick Attack','Aura Burst','Inner Focus'],'normal','striker'),
 mon(3,'Venusaur','grass',160,65,69,80,['Giga Drain','Earth Power','Solar Beam','Synthesis'],'ground','attrition','poison'),
 mon(6,'Charizard','fire',155,68,61,100,['Flamethrower','Dragon Claw','Fire Blast','Solar Focus'],'dragon','striker'),
 mon(9,'Blastoise','water',190,58,88,58,['Surf','Ice Beam','Hydro Pump','Shell Focus'],'ice','tank'),
 mon(59,'Arcanine','fire',165,68,62,95,['Flamethrower','Extreme Speed','Flare Burst','Morning Sun'],'normal','striker'),
 mon(197,'Umbreon','dark',190,55,84,65,['Dark Pulse','Quick Attack','Night Burst','Moonlight'],'normal','tank'),
 mon(700,'Sylveon','fairy',165,69,61,60,['Draining Kiss','Swift','Moonblast','Wish'],'normal','balanced'),
 mon(94,'Gengar','ghost',130,76,50,110,['Shadow Ball','Psychic','Shadow Storm','Ghost Focus'],'psychic','attrition','poison'),
 mon(778,'Mimikyu','ghost',140,65,65,96,['Shadow Claw','Play Rough','Phantom Burst','Disguise Focus'],'fairy','attrition','poison'),
 mon(131,'Lapras','ice',205,58,78,55,['Ice Beam','Surf','Blizzard','Life Dew'],'water','tank'),
 mon(282,'Gardevoir','psychic',140,78,51,80,['Psychic','Moonblast','Psycho Burst','Healing Wish'],'fairy','balanced'),
 mon(658,'Greninja','water',145,72,53,115,['Water Shuriken','Dark Pulse','Hydro Pump','Ninja Focus'],'dark','striker'),
 mon(448,'Lucario','fighting',145,76,58,90,['Aura Sphere','Dragon Pulse','Close Combat','Aura Focus'],'dragon','striker'),
 mon(143,'Snorlax','normal',230,58,78,30,['Body Slam','Earthquake','Giga Impact','Rest'],'ground','tank'),
 mon(727,'Incineroar','fire',180,72,70,60,['Flame Punch','Darkest Lariat','Flare Blitz','Champion Focus'],'dark','balanced'),
 mon(149,'Dragonite','dragon',175,74,69,80,['Dragon Pulse','Fire Punch','Outrage','Roost'],'fire','balanced'),
 mon(373,'Salamence','dragon',170,77,63,100,['Dragon Claw','Air Slash','Dragon Meteor','Sky Focus'],'flying','striker'),
 mon(445,'Garchomp','ground',175,76,68,102,['Earthquake','Dragon Claw','Earth Crush','Sand Focus'],'dragon','striker'),
 mon(151,'Mew','psychic',165,72,66,100,['Psychic','Aura Sphere','Star Burst','Life Dew'],'fighting','legendary'),
 mon(150,'Mewtwo','psychic',160,82,58,120,['Psystrike','Shadow Ball','Psychic Storm','Recover'],'ghost','legendary'),
 mon(384,'Rayquaza','dragon',185,80,66,95,['Dragon Pulse','Air Slash','Dragon Ascent','Sky Focus'],'flying','legendary'),
 mon(383,'Groudon','ground',210,72,88,72,['Earthquake','Fire Punch','Precipice Blades','Land Focus'],'fire','legendary'),
 mon(382,'Kyogre','water',210,74,84,76,['Surf','Ice Beam','Origin Pulse','Ocean Focus'],'ice','legendary'),
 mon(113,'Chansey','normal',185,42,48,45,['Pound','Soft-Boiled','Kind Wish','Safeguard'],'normal','support'),
 mon(36,'Clefable','fairy',170,48,58,60,['Pound','Moonlight','Star Wish','Fairy Guard'],'normal','support'),
 mon(531,'Audino','normal',175,46,60,55,['Pound','Refresh','Healing Hum','Kind Guard'],'fairy','support'),
 mon(242,'Blissey','normal',215,45,58,50,['Pound','Soft-Boiled','Happy Thought','Team Guard'],'normal','support'),
 mon(386,'Deoxys','psychic',165,86,55,115,['Psycho Boost','Swift','Cosmic Strike','Focus'],'normal','legendary'),
 mon(483,'Dialga','dragon',205,78,90,75,['Roar of Time','Flash Cannon','Time Break','Focus'],'steel','legendary'),
 mon(484,'Palkia','water',195,82,76,100,['Spacial Rend','Aqua Tail','Rift Wave','Focus'],'dragon','legendary'),
 mon(487,'Giratina','ghost',220,76,88,70,['Shadow Force','Dragon Claw','Rift Crush','Focus'],'dragon','legendary'),
 mon(493,'Arceus','normal',220,88,82,95,['Judgment','Swift','Divine Pulse','Focus'],'psychic','legendary'),
 mon(643,'Reshiram','dragon',195,84,70,90,['Blue Flare','Dragon Breath','Fusion Flare','Focus'],'fire','legendary'),
 mon(644,'Zekrom','dragon',200,86,74,85,['Bolt Strike','Dragon Claw','Fusion Bolt','Focus'],'electric','legendary'),
 mon(716,'Xerneas','fairy',205,80,76,85,['Moonblast','Horn Leech','Geomancy','Focus'],'grass','legendary'),
 mon(717,'Yveltal','dark',200,82,72,95,['Oblivion Wing','Dark Pulse','Sky Attack','Focus'],'flying','legendary'),
 mon(791,'Solgaleo','psychic',205,82,84,85,['Sunsteel Strike','Psychic Fangs','Solar Crash','Focus'],'steel','legendary'),
 mon(792,'Lunala','psychic',200,85,70,90,['Moongeist Beam','Shadow Ball','Lunar Wave','Focus'],'ghost','legendary')
];
