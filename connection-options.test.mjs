import {test} from 'node:test';import assert from 'node:assert/strict';
import {settings,routeConfig,routeName,fetchTurnCredentials,cleanIceServers} from './connection-options.mjs';
const privateServers=[{urls:['turn:relay.example:3478?transport=udp','turn:relay.example:3478?transport=tcp','turns:relay.example:443?transport=tcp'],username:'temporary-user',credential:'temporary-password'}];
test('automatic fallback selects all routes, then relay, then TCP/TLS without inventing relay support',()=>{
 const rtc={iceServers:privateServers};assert.equal(routeConfig(rtc,0).iceTransportPolicy,'all');assert.equal(routeConfig(rtc,1).iceTransportPolicy,'relay');assert.deepEqual(routeConfig(rtc,2).iceServers[0].urls,privateServers[0].urls.slice(1));assert.equal(routeName(rtc,2),'Relay TCP/TLS');
 const publicSettings=settings();assert.equal(routeName(publicSettings.rtc,2),'Relay');assert.ok(!routeConfig(publicSettings.rtc,2).iceServers[0].urls.some(url=>url.startsWith('turns:')));assert.equal(settings({maxConnectionAttempts:100}).maxAttempts,4);
});
test('private credentials use HTTPS, send only an ID token in headers, omit cookies and do not cache',async()=>{
 let seen;const result=await fetchTurnCredentials({url:'https://access.example/credentials',getToken:async()=> 'signed-token',fetcher:async(url,options)=>{seen={url,options};return new Response(JSON.stringify({iceServers:privateServers,expiresAt:Date.now()+3600000}));}});
 assert.equal(seen.options.headers.Authorization,'Bearer signed-token');assert.equal(seen.options.credentials,'omit');assert.equal(seen.options.cache,'no-store');assert.deepEqual(result.iceServers,privateServers);
});
test('missing login, malformed endpoint, invalid relay payload and expired keys fail safely',async()=>{
 let calls=0;const fetcher=async()=>{calls++;return new Response(JSON.stringify({iceServers:privateServers,expiresAt:1}));};
 await assert.rejects(fetchTurnCredentials({url:'http://access.example',getToken:async()=> 'x',fetcher}),/HTTPS/);await assert.rejects(fetchTurnCredentials({url:'https://key:secret@access.example',getToken:async()=> 'x',fetcher}),/HTTPS/);
 await assert.rejects(fetchTurnCredentials({url:'https://access.example',fetcher}),/Sign in/);assert.equal(calls,0);
 await assert.rejects(fetchTurnCredentials({url:'https://access.example',getToken:async()=> 'x',fetcher}),/expired/);
 for(const input of [[{urls:'https://web.example'}],[{urls:'turn:relay.example'}],[{urls:'turns:secret@relay.example',username:'u',credential:'p'}]])assert.throws(()=>cleanIceServers(input));
});
