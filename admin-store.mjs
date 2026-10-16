import {isDesignatedAdmin,normalizeEmail,adjustedWallet} from './admin-model.mjs?v=free-admin-v1';
// The UI code is a convenience lock. Firestore Rules enforce the designated UID/email,
// server-timed sessions, wallet invariants and an inseparable audit receipt.
export class AdminStore{
 constructor(account){this.account=account;}
 context(){
  const a=this.account;if(a.guest||!a.profile||!a.db||!isDesignatedAdmin(a.user))throw Error('Tài khoản này chưa có quyền admin.');
  const uid=a.user.uid,epoch=a.epoch,api=a.dbApi,db=a.db;
  return {uid,api,db,sessionRef:api.doc(db,'adminSessions',uid),guard:()=>{if(a.epoch!==epoch||a.user?.uid!==uid||a.guest||!a.profile)throw Error('Tài khoản đã thay đổi.');}};
 }
 async check(){const c=this.context();await this.account.user.getIdToken(true);c.guard();await c.api.getDocFromServer(c.sessionRef);c.guard();}
 async unlock(code){
  const c=this.context();if(code!=='admin2026')throw Error('Mã mở khóa không đúng.');
  const sessionToken=crypto.randomUUID();await c.api.setDoc(c.sessionRef,{key:sessionToken,startedAt:c.api.serverTimestamp()});c.guard();
  const snap=await c.api.getDocFromServer(c.sessionRef);c.guard();
  if(snap.data()?.key!==sessionToken)throw Error('Phiên quản trị đã được mở ở nơi khác. Hãy mở khóa lại.');
  return {sessionToken,expiresAt:snap.data().startedAt.toMillis()+15*60_000};
 }
 async lock(sessionToken){const c=this.context();await c.api.runTransaction(c.db,async tx=>{const snap=await tx.get(c.sessionRef);c.guard();if(snap.exists()&&snap.data().key===sessionToken)tx.delete(c.sessionRef);});}
 async lookup(email){
  const c=this.context(),normalized=normalizeEmail(email);
  if(normalized.length>254||!/^\S+@\S+\.\S+$/.test(normalized))throw Error('Nhập email đã đăng ký hợp lệ.');
  const result=await c.api.getDocsFromServer(c.api.query(c.api.collection(c.db,'learners'),c.api.where('email','==',normalized),c.api.limit(2)));c.guard();
  if(result.empty)throw Error('Chưa tìm thấy hồ sơ có email này. Nếu người học đã đăng ký, hãy yêu cầu họ đăng xuất rồi đăng nhập lại để đồng bộ email.');
  if(result.docs.length!==1)throw Error('Có nhiều hồ sơ trùng email. Chủ dự án cần kiểm tra trong Firebase trước khi sửa sao.');
  const snap=result.docs[0],p=snap.data();return {uid:snap.id,email:p.email,nickname:p.nickname,stars:p.stars};
 }
 async setStars(data){
  const c=this.context();
  if(typeof data.uid!=='string'||!data.uid||data.uid.includes('/')||data.uid.length>128||!/^[-a-zA-Z0-9]{16,80}$/.test(data.requestId||'')||typeof data.reason!=='string'||data.reason.trim().length<3||data.reason.trim().length>300||!Number.isSafeInteger(data.expectedStars))throw Error('Kiểm tra người dùng, số sao và lý do (3–300 ký tự).');
  const email=normalizeEmail(data.email),reason=data.reason.trim(),ref=c.api.doc(c.db,'learners',data.uid),auditRef=c.api.doc(c.db,'adminStarAudit',data.requestId);
  return c.api.runTransaction(c.db,async tx=>{
   const [session,audit,snap]=await Promise.all([tx.get(c.sessionRef),tx.get(auditRef),tx.get(ref)]);c.guard();
   if(!session.exists()||session.data().key!==data.sessionToken||session.data().startedAt.toMillis()+15*60_000<=Date.now())throw Error('Phiên quản trị đã khóa hoặc hết hạn. Vui lòng mở khóa lại.');
   if(audit.exists()){
    const old=audit.data();if(old.actorUid!==c.uid||old.targetUid!==data.uid||old.targetEmail!==email||old.before!==data.expectedStars||old.after!==data.stars||old.reason!==reason)throw Error('Mã yêu cầu đã được sử dụng.');
    return {stars:old.after,receipt:data.requestId};
   }
   if(!snap.exists())throw Error('Không tìm thấy hồ sơ học tập.');
   const profile=snap.data();if(profile.email!==email)throw Error('Email của hồ sơ đã thay đổi. Tìm lại người dùng trước khi lưu.');
   if(profile.stars!==data.expectedStars)throw Error('Số sao vừa thay đổi. Tìm lại email để xem số dư mới trước khi lưu.');
   const wallet=adjustedWallet(profile,data.stars);
   tx.update(ref,{...wallet,lastAdminAdjustment:data.requestId});
   tx.set(auditRef,{actorUid:c.uid,targetUid:data.uid,targetEmail:email,before:profile.stars,after:wallet.stars,reason,createdAt:c.api.serverTimestamp(),sessionKey:data.sessionToken});
   return {stars:wallet.stars,receipt:data.requestId};
  });
 }
}
