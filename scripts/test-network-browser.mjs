// Real PeerJS + RTCDataChannels on a local signaling server; no external relay is claimed here.
import {chromium} from 'playwright';
import chromiumBinary from '@sparticuz/chromium';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {networkInterfaces} from 'node:os';
let networkAvailable;try{networkAvailable=Object.values(networkInterfaces()).flat().some(address=>address&&!address.internal);}catch(error){if(process.env.CI)throw error;networkAvailable=false;}
if(!networkAvailable){if(process.env.CI)throw Error('RTC test requires a non-loopback network interface');console.log('SKIP real RTC browser test: no non-loopback network interface; run on CI or a networked host.');process.exit(0);}
import assert from 'node:assert/strict';
const root=process.cwd();
const signal=spawn(process.execPath,['--input-type=module','-e',"import {PeerServer} from 'peer';PeerServer({host:'127.0.0.1',port:0,path:'/peerjs',allow_discovery:false},server=>console.log('SIGNAL_PORT='+server.address().port));"],{cwd:root,stdio:['ignore','pipe','pipe']});
let browser,server,first,second;
try{
 const signalPort=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Local signaling did not start')),10000);let output='';signal.stdout.on('data',chunk=>{output+=chunk;const match=/SIGNAL_PORT=(\d+)/.exec(output);if(match){clearTimeout(timer);resolve(Number(match[1]));}});signal.on('exit',code=>{clearTimeout(timer);reject(Error('Signaling exited '+code));});});
 const options={host:'127.0.0.1',port:signalPort,path:'/peerjs',secure:false,config:{iceServers:[{urls:'stun:127.0.0.1:9'}]},retryDelayMs:100,handshakeTimeoutMs:10000};
 const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/test-room'){const name=url.searchParams.get('name')==='Host'?'Host':'Guest';res.setHeader('Content-Type','text/html');res.end(`<!doctype html><script>window.LinguaAccount=new EventTarget();Object.assign(window.LinguaAccount,{user:null,profile:{nickname:${JSON.stringify(name)},owned:[25,133,3],uiLanguage:'en'}});</script><iframe title="Game" src="/duel.html" style="width:1400px;height:1000px;border:0"></iframe>`);return;}
  if(url.pathname==='/config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.POKEMON_NETWORK='+JSON.stringify(options));return;}
  if(url.pathname==='/firebase-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.LINGUA_FIREBASE=null;');return;}
  if(/\.(?:png|gif|webp|svg)$/.test(url.pathname)){res.setHeader('Content-Type','image/png');res.end(pixel);return;}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep))throw Error('path');let content=await readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',ext==='.html'?'text/html':ext==='.css'?'text/css':'text/javascript');
  if(url.pathname==='/duel.html')content=content.toString().replace(/<link[^>]*href="https:\/\/fonts[^>]*>/g,'');
  if(url.pathname==='/app.mjs')content=content.toString()+'\nwindow.__testRoom=room;';
  res.end(content);
 }catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const systemChrome=['/usr/bin/google-chrome','/usr/bin/chromium'].find(existsSync);
 browser=await chromium.launch({executablePath:systemChrome||await chromiumBinary.executablePath(),args:systemChrome?['--no-sandbox','--disable-dev-shm-usage','--disable-features=WebRtcHideLocalIpsWithMdns']:[...chromiumBinary.args.filter(arg=>arg!=='--single-process'),'--no-sandbox','--disable-features=WebRtcHideLocalIpsWithMdns','--allow-loopback-in-peer-connection'],headless:true});const errors=[];
 const a=await browser.newContext({viewport:{width:1440,height:1100}}),b=await browser.newContext({viewport:{width:1440,height:1100}});first=await a.newPage();second=await b.newPage();for(const page of [first,second])page.on('pageerror',error=>errors.push(error.message));
 await first.goto(base+'/test-room?name=Host');await second.goto(base+'/test-room?name=Guest');const host=first.frameLocator('iframe'),guest=second.frameLocator('iframe');
 await host.locator('#create-room').click();await host.locator('#network-status').filter({hasText:'Room open'}).waitFor({timeout:15000});const code=await host.locator('#room-display').textContent();await guest.locator('#room-code').fill(code);await guest.locator('#join-room').click();
 await host.locator('#network-status').filter({hasText:'Connected'}).waitFor({timeout:20000});await guest.locator('#network-status').filter({hasText:'Connected'}).waitFor({timeout:20000});
 console.log('Connected real channels');await host.locator('#ready').click();await guest.locator('#ready').click();await host.locator('#battle').waitFor({state:'visible'});await guest.locator('#battle').waitFor({state:'visible'});
 const turn=await host.locator('body').evaluate(()=>window.__testRoom.battle.turn);await (turn===0?host:guest).locator('#moves button:not([disabled])').first().click();await guest.locator('#round').filter({hasText:'LƯỢT 2'}).waitFor();
 const token=await guest.locator('body').evaluate(()=>window.__testRoom.token),oldBattle=await host.locator('body').evaluate(()=>JSON.stringify(window.__testRoom.battle));
 await guest.locator('body').evaluate(()=>window.__testRoom.conn.close());await guest.locator('#connection-details').filter({hasText:'attempt 1/3'}).waitFor({timeout:20000});
 await guest.locator('body').evaluate(()=>window.__testRoom.connected).then(async connected=>{if(!connected)await guest.locator('#network-status').filter({hasText:'Connected'}).waitFor({timeout:20000});});
 assert.equal(await guest.locator('body').evaluate(()=>window.__testRoom.token),token);assert.equal(await guest.locator('body').evaluate(()=>JSON.stringify(window.__testRoom.battle)),oldBattle);assert.equal(await host.locator('#room-display').textContent(),code);
 assert.deepEqual(errors,[]);console.log('PASS real browser networking: two clients, actual RTCDataChannel, ready, battle action, automatic reconnect with same code/token/state');
}catch(error){for(const [name,page]of [['host',first],['guest',second]])if(page)try{console.error(name+':',await page.frameLocator('iframe').locator('#network-status').textContent(),await page.frameLocator('iframe').locator('#network-error').textContent(),await page.frameLocator('iframe').locator('body').evaluate(()=>({host:window.__testRoom?.host,phase:window.__testRoom?.connection?.phase,ice:window.__testRoom?.conn?.peerConnection?.iceConnectionState,signaling:window.__testRoom?.conn?.peerConnection?.signalingState}))); }catch{}throw error;}
finally{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));signal.kill('SIGTERM');}
