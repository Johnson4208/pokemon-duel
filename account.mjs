import {freshProfile,reduceProfile,AVATARS} from './profile-model.mjs?v=roles-v1';
export class Account extends EventTarget {
 constructor(){super();this.profile=null;this.user=null;this.ready=false;this.guest=false;this.epoch=0;this.queue=Promise.resolve();}
 emit(){this.dispatchEvent(new Event('change'));}
 async init(){
  if(!window.LINGUA_FIREBASE?.projectId){this.ready=true;this.emit();return;}
  try{
   const base='https://www.gstatic.com/firebasejs/10.12.5/';
   const [app,auth,db]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   this.authApi=auth;this.dbApi=db;const firebase=app.initializeApp(window.LINGUA_FIREBASE);this.auth=auth.initializeAuth(firebase,{persistence:auth.browserSessionPersistence});this.db=db.getFirestore(firebase);
   auth.onAuthStateChanged(this.auth,async user=>{
    const epoch=++this.epoch;this.unsubscribe?.();this.user=user;this.guest=false;this.profile=null;this.emit();
    if(!user){this.ready=true;this.emit();return;}
    try{
     const ref=db.doc(this.db,'learners',user.uid);
     await db.runTransaction(this.db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())tx.set(ref,freshProfile(user.displayName||'Sunny'));});
     if(epoch!==this.epoch)return;
     this.unsubscribe=db.onSnapshot(ref,snap=>{if(epoch!==this.epoch)return;this.profile=snap.data();this.ready=true;this.emit();},error=>this.fail(error));
    }catch(error){if(epoch===this.epoch)this.fail(error);}
   });
  }catch(error){this.ready=true;this.fail(error);}
 }
 fail(error){this.error=error?.code==='permission-denied'?'Account data is unavailable. Ask the app owner to publish the Firestore rules.':error?.message||'Could not connect. Please try again.';this.dispatchEvent(new Event('error'));}
 async login(email,password){if(!this.auth)throw Error('Cloud login is waiting for the app owner to connect Firebase.');return this.authApi.signInWithEmailAndPassword(this.auth,email,password);}
 async register(email,password,nickname,avatar){if(!this.auth)throw Error('Cloud login is waiting for the app owner to connect Firebase.');if(password.length<8)throw Error('Use at least 8 characters for your password.');const result=await this.authApi.createUserWithEmailAndPassword(this.auth,email,password);await this.authApi.updateProfile(result.user,{displayName:nickname.slice(0,20)});await this.dbApi.runTransaction(this.db,async tx=>{const ref=this.dbApi.doc(this.db,'learners',result.user.uid),snap=await tx.get(ref);if(!snap.exists())tx.set(ref,freshProfile(nickname,avatar));else tx.update(ref,{nickname:nickname.slice(0,20)||'Sunny',avatar:AVATARS.includes(avatar)?avatar:'fox'});});return result;}
 async reset(email){if(!this.auth)throw Error('Connect Firebase before resetting a password.');await this.authApi.sendPasswordResetEmail(this.auth,email);}
 demo(){if(this.user)throw Error('Sign out before opening the demo.');this.unsubscribe?.();++this.epoch;this.guest=true;this.profile=freshProfile('Explorer');try{this.profile=JSON.parse(sessionStorage.getItem('linguaGuestV2'))||this.profile;}catch{}this.emit();}
 async logout(){this.unsubscribe?.();++this.epoch;this.profile=null;this.guest=false;this.emit();if(this.auth)await this.authApi.signOut(this.auth);this.user=null;this.emit();}
 mutate(action){
  const epoch=this.epoch,uid=this.user?.uid,guest=this.guest;
  const job=this.queue.catch(()=>{}).then(async()=>{
   if(epoch!==this.epoch||(!uid&&!guest))throw Error('Your account changed. Please try again.');
   if(guest){this.profile=reduceProfile(this.profile,action);sessionStorage.setItem('linguaGuestV2',JSON.stringify(this.profile));this.emit();return this.profile;}
   const ref=this.dbApi.doc(this.db,'learners',uid);
   const next=await this.dbApi.runTransaction(this.db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())throw Error('Learner profile not found');const p=reduceProfile(snap.data(),action);tx.set(ref,p);return p;});
   if(epoch===this.epoch){this.profile=next;this.emit();}return next;
  });this.queue=job;return job;
 }
}
export const account=new Account();window.LinguaAccount=account;
