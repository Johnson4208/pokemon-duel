import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import {createAdminService} from './admin-core.mjs';
initializeApp();
const adminCode=defineSecret('ADMIN_PANEL_CODE');
const service=createAdminService({auth:getAuth(),db:getFirestore(),code:()=>adminCode.value()});
const safeCodes=new Set(['unauthenticated','permission-denied','invalid-argument','failed-precondition','resource-exhausted','not-found','aborted','already-exists']);
export const adminPanel=onCall({region:'us-central1',secrets:[adminCode],maxInstances:3},async request=>{
 try{return await service(request);}catch(error){
  if(safeCodes.has(error.code))throw new HttpsError(error.code,error.message);
  if(error.code==='auth/user-not-found')throw new HttpsError('not-found','Tài khoản không còn tồn tại.');
  throw new HttpsError('internal','Không thể xử lý thao tác quản trị. Vui lòng thử lại.');
 }
});
