// Deploy separately from GitHub Pages. TURN_SHARED_SECRET must be a Worker secret.
import {createRemoteJWKSet,jwtVerify} from 'jose';
const keys=createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
export async function verifyFirebaseToken(token,project,keySet=keys){
 if(typeof project!=='string'||!/^[-a-z0-9]+$/.test(project))throw Error('Invalid project');
 const {payload}=await jwtVerify(token,keySet,{issuer:'https://securetoken.google.com/'+project,audience:project,algorithms:['RS256'],requiredClaims:['sub','exp','iat','auth_time'],maxTokenAge:'2h',clockTolerance:5});
 if(typeof payload.sub!=='string'||!payload.sub||payload.sub.length>128||!Number.isInteger(payload.auth_time)||payload.auth_time>Date.now()/1000+5||payload.firebase?.sign_in_provider==='anonymous')throw Error('Invalid user');
 return payload.sub;
}
export async function temporaryTurnAccess(host,secret,now=Date.now()){
 if(typeof host!=='string'||!/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(host)||typeof secret!=='string'||secret.length<32)throw Error('Relay not configured');
 const expiresAt=Math.floor(now/1000)*1000+3600000,username=`${Math.floor(expiresAt/1000)}:${crypto.randomUUID()}`;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-1'},false,['sign']);
 const signature=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(username))),credential=btoa(String.fromCharCode(...signature));
 return {iceServers:[{urls:['turn:'+host+':3478?transport=udp','turn:'+host+':3478?transport=tcp','turns:'+host+':443?transport=tcp'],username,credential}],expiresAt};
}
export function makeCredentialWorker(verify=verifyFirebaseToken){return {async fetch(request,env){
 const origin=request.headers.get('Origin'),allowed=env.ALLOWED_ORIGIN||'https://johnson4208.github.io';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 const reply=(body,status)=>new Response(JSON.stringify(body),{status,headers});
 if(origin!==allowed)return reply({error:'Origin not allowed'},403);
 headers['Access-Control-Allow-Origin']=allowed;
 if(new URL(request.url).pathname!=='/credentials')return reply({error:'Not found'},404);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Authorization','Access-Control-Max-Age':'600'}});
 if(request.method!=='GET')return reply({error:'Method not allowed'},405);
 if(!env.TURN_RATE_LIMITER||!env.TURN_SHARED_SECRET||!env.TURN_HOST||!env.FIREBASE_PROJECT_ID)return reply({error:'Relay service is not configured'},503);
 try{if(!(await env.TURN_RATE_LIMITER.limit({key:'ip:'+(request.headers.get('CF-Connecting-IP')||'unknown')})).success)return reply({error:'Try again later'},429);}catch{return reply({error:'Rate limiter unavailable'},503);}
 const auth=request.headers.get('Authorization')||'';if(!/^Bearer [A-Za-z0-9._-]+$/.test(auth)||auth.length>16000)return reply({error:'Sign in required'},401);
 let uid;try{uid=await verify(auth.slice(7),env.FIREBASE_PROJECT_ID);}catch{return reply({error:'Invalid or expired sign-in'},401);}
 try{if(!(await env.TURN_RATE_LIMITER.limit({key:'user:'+uid})).success)return reply({error:'Try again later'},429);return reply(await temporaryTurnAccess(env.TURN_HOST,env.TURN_SHARED_SECRET),200);}catch{return reply({error:'Relay service unavailable'},503);}
 }};}
export default makeCredentialWorker();
