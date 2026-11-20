import {test} from 'node:test';import assert from 'node:assert/strict';import {createHmac} from 'node:crypto';
import {generateKeyPair,SignJWT} from 'jose';
import {makeCredentialWorker,temporaryTurnAccess,verifyFirebaseToken} from './relay-server/credential-worker.mjs';
const env=()=>({ALLOWED_ORIGIN:'https://johnson4208.github.io',FIREBASE_PROJECT_ID:'little-lingua-ab674',TURN_HOST:'turn.classroom.example',TURN_SHARED_SECRET:'test-only-secret-with-more-than-32-characters',TURN_RATE_LIMITER:{limit:async()=>({success:true})}});
const request=(options={})=>new Request('https://access.example/credentials',{headers:{Origin:'https://johnson4208.github.io',Authorization:'Bearer test-token','CF-Connecting-IP':'192.0.2.1',...options.headers},method:options.method||'GET'});
test('relay access has UDP/TCP/TLS URLs, one-hour expiry and the coturn REST HMAC; the shared secret never leaves the worker',async()=>{
 const config=env(),data=await temporaryTurnAccess(config.TURN_HOST,config.TURN_SHARED_SECRET,1000000),server=data.iceServers[0];assert.equal(data.expiresAt,4600000);assert.ok(server.urls.includes('turns:turn.classroom.example:443?transport=tcp'));assert.equal(server.credential,createHmac('sha1',config.TURN_SHARED_SECRET).update(server.username).digest('base64'));assert.ok(!JSON.stringify(data).includes(config.TURN_SHARED_SECRET));
});
test('credential endpoint requires origin, verified login, configuration and both IP/user rate limits',async()=>{
 const worker=makeCredentialWorker(async token=>{if(token!=='test-token')throw Error('bad');return 'learner';});
 for(const [req,config,status]of [[request({headers:{Origin:'https://evil.example'}}),env(),403],[request({headers:{Authorization:''}}),env(),401],[request({headers:{Authorization:'Bearer invalid'}}),env(),401],[request(),{...env(),TURN_RATE_LIMITER:null},503],[request(),{...env(),TURN_RATE_LIMITER:{limit:async()=>({success:false})}},429],[request({method:'POST'}),env(),405]])assert.equal((await worker.fetch(req,config)).status,status);
 const seen=[],config=env();config.TURN_RATE_LIMITER.limit=async({key})=>{seen.push(key);return {success:true};};const response=await worker.fetch(request(),config);assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(response.headers.get('Access-Control-Allow-Origin'),config.ALLOWED_ORIGIN);assert.deepEqual(seen,['ip:192.0.2.1','user:learner']);assert.ok((await response.json()).iceServers[0].credential);
 assert.equal((await worker.fetch(request({method:'OPTIONS'}),env())).status,204);
});
test('Firebase verification rejects wrong projects, expired tokens, future auth_time and anonymous users',async()=>{
 const {privateKey,publicKey}=await generateKeyPair('RS256'),project='little-lingua-ab674';
 const sign=(extra={},aud=project,exp='1h')=>new SignJWT({auth_time:Math.floor(Date.now()/1000)-5,...extra}).setProtectedHeader({alg:'RS256'}).setSubject('registered-user').setIssuer('https://securetoken.google.com/'+project).setAudience(aud).setIssuedAt().setExpirationTime(exp).sign(privateKey);
 assert.equal(await verifyFirebaseToken(await sign(),project,publicKey),'registered-user');
 for(const token of [await sign({},'another-project'),await sign({},project,'-1h'),await sign({auth_time:Math.floor(Date.now()/1000)+60}),await sign({firebase:{sign_in_provider:'anonymous'}})])await assert.rejects(verifyFirebaseToken(token,project,publicKey));
});
