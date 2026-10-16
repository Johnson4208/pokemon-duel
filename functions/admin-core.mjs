import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
export const MAX_STARS=1_000_000;
const hash=value=>createHash('sha256').update(value).digest('hex');
function fail(code,message){throw Object.assign(new Error(message),{code});}
export function adjustedWallet(profile,stars){
 if(!Number.isSafeInteger(stars)||stars<0||stars>MAX_STARS)fail('invalid-argument','Số sao phải là số nguyên từ 0 đến 1.000.000.');
 const adjustment=profile.adminStarAdjustment??0;
 if(!Number.isSafeInteger(profile.stars)||!Number.isSafeInteger(adjustment)||profile.stars!==profile.totalEarned-profile.totalSpent+adjustment)fail('failed-precondition','Dữ liệu ví chưa hợp lệ. Liên hệ chủ nền tảng.');
 const next=adjustment+stars-profile.stars;
 if(!Number.isSafeInteger(next))fail('failed-precondition','Giá trị điều chỉnh vượt giới hạn.');
 return {stars,adminStarAdjustment:next};
}
export function createAdminService({auth,db,code,now=Date.now,token=()=>randomBytes(32).toString('hex')}){
 return async function handle(request){
  if(!request.auth)fail('unauthenticated','Vui lòng đăng nhập tài khoản admin.');
  const uid=request.auth.uid,user=await auth.getUser(uid);
  const validAfter=Date.parse(user.tokensValidAfterTime||'1970-01-01');
  if(user.disabled||user.customClaims?.admin!==true||request.auth.token?.admin!==true||request.auth.token.auth_time*1000<validAfter)fail('permission-denied','Tài khoản chưa được cấp quyền admin hoặc cần đăng nhập lại.');
  const data=request.data||{},sessionRef=db.collection('adminSessions').doc(uid);
  if(data.action==='unlock'){
   if(typeof data.code!=='string'||data.code.length>100)fail('invalid-argument','Mã mở khóa không hợp lệ.');
   const secret=code();if(!secret)fail('failed-precondition','Chủ nền tảng chưa cấu hình mã quản trị.');
   const sessionToken=token(),time=now(),expiresAt=time+15*60_000;
   const result=await db.runTransaction(async tx=>{
    const snap=await tx.get(sessionRef),old=snap.data()||{};
    const attempts=old.windowStart>time-15*60_000?(old.attempts||0):0;
    if(attempts>=5)return 'limited';
    const correct=timingSafeEqual(Buffer.from(hash(data.code),'hex'),Buffer.from(hash(secret),'hex'));
    if(!correct){tx.set(sessionRef,{attempts:attempts+1,windowStart:attempts?old.windowStart:time,expiresAt:0,tokenHash:''});return 'wrong';}
    tx.set(sessionRef,{attempts,windowStart:attempts?old.windowStart:time,expiresAt,tokenHash:hash(sessionToken)});return 'ok';
   });
   if(result==='limited')fail('resource-exhausted','Đã thử quá nhiều lần. Chờ 15 phút rồi thử lại.');
   if(result==='wrong')fail('permission-denied','Mã mở khóa không đúng.');
   return {sessionToken,expiresAt};
  }
  function requireSession(snap){const session=snap.data();if(typeof data.sessionToken!=='string'||data.sessionToken.length!==64||!session||session.expiresAt<=now()||session.tokenHash!==hash(data.sessionToken))fail('permission-denied','Phiên quản trị đã khóa. Vui lòng mở khóa lại.');}
  requireSession(await sessionRef.get());
  if(data.action==='lock'){await sessionRef.delete();return {locked:true};}
  if(data.action==='lookup'){
   const email=typeof data.email==='string'?data.email.trim():'';
   if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))fail('invalid-argument','Nhập email đã đăng ký hợp lệ.');
   let target;try{target=await auth.getUserByEmail(email);}catch(error){if(error.code==='auth/user-not-found')fail('not-found','Không tìm thấy tài khoản với email này.');throw error;}
   const snap=await db.collection('learners').doc(target.uid).get();
   if(!snap.exists)fail('not-found','Tài khoản chưa có hồ sơ học tập.');
   const profile=snap.data();return {uid:target.uid,email:target.email,nickname:profile.nickname,stars:profile.stars};
  }
  if(data.action==='setStars'){
   if(typeof data.uid!=='string'||!data.uid||data.uid.length>128||data.uid.includes('/')||!Number.isSafeInteger(data.expectedStars)||typeof data.reason!=='string'||data.reason.trim().length<3||data.reason.trim().length>300||!/^[-a-zA-Z0-9]{16,80}$/.test(data.requestId||''))fail('invalid-argument','Kiểm tra người dùng, số sao và lý do (3–300 ký tự).');
   // Check the registered account still exists. Never accept an email-to-UID mapping supplied by the browser.
   const target=await auth.getUser(data.uid),ref=db.collection('learners').doc(target.uid),auditRef=db.collection('adminStarAudit').doc(`${uid}_${data.requestId}`);
   return db.runTransaction(async tx=>{
    const [session,audit,snap]=await Promise.all([tx.get(sessionRef),tx.get(auditRef),tx.get(ref)]);requireSession(session);
    if(audit.exists){const old=audit.data();if(old.targetUid!==target.uid||old.after!==data.stars||old.reason!==data.reason.trim()||old.before!==data.expectedStars)fail('already-exists','Mã yêu cầu đã được sử dụng.');return {stars:old.after,receipt:data.requestId};}
    if(!snap.exists)fail('not-found','Không tìm thấy hồ sơ học tập.');
    const profile=snap.data();if(profile.stars!==data.expectedStars)fail('aborted','Số sao vừa thay đổi. Tìm lại email để xem số dư mới trước khi lưu.');
    const wallet=adjustedWallet(profile,data.stars);
    tx.update(ref,wallet);tx.set(auditRef,{actorUid:uid,targetUid:target.uid,before:profile.stars,after:wallet.stars,reason:data.reason.trim(),createdAt:now()});
    return {stars:wallet.stars,receipt:data.requestId};
   });
  }
  fail('invalid-argument','Thao tác quản trị không hợp lệ.');
 };
}
