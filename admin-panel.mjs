import {account} from './account.mjs?v=shop-voucher-v1';
const $=id=>document.getElementById(id),panel=$('admin-settings');
let identity=null,generation=0,session=null,target=null,pending=null,timer=null,api=null,busy=false;
const status=message=>{$('admin-status').textContent=message;};
function reset(){generation++;session=null;target=null;pending=null;clearTimeout(timer);$('admin-code').value='';$('admin-email').value='';$('admin-stars').value='';$('admin-reason').value='';$('admin-unlock-form').hidden=true;$('admin-tools').hidden=true;$('admin-target').hidden=true;status(account.user&&!account.guest?'Nhấn kiểm tra quyền để mở khu vực quản trị.':'Đăng nhập tài khoản đã được chủ nền tảng cấp quyền admin.');}
function sync(){const uid=account.user?.uid||null;if(uid!==identity||account.guest||!account.profile){identity=uid;reset();}$('admin-check').disabled=!uid||!account.profile||account.guest||busy;}
async function run(action){if(busy)return;const current=++generation,uid=account.user?.uid;busy=true;panel.querySelectorAll('button').forEach(b=>b.disabled=true);try{await action(()=>{if(current!==generation||account.user?.uid!==uid||account.guest)throw Error('Tài khoản đã thay đổi.');});}catch(error){if(current===generation)status(explain(error));}finally{busy=false;panel.querySelectorAll('button').forEach(b=>b.disabled=false);sync();}}
function explain(error){if(['functions/unavailable','functions/not-found','functions/internal'].includes(error.code))return 'Chưa kết nối được dịch vụ quản trị. Chủ nền tảng cần triển khai Firebase Functions hoặc kiểm tra kết nối.';return error.message||'Không thể hoàn tất. Vui lòng thử lại.';}
async function call(data){api??=import('https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js').then(m=>m.httpsCallable(m.getFunctions(account.auth.app,'us-central1'),'adminPanel'));return (await (await api)(data)).data;}
function lockView(message='Đã khóa khu vực quản trị.'){session=null;target=null;pending=null;clearTimeout(timer);$('admin-tools').hidden=true;$('admin-target').hidden=true;$('admin-unlock-form').hidden=false;$('admin-code').value='';status(message);}
$('admin-check').addEventListener('click',()=>run(async guard=>{
 const result=await account.user.getIdTokenResult(true);guard();
 if(result.claims.admin!==true){reset();status('Tài khoản này chưa có quyền admin. Chủ nền tảng cần cấp quyền trước khi mở khóa.');return;}
 lockView('Đã xác nhận quyền admin. Nhập mã để mở khóa trong 15 phút.');$('admin-code').focus();
}));
$('admin-unlock-form').addEventListener('submit',event=>{event.preventDefault();run(async guard=>{
 const code=$('admin-code').value;$('admin-code').value='';
 const result=await call({action:'unlock',code});guard();session=result;
 $('admin-unlock-form').hidden=true;$('admin-tools').hidden=false;
 timer=setTimeout(()=>lockView('Phiên quản trị đã hết hạn. Nhập mã để mở khóa lại.'),Math.max(0,result.expiresAt-Date.now()));
 status('Đã mở khóa. Tìm người dùng bằng email đã đăng ký.');$('admin-email').focus();
});});
$('admin-lookup-form').addEventListener('submit',event=>{event.preventDefault();run(async guard=>{
 target=null;pending=null;$('admin-target').hidden=true;
 const result=await call({action:'lookup',sessionToken:session?.sessionToken,email:$('admin-email').value.trim()});guard();target=result;
 $('admin-target-name').textContent=result.nickname;$('admin-target-email').textContent=result.email;
 $('admin-current-stars').textContent=String(result.stars);$('admin-stars').value=String(result.stars);$('admin-reason').value='';$('admin-target').hidden=false;preview();status('Đã tìm thấy tài khoản. Nhập số sao mới và lý do thay đổi.');
});});
function preview(){const value=$('admin-stars').value,stars=Number(value);$('admin-change-preview').textContent=target&&value!==''&&Number.isInteger(stars)&&stars>=0&&stars<=1_000_000?`${target.stars} ⭐ → ${stars} ⭐ (${stars-target.stars>=0?'+':''}${stars-target.stars})`:'';}
$('admin-stars').addEventListener('input',preview);
$('admin-stars-form').addEventListener('submit',event=>{event.preventDefault();run(async guard=>{
 if(!target||!session)throw Error('Tìm người dùng và mở khóa trước khi lưu.');
 const stars=Number($('admin-stars').value),reason=$('admin-reason').value.trim();
 if(!Number.isInteger(stars)||stars<0||stars>1_000_000||reason.length<3)throw Error('Nhập số sao nguyên hợp lệ và lý do ít nhất 3 ký tự.');
 const signature=JSON.stringify([target.uid,target.stars,stars,reason]);
 if(pending?.signature!==signature)pending={signature,requestId:crypto.randomUUID()};
 const result=await call({action:'setStars',sessionToken:session.sessionToken,uid:target.uid,expectedStars:target.stars,stars,reason,requestId:pending.requestId});guard();
 target.stars=result.stars;pending=null;$('admin-current-stars').textContent=String(result.stars);preview();
 status(`Đã lưu ${result.stars} sao cho ${target.email}. Thay đổi đã được ghi nhật ký.`);
});});
$('admin-lock').addEventListener('click',()=>run(async guard=>{const token=session?.sessionToken;lockView();if(token){await call({action:'lock',sessionToken:token});guard();}}));
// Closing Settings clears the unlock session from browser memory as well.
new MutationObserver(()=>{if($('modal-backdrop').hidden){generation++;if(session){const token=session.sessionToken;lockView();call({action:'lock',sessionToken:token}).catch(()=>{});}}}).observe($('modal-backdrop'),{attributes:true,attributeFilter:['hidden']});
account.addEventListener('change',sync);reset();sync();
