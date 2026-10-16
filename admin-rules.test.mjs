// Install test dependencies outside the published app:
// npm install --prefix /tmp/lingua-admin-verify @firebase/rules-unit-testing firebase
// FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test admin-rules.test.mjs
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {freshProfile,reduceProfile} from './profile-model.mjs';
const enabled=Boolean(process.env.FIRESTORE_EMULATOR_HOST);
test('Firestore denies client wallet adjustments, sessions, audit and other users; adjusted wallets still learn and buy',{skip:!enabled},async()=>{
 const modules=process.env.ADMIN_TEST_MODULES||'/tmp/lingua-admin-verify/node_modules';
 const require=createRequire(`${modules}/package.json`);
 const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
 const {doc,setDoc,getDoc,updateDoc}=require('firebase/firestore');
 const env=await initializeTestEnvironment({projectId:'demo-lingua-admin',firestore:{rules:await readFile(new URL('./firestore.rules',import.meta.url),'utf8')}});
 try{
  const db=env.authenticatedContext('learner').firestore(),other=env.authenticatedContext('other').firestore(),admin=env.authenticatedContext('admin',{admin:true}).firestore(),p=freshProfile('Learner');
  await assertSucceeds(setDoc(doc(db,'learners/learner'),p));
  await assertFails(updateDoc(doc(db,'learners/learner'),{stars:50,adminStarAdjustment:50}));
  await assertFails(setDoc(doc(other,'learners/other'),{...p,stars:50,adminStarAdjustment:50}));
  await assertFails(getDoc(doc(other,'learners/learner')));
  await assertFails(updateDoc(doc(admin,'learners/learner'),{stars:50,adminStarAdjustment:50}));
  for(const path of ['adminSessions/admin','adminStarAudit/receipt']){await assertFails(setDoc(doc(admin,path),{value:true}));await assertFails(getDoc(doc(admin,path)));}
  await env.withSecurityRulesDisabled(async context=>setDoc(doc(context.firestore(),'learners/learner'),{...p,stars:50,adminStarAdjustment:50}));
  const earned=reduceProfile({...p,stars:50,adminStarAdjustment:50},{type:'reward',key:'learn:vi:hello',day:'2026-10-16'});
  await assertSucceeds(setDoc(doc(db,'learners/learner'),earned));
  await assertSucceeds(setDoc(doc(db,'learners/learner'),reduceProfile(earned,{type:'buy',id:6,expectedStars:51})));
  await assertFails(updateDoc(doc(db,'learners/learner'),{adminStarAdjustment:51,stars:1}));
 }finally{await env.cleanup();}
});
