// Public defaults match the bundled PeerJS client. Private relay keys come from an HTTPS broker.
export const PUBLIC_ICE_SERVERS=[{urls:'stun:stun.l.google.com:19302'},{urls:['turn:eu-0.turn.peerjs.com:3478','turn:us-0.turn.peerjs.com:3478'],username:'peerjs',credential:'peerjsp'}];
const bound=(value,fallback,min,max)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
export function cleanIceServers(input){
 if(!Array.isArray(input)||!input.length||input.length>12)throw Error('Invalid relay server configuration.');
 return input.map(server=>{
  const urls=typeof server.urls==='string'?[server.urls]:server.urls;
  if(!Array.isArray(urls)||!urls.length||urls.length>12||urls.some(url=>typeof url!=='string'||url.length>500||!/^(?:stun|stuns|turn|turns):[^\s@#]+$/.test(url)))throw Error('Invalid relay URL.');
  const item={urls:[...urls]};
  if(urls.some(url=>/^turns?:/.test(url))){if(typeof server.username!=='string'||!server.username||server.username.length>500||typeof server.credential!=='string'||!server.credential||server.credential.length>1000)throw Error('The relay did not provide valid temporary credentials.');item.username=server.username;item.credential=server.credential;}
  return item;
 });
}
export function settings(config={}){
 const peer={};for(const key of ['host','port','path','secure','key','pingInterval','debug'])if(config[key]!==undefined)peer[key]=config[key];
 const ice=cleanIceServers(config.config?.iceServers||PUBLIC_ICE_SERVERS);
 return {peer,rtc:{...config.config,iceServers:ice},customIce:!!config.config?.iceServers,credentialsUrl:config.turnCredentialsUrl||'',requireAuth:config.turnRequireAuth!==false,maxAttempts:bound(config.maxConnectionAttempts,3,1,4),handshakeMs:bound(config.handshakeTimeoutMs,25000,5000,45000),signalingMs:bound(config.signalingTimeoutMs,20000,5000,45000),retryMs:bound(config.retryDelayMs,1200,100,5000),graceMs:bound(config.disconnectGraceMs,5000,1000,12000),credentialMs:bound(config.credentialsTimeoutMs,8000,1000,15000)};
}
export function routeConfig(rtc,attempt=0){
 const servers=cleanIceServers(rtc.iceServers),relay=servers.filter(s=>s.urls.some(url=>/^turns?:/.test(url)));
 if(!attempt||!relay.length)return {...rtc,iceServers:servers,iceTransportPolicy:'all'};
 const tcp=relay.map(s=>({...s,urls:s.urls.filter(url=>/^turns:/.test(url)||/transport=tcp(?:&|$)/.test(url))})).filter(s=>s.urls.length);
 return {...rtc,iceServers:attempt>=2&&tcp.length?tcp:relay,iceTransportPolicy:'relay'};
}
export function routeName(rtc,attempt){const cfg=routeConfig(rtc,attempt);return cfg.iceTransportPolicy==='all'?'Automatic':attempt>=2&&cfg.iceServers.every(s=>s.urls.every(url=>/^turns:/.test(url)||url.includes('transport=tcp')))?'Relay TCP/TLS':'Relay';}
export async function fetchTurnCredentials({url,getToken,requireAuth=true,fetcher=globalThis.fetch,signal,now=Date.now()}){
 let endpoint;try{endpoint=new URL(url);}catch{throw Error('The private relay endpoint is invalid.');}
 if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||endpoint.hash||endpoint.search)throw Error('The private relay endpoint must use HTTPS without embedded secrets.');
 const headers={Accept:'application/json'};
 if(requireAuth){let token;try{token=await getToken?.();}catch{throw Error('Could not refresh sign-in for the private relay.');}if(!token)throw Error('Sign in to use the private relay.');headers.Authorization='Bearer '+token;}
 const response=await fetcher(endpoint.href,{headers,signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
 if(!response.ok)throw Error(response.status===401?'Sign in again to use the private relay.':response.status===429?'The private relay is busy. Wait a moment and retry.':'The private relay could not provide temporary access.');
 const text=await response.text();if(text.length>65536)throw Error('The relay response is too large.');let data;try{data=JSON.parse(text);}catch{throw Error('The relay response is invalid.');}
 const servers=cleanIceServers(data.iceServers),expiresAt=Number(data.expiresAt);
 if(!servers.some(s=>s.urls.some(url=>/^turns?:/.test(url)))||!Number.isFinite(expiresAt)||expiresAt<now+120000||expiresAt>now+86400000)throw Error('The relay credentials are missing or expired.');
 return {iceServers:servers,expiresAt};
}
