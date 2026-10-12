"""Pack selected game VFX into nearest-neighbour runtime atlases. --sources points to extracted packs."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
import re,json,argparse
p=argparse.ArgumentParser();p.add_argument('--sources',default='/tmp/new-vfx');a=p.parse_args();root=Path(a.sources);out=Path(__file__).resolve().parent.parent
seq=[]
def natural(p):return [int(s) if s.isdigit() else s for s in re.split(r'(\d+)',str(p))]
def add(key,files,source,tint=None):
 frames=[Image.open(f).convert('RGBA') for f in sorted(files,key=natural)];seq.append((key,frames,source,tint))
mega={'sparkCore':'Lightning/Spark Burst','skyThunder':'Lightning/Thunder Strike','chainArc':'Lightning/Chain Lightning','stormField':'Lightning/Static Field','shockNova':'Lightning/Shock Nova','plasmaBall':'Lightning/Ball Lightning','fireCore':'Fire/Explosion','fireMeteor':'Fire/Meteor Strike','flameBlade':'Fire/Flame Slash','burningLand':'Fire/Burning Ground','moltenCore':'Fire/Molten Core','aquaWave':'Water/Tidal Wave','geyser':'Water/Geyser','aquaOrb':'Water/Water Orb','aquaBurst':'Water/Bubble Burst','iceSpire':'Ice/Ice Spikes','iceNova':'Ice/Frost Nova','iceBreak':'Ice/Ice Shatter','iceLance':'Ice/Ice Lance','darkNova':'Dark/Doom Nova','voidNova':'Dark/Void Nova','shadowBlade':'Dark/Shadow Slash','soulDrain':'Dark/Soul Drain','ghostWisps':'Dark/Wraith Wisps','runeGate':'Arcane/Rune Circle','arcaneNova':'Arcane/Arcane Nova','vortex':'Arcane/Eldritch Vortex','portalGate':'Summon/Portal Open','spiritRise':'Summon/Spirit Rise','stoneSpire':'Earth/Stone Spikes','groundSlam':'Earth/Ground Slam','meteorImpact':'Earth/Meteor Impact','quakeNova':'Earth/Quake Nova','thornBurst':'Nature/Thorn Burst','vineWhip':'Nature/Vine Whip','leafCyclone':'Nature/Leaf Storm','petalBloom':'Nature/Petal Bloom','tornado':'Wind/Tornado','sonicBoom':'Wind/Sonic Boom','divineNova':'Holy/Divine Nova','holyPillar':'Holy/Smite','holyCircle':'Holy/Sacred Circle','healPulse':'Heal/Heal Pulse','lifeBloom':'Heal/Life Bloom','guardShell':'Buff/Barrier','heroSurge':'Buff/Heroic Surge','heavyCleave':'Melee/Heavy Cleave','criticalHit':'Melee/Critical Hit','crossCut':'Melee/Cross Slash','toxicPool':'Poison/Toxic Pool','acidBlast':'Poison/Acid Burst'}
pal={'Lightning':'#ffe566','Fire':'#ff7940','Water':'#55bfff','Ice':'#93eeff','Dark':'#b18af5','Arcane':'#d49bff','Summon':'#bf95ff','Earth':'#d5a96a','Nature':'#9cde65','Wind':'#b5f4dc','Holy':'#ffe5a3','Heal':'#8af8ad','Buff':'#a6cffc','Melee':'#ffce92','Poison':'#b3de67'}
for key,path in mega.items():add(key,(root/'Mega Pack VFX RPG Lite'/'Frames'/path).glob('*.png'),'Mega Pack VFX RPG Lite',pal[path.split('/')[0]])
for key,path in {'tripleClaw':'Slashes/Triple Claw','spinCut':'Slashes/Spin Slash','fireRibbon':'Fire/Flamethrower','phoenix':'Fire/Phoenix Flare','tesla':'Lightning/Tesla Arc','chargeUp':'Lightning/Charge Up','iceHit':'Hit Sparks/Ice Hit','multiHit':'Hit Sparks/Multi Hit','pierceHit':'Hit Sparks/Pierce Spark','waterMist':'Ambient/Waterfall Mist','fallingLeaves':'Ambient/Falling Leaves','snowfall':'Ambient/Snow','poisonCloud':'Magic/Poison Cloud','plasmaBurst':'Explosions/Plasma Blast'}.items():add(key,(root/'Pixel VFX Essentials (1)'/'Frames'/path).glob('*.png'),'Pixel VFX Essentials')
combat=root/'pixel_combat_vfx_free_sample_2026-10-07'/'pixel_combat_vfx_free_sample'
for name in ['lightning','water_lash','fireball','mud_smash','blight_rain','hit_spark']:add('combat_'+name,(combat/name/'frames/1x').glob('*.png'),'Pixel Combat VFX Free Sample')
for key,num in [('nebulaBurst',12),('magicHit',5),('sunFlare',16),('phantomFlare',14),('vortexColor',13),('blueFire',3)]:
 f=next((root/'Free Pixel Effects Pack (1)').glob(str(num)+'_*'));im=Image.open(f).convert('RGBA');frames=[im.crop((x,y,x+100,y+100)) for y in range(0,im.height,100) for x in range(0,im.width,100)];seq.append((key,frames,'Free Pixel Effects Pack',None))
# Golden variants preserve the pixel grid while matching Pikachu's palette.
for new,old in [('goldTesla','tesla'),('goldWave','warped_waveform'),('goldPlasma','plasmaBurst')]:
 if old=='warped_waveform':continue
 row=next(row for row in seq if row[0]==old);seq.append((new,row[1],row[2],'#ffe566'))
for i,color in enumerate(['blue','red','purple','green']):
 f=root/'impact-effects_20260409_1'/'impact-effects'/'03'/color/'spritesheet.png';im=Image.open(f).convert('RGBA');seq.append(('impact_'+color,[im.crop((x,y,x+128,y+128)) for y in range(0,384,128) for x in range(0,512,128)],'Impact Effects',None))
warped=root/'Warped shooting fx files'/'Warped shooting fx files'/'Assets/Pixelart'
for name in ['waveform','charged','crossed','Bolt','spark','Pulse']:add('warped_'+name.lower(),(warped/name/'sprites').glob('*.png'),'Warped Shooting FX')
row=next(row for row in seq if row[0]=='warped_waveform');seq.append(('goldWave',row[1],row[2],'#ffe566'))
for i in range(1,4):add('colorRing'+str(i),(root/'Effects Pack 12'/str(i)).glob('*.png'),'Effects Pack 12')
vol=root/'pixel-vfx-vol1_LITE_free'/'PixelVFX_Vol1_Lite/vfx/32px/frames'
for name in ['shield_bubble_arcane','heal_sparkles_nature','explosion_small_fire','slash_arc_steel']:add('lite_'+name,(vol/name).glob('*.png'),'Pixel VFX Vol1 Lite')
meta={};tile=96;per=16;pages=[];thumbs=[]
for i,(key,frames,source,tint) in enumerate(seq):
 if not frames:raise ValueError(key+' has no frames')
 boxes=[im.getchannel('A').getbbox() for im in frames];boxes=[b for b in boxes if b]
 if not boxes:raise ValueError(key+' is empty')
 box=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes));scale=min(88/(box[2]-box[0]),88/(box[3]-box[1]));size=(max(1,round((box[2]-box[0])*scale)),max(1,round((box[3]-box[1])*scale)))
 page=i//per;row=i%per
 if row==0:pages.append(Image.new('RGBA',(tile*16,tile*per)))
 normalized=[]
 for j in range(16):
  im=frames[round(j*(len(frames)-1)/15)].crop(box).resize(size,Image.Resampling.NEAREST)
  if tint:
   rgb=Image.new('RGBA',im.size,tint);rgb.putalpha(im.getchannel('A'));im=Image.blend(im,rgb,.32)
   if key.startswith('gold'):
    from PIL import ImageOps
    alpha=im.getchannel('A');im=ImageOps.colorize(im.convert('L'),'#b57516','#fff4ae').convert('RGBA');im.putalpha(alpha)
  cell=Image.new('RGBA',(tile,tile));cell.alpha_composite(im,((tile-im.width)//2,(tile-im.height)//2));pages[page].alpha_composite(cell,(j*tile,row*tile));normalized.append(cell)
 meta[key]={'file':f'vfx-runtime-{page}.png','row':row,'source':source,'originalFrames':len(frames)}
 best=max(normalized,key=lambda im:sum(im.getchannel('A').getdata()));thumbs.append((key,best))
for i,im in enumerate(pages):im.quantize(colors=256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).save(out/f'vfx-runtime-{i}.png',optimize=True)
(out/'vfx-assets.mjs').write_text('// Selected, normalized sequences from all eight supplied packs.\nexport const VFX_ASSETS='+json.dumps(meta,separators=(',',':'))+';\nexport const VFX_TILE=96,VFX_FRAMES=16,VFX_PAGE_ROWS=16;\n')
contact=Image.new('RGB',(960,((len(thumbs)+7)//8)*125),'#26303e');d=ImageDraw.Draw(contact)
for i,(key,im) in enumerate(thumbs):x=i%8*120;y=i//8*125;contact.paste(im,(x+12,y),im);d.text((x+4,y+98),key[:19],fill='white')
contact.save('/tmp/vfx-selected.jpg');print('Packed',len(seq),'sequences across',len(pages),'pages')
