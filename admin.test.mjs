import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAdminService,adjustedWallet} from './functions/admin-core.mjs';
import {freshProfile,reduceProfile} from './profile-model.mjs';
function fixture(){
 const records=new Map([['learners/learner',freshProfile('Learner')]]),users=new Map([['admin',{uid:'admin',email:'admin@example.com',customClaims:{admin:true}}],['learner',{uid:'learner',email:'learner@example.com'}]]);
 const snapshot=key=>({exists:records.has(key),data:()=>structuredClone(records.get(key))});
 const ref=key=>({key,get:async()=>snapshot(key),delete:async()=>records.delete(key)});
 let queue=Promise.resolve();
 const db={collection:name=>({doc:id=>ref(`${name}/${id}`)}),runTransaction:fn=>{const job=queue.catch(()=>{}).then(async()=>{const writes=[];const result=await fn({get:async r=>snapshot(r.key),set:(r,p)=>writes.push([r.key,p]),update:(r,p)=>writes.push([r.key,{...records.get(r.key),...p}])});for(const [k,p] of writes)records.set(k,structuredClone(p));return result;});queue=job;return job;}};
 const auth={getUser:async uid=>{if(!users.has(uid))throw Object.assign(Error('missing'),{code:'auth/user-not-found'});return users.get(uid);},getUserByEmail:async email=>{const u=[...users.values()].find(x=>x.email===email);if(!u)throw Object.assign(Error('missing'),{code:'auth/user-not-found'});return u;}};
 let time=100000;const service=createAdminService({auth,db,code:()=> 'test-secret',now:()=>time,token:()=> 'a'.repeat(64)});
 const call=(data,uid='admin',claims={admin:true,auth_time:1})=>service({auth:{uid,token:claims},data});
 const unlock=async()=> (await call({action:'unlock',code:'test-secret'})).sessionToken;
 return {records,users,call,unlock,advance:ms=>time+=ms};
}
const setRequest=(sessionToken,extra={})=>({action:'setStars',uid:'learner',expectedStars:0,stars:50,reason:'Learning event reward',requestId:'request-1234567890',sessionToken,...extra});
test('code cannot grant admin; unauthenticated, normal, removed and revoked admins are rejected',async()=>{
 const f=fixture();await assert.rejects(f.call({action:'unlock',code:'test-secret'},'learner'),{code:'permission-denied'});
 await assert.rejects(f.call({action:'unlock',code:'test-secret'},'admin',{}),{code:'permission-denied'});
 await f.unlock();f.users.get('admin').customClaims={};await assert.rejects(f.call({action:'lookup',sessionToken:'a'.repeat(64),email:'learner@example.com'}),{code:'permission-denied'});
 f.users.get('admin').customClaims={admin:true};f.users.get('admin').tokensValidAfterTime=new Date(2000).toISOString();await assert.rejects(f.unlock(),{code:'permission-denied'});
 const service=createAdminService({auth:{},db:{},code:()=>''});await assert.rejects(service({data:{}}),{code:'unauthenticated'});
});
test('wrong code is rate limited and sessions expire or lock',async()=>{
 const f=fixture();for(let i=0;i<5;i++)await assert.rejects(f.call({action:'unlock',code:'wrong'}),{code:'permission-denied'});
 await assert.rejects(f.unlock(),{code:'resource-exhausted'});f.advance(15*60_000+1);const token=await f.unlock();
 await assert.rejects(f.call({action:'lookup',email:'learner@example.com',sessionToken:'b'.repeat(64)}),{code:'permission-denied'});
 await f.call({action:'lock',sessionToken:token});await assert.rejects(f.call(setRequest(token)),{code:'permission-denied'});
 const token2=await f.unlock();f.advance(15*60_000);await assert.rejects(f.call(setRequest(token2)),{code:'permission-denied'});
});
test('email lookup returns only matched account data and missing email is explicit',async()=>{
 const f=fixture(),sessionToken=await f.unlock();assert.deepEqual(await f.call({action:'lookup',sessionToken,email:'learner@example.com'}),{uid:'learner',email:'learner@example.com',nickname:'Learner',stars:0});
 await assert.rejects(f.call({action:'lookup',sessionToken,email:'unknown@example.com'}),{code:'not-found'});
});
test('adjustment is atomic, audited, idempotent and preserves subsequent reward and purchase arithmetic',async()=>{
 const f=fixture(),token=await f.unlock(),request=setRequest(token);await f.call(request);assert.deepEqual(await f.call(request),{stars:50,receipt:request.requestId});
 let p=f.records.get('learners/learner');assert.equal(p.adminStarAdjustment,50);assert.equal(p.totalEarned,0);assert.deepEqual(p.completed,[]);
 assert.equal(f.records.get(`adminStarAudit/admin_${request.requestId}`).before,0);
 p=reduceProfile(p,{type:'reward',key:'learn:vi:hello',day:'2026-10-16'});p=reduceProfile(p,{type:'buy',id:6,expectedStars:51});assert.equal(p.stars,0);assert.equal(p.totalEarned-p.totalSpent+p.adminStarAdjustment,0);
 f.records.set('learners/learner',p);await f.call(setRequest(token,{stars:10,requestId:'request-abcdefghij'}));p=f.records.get('learners/learner');assert.equal(p.stars,10);assert.equal(p.totalEarned,1);assert.equal(p.totalSpent,51);assert.equal(p.adminStarAdjustment,60);
});
test('stale writes and reused receipt payloads cannot overwrite another change',async()=>{
 const f=fixture(),token=await f.unlock();await f.call(setRequest(token));await assert.rejects(f.call(setRequest(token,{stars:60,requestId:'another-request-123'})),{code:'aborted'});
 await assert.rejects(f.call(setRequest(token,{stars:60})),{code:'already-exists'});assert.equal(f.records.get('learners/learner').stars,50);
});
test('negative, fractional, enormous balances and corrupt wallets are rejected',()=>{
 for(const value of [-1,1.5,1000001,NaN,'50'])assert.throws(()=>adjustedWallet(freshProfile(),value),{code:'invalid-argument'});
 assert.throws(()=>adjustedWallet({...freshProfile(),stars:1},50),{code:'failed-precondition'});
 assert.deepEqual(adjustedWallet({...freshProfile(),stars:20,adminStarAdjustment:20},0),{stars:0,adminStarAdjustment:0});
});
