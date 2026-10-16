// Run only on the owner's trusted machine using Application Default Credentials.
import {initializeApp,applicationDefault} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
const [email,operation='grant']=process.argv.slice(2);
if(!email||!['grant','revoke'].includes(operation)){console.error('Usage: node scripts/grant-admin.mjs registered@email.com [grant|revoke]');process.exit(1);}
initializeApp({credential:applicationDefault(),projectId:'little-lingua-ab674'});
const auth=getAuth(),user=await auth.getUserByEmail(email),claims={...user.customClaims};
if(operation==='grant')claims.admin=true;else delete claims.admin;
await auth.setCustomUserClaims(user.uid,claims);
if(operation==='revoke')await auth.revokeRefreshTokens(user.uid);
console.log(`${operation==='grant'?'Granted':'Revoked'} admin: ${user.email}. Sign out and sign back in.`);
