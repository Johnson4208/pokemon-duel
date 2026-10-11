// A small, familiar collection; ranking notes refer to WolfeyVGC's ranking video.
export const STARTERS=[25,133,3]; // Stored legacy defaults stay compatible with existing accounts.
export const FREE_POKEMON=[25,133,1,4,7,39,54,52,37,722,447,3];
export const SHOP=[
 {id:6,price:12,tag:'Fire superstar',rank:3},{id:9,price:12,tag:'Water guardian'},
 {id:59,price:15,tag:'Flame companion'},{id:197,price:18,tag:'Moonlight friend'},
 {id:700,price:18,tag:'Ribbon magic'},{id:94,price:23,tag:'Ghost trickster'},
 {id:778,price:23,tag:'Little disguise',rank:10},{id:131,price:27,tag:'Ice explorer'},
 {id:282,price:30,tag:'Psychic wonder'},{id:658,price:33,tag:'Water ninja'},
 {id:448,price:38,tag:'Aura champion'},{id:143,price:42,tag:'Gentle giant'},
 {id:727,price:45,tag:'Fire champion',rank:4},{id:149,price:53,tag:'Dragon friend'},
 {id:373,price:60,tag:'Sky dragon',rank:9},{id:445,price:68,tag:'Dragon champion',rank:7},
 {id:151,price:68,tag:'Mythical wonder'},{id:150,price:75,tag:'Psychic legend'},
 {id:384,price:90,tag:'Sky legend',rank:8},{id:383,price:98,tag:'Land legend',rank:2},
 {id:382,price:98,tag:'Ocean legend',rank:1}
];
export const collection=p=>[...new Set([...FREE_POKEMON,...(p?.owned||STARTERS)])];
export const TYPES={electric:['Điện','#edb72e','⚡'],fire:['Lửa','#ee7752','🔥'],water:['Nước','#599fe1','💧'],grass:['Cỏ','#6dad69','🌿'],ghost:['Ma','#967bc5','👻'],dragon:['Rồng','#7a82d1','🐉'],normal:['Thường','#a79c8c','✦'],fighting:['Giác đấu','#c16d66','🥊'],psychic:['Siêu linh','#d278a3','🔮'],ground:['Đất','#b99b6b','⛰'],ice:['Băng','#78bfc3','❄'],fairy:['Tiên','#e18fbe','✿'],dark:['Bóng tối','#74738d','☾'],flying:['Bay','#86a9d9','🪽']};
export const EFFECTS={burn:'🔥 Burn: 6 HP after each of 3 actions',poison:'☁ Poison: 8 HP after each of 3 actions',chill:'❄ Chill: 20% less damage for 2 actions',drain:'🌿 Restore half the damage dealt',heal:'💚 Restore 30% of maximum HP',focus:'✨ Next hit deals 25% more damage',pierce:'💥 This move passes through Guard'};
const m=(name,type,power,pp=10,accuracy=100,effect='',chance=100)=>({name,type,power,pp,accuracy,effect,chance});
const effectFor={fire:'burn',grass:'drain',ghost:'poison',ice:'chill',fighting:'pierce',fairy:'drain',dark:'poison'};
const effectChance=effect=>['burn','poison','chill'].includes(effect)?30:100;
const mon=(id,name,type,hp,attack,defense,speed,names,coverage,special='focus')=>{
 const effect=effectFor[type]||'';
 return {id,name,type,hp,attack,defense,speed,moves:[m(names[0],type,65,10,100,effect,effectChance(effect)),m(names[1],coverage,50,15),m(names[2],type,85,5,85),m(names[3],type,0,4,100,special)]};
};
export const ROSTER=[
 mon(25,'Pikachu','electric',120,56,44,90,['Thunderbolt','Quick Attack','Thunder','Charge'],'normal'),
 mon(133,'Eevee','normal',130,55,50,65,['Swift','Double Kick','Last Resort','Wish'],'fighting','heal'),
 mon(1,'Bulbasaur','grass',125,55,53,60,['Giga Drain','Tackle','Seed Burst','Synthesis'],'normal','heal'),
 mon(4,'Charmander','fire',120,57,45,75,['Ember','Dragon Breath','Flame Burst','Sunny Spark'],'dragon'),
 mon(7,'Squirtle','water',140,53,63,55,['Water Pulse','Ice Shard','Bubble Blast','Shell Focus'],'ice'),
 mon(39,'Jigglypuff','fairy',165,52,43,40,['Draining Kiss','Swift','Moonblast','Sweet Wish'],'normal','heal'),
 mon(54,'Psyduck','water',135,57,52,65,['Water Pulse','Confusion','Surf','Calm Focus'],'psychic'),
 mon(52,'Meowth','normal',120,56,45,95,['Pay Day','Bite','Fury Swipes','Lucky Focus'],'dark'),
 mon(37,'Vulpix','fire',125,55,50,80,['Ember','Extrasensory','Fire Spin','Warm Wish'],'psychic','heal'),
 mon(722,'Rowlet','grass',140,55,55,60,['Leaf Drain','Air Slash','Leaf Storm','Roost'],'flying','heal'),
 mon(447,'Riolu','fighting',125,60,48,85,['Force Palm','Quick Attack','Aura Burst','Inner Focus'],'normal'),
 mon(3,'Venusaur','grass',160,65,69,80,['Giga Drain','Earth Power','Solar Beam','Synthesis'],'ground','heal'),
 mon(6,'Charizard','fire',155,68,61,100,['Flamethrower','Dragon Claw','Fire Blast','Solar Focus'],'dragon'),
 mon(9,'Blastoise','water',165,64,78,78,['Surf','Ice Beam','Hydro Pump','Shell Focus'],'ice'),
 mon(59,'Arcanine','fire',165,68,62,95,['Flamethrower','Extreme Speed','Flare Burst','Morning Sun'],'normal','heal'),
 mon(197,'Umbreon','dark',175,59,78,65,['Dark Pulse','Quick Attack','Night Burst','Moonlight'],'normal','heal'),
 mon(700,'Sylveon','fairy',165,69,61,60,['Draining Kiss','Swift','Moonblast','Wish'],'normal','heal'),
 mon(94,'Gengar','ghost',130,76,50,110,['Shadow Ball','Psychic','Shadow Storm','Ghost Focus'],'psychic'),
 mon(778,'Mimikyu','ghost',140,65,65,96,['Shadow Claw','Play Rough','Phantom Burst','Disguise Focus'],'fairy'),
 mon(131,'Lapras','ice',195,62,63,60,['Ice Beam','Surf','Blizzard','Life Dew'],'water','heal'),
 mon(282,'Gardevoir','psychic',140,78,51,80,['Psychic','Moonblast','Psycho Burst','Healing Wish'],'fairy','heal'),
 mon(658,'Greninja','water',145,72,53,115,['Water Shuriken','Dark Pulse','Hydro Pump','Ninja Focus'],'dark'),
 mon(448,'Lucario','fighting',145,76,58,90,['Aura Sphere','Dragon Pulse','Close Combat','Aura Focus'],'dragon'),
 mon(143,'Snorlax','normal',220,68,59,30,['Body Slam','Earthquake','Giga Impact','Rest'],'ground','heal'),
 mon(727,'Incineroar','fire',180,72,70,60,['Flame Punch','Darkest Lariat','Flare Blitz','Champion Focus'],'dark'),
 mon(149,'Dragonite','dragon',175,74,69,80,['Dragon Pulse','Fire Punch','Outrage','Roost'],'fire','heal'),
 mon(373,'Salamence','dragon',170,77,63,100,['Dragon Claw','Air Slash','Dragon Meteor','Sky Focus'],'flying'),
 mon(445,'Garchomp','ground',175,76,68,102,['Earthquake','Dragon Claw','Earth Crush','Sand Focus'],'dragon'),
 mon(151,'Mew','psychic',165,72,66,100,['Psychic','Aura Sphere','Star Burst','Life Dew'],'fighting','heal'),
 mon(150,'Mewtwo','psychic',160,82,58,120,['Psystrike','Shadow Ball','Psychic Storm','Recover'],'ghost','heal'),
 mon(384,'Rayquaza','dragon',185,80,66,95,['Dragon Pulse','Air Slash','Dragon Ascent','Sky Focus'],'flying'),
 mon(383,'Groudon','ground',190,80,76,80,['Earthquake','Fire Punch','Precipice Blades','Land Focus'],'fire'),
 mon(382,'Kyogre','water',190,80,68,80,['Surf','Ice Beam','Origin Pulse','Ocean Focus'],'ice')
];
