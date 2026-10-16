// npm install --prefix /tmp/lingua-admin-verify @firebase/rules-unit-testing firebase
// FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test admin-rules.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {freshProfile,reduceProfile} from './profile-model.mjs';
import {AdminStore} from './admin-store.mjs';
import {ADMIN_UID,ADMIN_EMAIL} from './admin-model.mjs';
const enabled=Boolean(process.env.FIRESTORE_EMULATOR_HOST);
test('free administrator permissions and transactions enforced by Firestore',{skip:!enabled},async t=>{
 const modules=process.env.ADMIN_TEST_MODULES||'/tmp/lingua-admin-verify/node_modules',require=createRequire(`${modules}/package.json`);
 const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing'),api=require('firebase/firestore');
 const {doc,setDoc,getDoc,getDocs,updateDoc,deleteDoc,collection,query,where,writeBatch,serverTimestamp,Timestamp}=api;
 const env=await initializeTestEnvironment({projectId:'demo-lingua-admin',firestore:{rules:await readFile(new URL('./firestore.rules',import.meta.url),'utf8')}});
 const learner=()=>env.authenticatedContext('learner',{email:'Learner@Example.com'}).firestore();
 const admin=()=>env.authenticatedContext(ADMIN_UID,{email:ADMIN_EMAIL}).firestore();
 const profile=()=>({...freshProfile('Learner'),email:'learner@example.com'});
 const makeStore=(db=admin())=>new AdminStore({db,dbApi:api,epoch:1,guest:false,profile:freshProfile('Admin'),user:{uid:ADMIN_UID,email:ADMIN_EMAIL,getIdToken:async()=>''}});
 async function prepare(){await env.clearFirestore();const db=learner();await setDoc(doc(db,'learners/learner'),profile());const store=makeStore();await store.check();const session=await store.unlock('admin2026');return {db,store,session,adminDb:store.account.db};}
 const request=(session,extra={})=>({uid:'learner',email:'learner@example.com',expectedStars:0,stars:50,reason:'Learning event reward',requestId:crypto.randomUUID(),sessionToken:session.sessionToken,...extra});
 const forgedBatch=(db,session,extra={})=>{const id=crypto.randomUUID(),batch=writeBatch(db);batch.update(doc(db,'learners/learner'),{stars:50,adminStarAdjustment:50,lastAdminAdjustment:id,...extra.profile});batch.set(doc(db,'adminStarAudit',id),{actorUid:ADMIN_UID,targetUid:'learner',targetEmail:'learner@example.com',before:0,after:50,reason:'Manual event reward',createdAt:serverTimestamp(),sessionKey:session.sessionToken,...extra.audit});return batch;};
 try{
 await t.test('knowing the code, email or admin claim cannot grant another UID access',async()=>{
  await env.clearFirestore();const normal=learner(),spoof=env.authenticatedContext('attacker',{email:ADMIN_EMAIL,admin:true}).firestore(),wrongEmail=env.authenticatedContext(ADMIN_UID,{email:'wrong@example.com',admin:true}).firestore(),anon=env.unauthenticatedContext().firestore();
  for(const db of [normal,spoof,wrongEmail,anon]){await assertFails(getDoc(doc(db,'adminSessions',ADMIN_UID)));await assertFails(setDoc(doc(db,'adminSessions',ADMIN_UID),{key:crypto.randomUUID(),startedAt:serverTimestamp()}));await assertFails(getDocs(query(collection(db,'learners'),where('email','==','learner@example.com'))));}
 });
 await t.test('email migration binds only the authenticated email and old profiles remain usable',async()=>{
  await env.clearFirestore();const db=learner(),ref=doc(db,'learners/learner');await assertSucceeds(setDoc(ref,freshProfile()));await assertSucceeds(updateDoc(ref,{email:'learner@example.com'}));await assertFails(updateDoc(ref,{email:ADMIN_EMAIL}));
  await assertFails(updateDoc(ref,{adminStarAdjustment:50,stars:50}));await assertFails(updateDoc(ref,{lastAdminAdjustment:crypto.randomUUID()}));
  await assertFails(setDoc(doc(env.authenticatedContext('other',{email:'other@example.com'}).firestore(),'learners/other'),{...freshProfile(),email:ADMIN_EMAIL}));
 });
 await t.test('check does not unlock, code unlock uses a server timestamp and signed-in users cannot read other profiles',async()=>{
  await env.clearFirestore();const db=admin(),store=makeStore(db);await store.check();await assertFails(getDocs(collection(db,'learners')));await assert.rejects(store.unlock('wrong'),/không đúng/);
  await assertFails(setDoc(doc(db,'adminSessions',ADMIN_UID),{key:crypto.randomUUID(),startedAt:Timestamp.fromMillis(Date.now()+900000)}));
  await store.unlock('admin2026');await assertSucceeds(getDocs(collection(db,'learners')));await assertFails(getDoc(doc(learner(),'learners/someone-else')));
 });
 await t.test('real client can look up email, atomically adjust stars, retry safely and keep learning/shop working',async()=>{
  const {db,store,session,adminDb}=await prepare(),target=await store.lookup(' LEARNER@EXAMPLE.COM ');assert.equal(target.uid,'learner');
  const r=request(session);await store.setStars(r);await store.setStars(r);let p=(await getDoc(doc(db,'learners/learner'))).data();assert.equal(p.stars,50);assert.equal(p.totalEarned,0);assert.equal(p.adminStarAdjustment,50);
  const audit=(await getDoc(doc(adminDb,'adminStarAudit',r.requestId))).data();assert.equal(audit.before,0);assert.equal(audit.after,50);
  p=reduceProfile(p,{type:'reward',key:'learn:vi:hello',day:'2026-10-16'});await assertSucceeds(setDoc(doc(db,'learners/learner'),p));p=reduceProfile(p,{type:'buy',id:6,expectedStars:51});await assertSucceeds(setDoc(doc(db,'learners/learner'),p));
  await store.setStars(request(session,{stars:20}));await store.setStars(request(session,{expectedStars:20,stars:5}));p=(await getDoc(doc(db,'learners/learner'))).data();assert.equal(p.stars,5);assert.equal(p.totalSpent,51);assert.equal(p.totalEarned,1);assert.equal(p.adminStarAdjustment,55);
 });
 await t.test('wallet changes require a matching immutable audit in the same atomic write',async()=>{
  const {adminDb,session}=await prepare();await assertFails(updateDoc(doc(adminDb,'learners/learner'),{stars:50,adminStarAdjustment:50,lastAdminAdjustment:crypto.randomUUID()}));
  for(const audit of [{before:1},{after:51},{targetEmail:ADMIN_EMAIL},{actorUid:'attacker'},{reason:'x'},{createdAt:Timestamp.fromMillis(0)},{sessionKey:crypto.randomUUID()}])await assertFails(forgedBatch(adminDb,session,{audit}).commit());
  await assertFails(forgedBatch(adminDb,session,{profile:{nickname:'Overwritten'}}).commit());
  await assertFails(forgedBatch(adminDb,session,{profile:{adminStarAdjustment:51}}).commit());
  await assertFails(setDoc(doc(adminDb,'adminStarAudit',crypto.randomUUID()),{actorUid:ADMIN_UID,targetUid:'learner',targetEmail:'learner@example.com',before:0,after:50,reason:'Unattached audit',createdAt:serverTimestamp(),sessionKey:session.sessionToken}));
 });
 await t.test('audits cannot be changed or removed, regular users cannot read them and stale balances are rejected',async()=>{
  const {db,store,session,adminDb}=await prepare(),r=request(session);await store.setStars(r);
  const ref=doc(adminDb,'adminStarAudit',r.requestId);await assertFails(updateDoc(ref,{after:60}));await assertFails(deleteDoc(ref));await assertFails(getDoc(doc(db,'adminStarAudit',r.requestId)));await assertFails(getDocs(collection(adminDb,'adminStarAudit')));
  await assert.rejects(store.setStars({...r,stars:60}),/đã được sử dụng/);await assert.rejects(store.setStars(request(session,{stars:60})),/vừa thay đổi/);assert.equal((await getDoc(doc(db,'learners/learner'))).data().stars,50);
 });
 await t.test('server rules reject expired sessions and locking/reopening invalidates old writes',async()=>{
  const {store,session,adminDb}=await prepare();await store.lock(session.sessionToken);await assertFails(getDoc(doc(adminDb,'learners/learner')));
  const next=await store.unlock('admin2026');await assert.rejects(store.setStars(request(session)),/đã khóa/);
  await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),'adminSessions',ADMIN_UID),{key:next.sessionToken,startedAt:Timestamp.fromMillis(Date.now()-16*60_000)}));
  await assertFails(getDocs(collection(adminDb,'learners')));await assertFails(forgedBatch(adminDb,next).commit());
 });
 await t.test('account switches discard results and prevent pending mutations',async()=>{
  const {store,session}=await prepare();store.account.epoch++;store.account.user={uid:'other',email:'other@example.com'};await assert.rejects(store.lookup('learner@example.com'),/chưa có quyền/);await assert.rejects(store.setStars(request(session)),/chưa có quyền/);
 });
 }finally{await env.cleanup();}
});
