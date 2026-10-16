import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ADMIN_UID,ADMIN_EMAIL,isDesignatedAdmin,adjustedWallet,normalizeEmail} from './admin-model.mjs';
import {freshProfile,reduceProfile} from './profile-model.mjs';
test('admin identity requires both the designated UID and email, never email or a client claim alone',()=>{
 assert.ok(isDesignatedAdmin({uid:ADMIN_UID,email:ADMIN_EMAIL}));assert.ok(isDesignatedAdmin({uid:ADMIN_UID,email:ADMIN_EMAIL.toUpperCase()}));
 for(const user of [null,{uid:'other',email:ADMIN_EMAIL,admin:true},{uid:ADMIN_UID,email:'other@example.com'},{email:ADMIN_EMAIL}])assert.ok(!isDesignatedAdmin(user));
 assert.equal(normalizeEmail(' Learner@Example.com '),'learner@example.com');
});
test('admin adjustments preserve learning and purchase arithmetic across increases and decreases',()=>{
 let p=freshProfile();p={...p,...adjustedWallet(p,50)};assert.equal(p.totalEarned,0);assert.deepEqual(p.completed,[]);
 p=reduceProfile(p,{type:'reward',key:'learn:vi:hello',day:'2026-10-16'});p=reduceProfile(p,{type:'buy',id:6,expectedStars:51});assert.equal(p.stars,0);assert.equal(p.adminStarAdjustment,50);assert.equal(p.totalSpent,51);
 p={...p,...adjustedWallet(p,100)};p={...p,...adjustedWallet(p,10)};assert.equal(p.adminStarAdjustment,60);assert.equal(p.stars,p.totalEarned-p.totalSpent+p.adminStarAdjustment);
 p=reduceProfile(p,{type:'settings',nickname:'Updated'});assert.equal(p.adminStarAdjustment,60);
});
test('invalid balances and corrupt wallet arithmetic are rejected',()=>{
 for(const value of [-1,1.5,1000001,NaN,'50'])assert.throws(()=>adjustedWallet(freshProfile(),value),/Số sao/);
 assert.throws(()=>adjustedWallet({...freshProfile(),stars:1},50),/ví/);
});
