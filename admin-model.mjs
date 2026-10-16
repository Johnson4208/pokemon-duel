export const ADMIN_UID='jhZjxzGCY7MCbyYjfRIwdSfAUZ62';
export const ADMIN_EMAIL='tungba5808@gmail.com';
export const MAX_STARS=1_000_000;
export const normalizeEmail=value=>String(value??'').trim().toLowerCase();
export const isDesignatedAdmin=user=>user?.uid===ADMIN_UID&&normalizeEmail(user.email)===ADMIN_EMAIL;
export function adjustedWallet(profile,stars){
 if(!Number.isSafeInteger(stars)||stars<0||stars>MAX_STARS)throw Error('Số sao phải là số nguyên từ 0 đến 1.000.000.');
 const adjustment=profile.adminStarAdjustment??0;
 if(!Number.isSafeInteger(profile.stars)||!Number.isSafeInteger(adjustment)||profile.stars!==profile.totalEarned-profile.totalSpent+adjustment)throw Error('Dữ liệu ví chưa hợp lệ. Liên hệ chủ nền tảng.');
 const next=adjustment+stars-profile.stars;
 if(!Number.isSafeInteger(next))throw Error('Giá trị điều chỉnh vượt giới hạn.');
 return {stars,adminStarAdjustment:next};
}
