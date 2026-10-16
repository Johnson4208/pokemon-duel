import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,GLOSSES_VI,vocabularyPool,buildTest,gradeQuestions,validateTest,scrambleWord} from './curriculum.mjs';
test('courses have complete sequential units, vocabulary, grammar exercises and valid prerequisites',()=>{
 for(const lang of ['vi','zh']){
  const units=LESSONS.filter(l=>l.language===lang);assert.equal(units.length,12);
  units.forEach((l,i)=>{assert.equal(l.order,i+1);assert.equal(l.prerequisite,i?units[i-1].id:null);assert.ok(l.words.length>=(lang==='vi'?7:6));assert.equal(l.grammar.length,lang==='vi'?4:2);assert.equal(new Set(l.words.map(w=>w.term)).size,l.words.length);assert.ok(l.reading&&l.translation&&l.goal&&l.writing);for(const g of l.grammar)for(const field of ['pattern','note','example','meaning','question','answer'])assert.ok(g[field]);if(lang==='zh')for(const w of l.words){assert.ok(w.pinyin);assert.ok(GLOSSES_VI[w.meaning],w.meaning);}});
 }
});
test('lesson selection reuses existing word identity and links repeated words to all relevant lessons',()=>{
 const pool=vocabularyPool('vi',[{id:'saved-word',vi:'tôi',en:'I'}]);assert.equal(pool.filter(w=>w.vi==='tôi').length,1);assert.equal(pool.find(w=>w.vi==='tôi').id,'saved-word');assert.ok(pool.find(w=>w.vi==='tôi').lessonIds.includes('vi-01'));
});
test('test snapshots contain selected words only, never Chinese scrambling, and keep writing ungraded',()=>{
 const words=vocabularyPool('vi',[]).slice(0,6),t=buildTest({language:'vi',words,count:4,types:['meaning','scramble'],writing:'Giới thiệu gia đình'});
 assert.equal(t.questions.length,8);assert.equal(new Set(t.questions.map(q=>q.word.id)).size,4);assert.ok(t.questions.every(q=>words.some(w=>w.id===q.word.id)));assert.equal(gradeQuestions(t.questions,t.questions.map(q=>q.answer)).filter(q=>q.correct).length,8);
 assert.throws(()=>buildTest({language:'zh',words,count:2,types:['scramble']}));assert.throws(()=>buildTest({language:'vi',words,count:7,types:['meaning']}));assert.throws(()=>buildTest({language:'vi',words,count:0,types:['meaning']}));
});
test('Chinese meanings support Vietnamese alternatives, and Vietnamese spelling preserves diacritics',()=>{
 const zh=buildTest({language:'zh',words:[{id:'a',vi:'爸爸',en:'father'}],types:['meaning'],count:1,answerLanguage:'vi'});
 assert.equal(gradeQuestions(zh.questions,['CHA'])[0].correct,true);assert.equal(gradeQuestions(zh.questions,['mẹ'])[0].correct,false);
 const q={type:'scramble',word:{vi:'cảm ơn'},answer:'cảm ơn'};
 assert.equal(gradeQuestions([q],['cam on'])[0].correct,false);assert.equal(gradeQuestions([q],['  CẢM   ƠN! '])[0].correct,true);
});
test('scrambling preserves every character and does not show the original ordering',()=>{
 const term='xin chào';const out=scrambleWord(term,()=>.999).split(' · ').join('').replaceAll('␣',' ');assert.notEqual(out,term);assert.deepEqual([...out].sort(),[...term].sort());
});
test('import validates bounded test content and strips unrelated fields',()=>{
 const t=buildTest({language:'zh',words:[{id:'1',vi:'我',en:'I'}],count:1,types:['meaning']});assert.equal(validateTest({...t,admin:true}).admin,undefined);
 assert.throws(()=>validateTest({...t,questions:Array(101).fill(t.questions[0])}));assert.throws(()=>validateTest({...t,questions:[{...t.questions[0],type:'scramble'}]}));assert.throws(()=>validateTest({...t,questions:[],writing:''}));assert.throws(()=>validateTest({...t,questions:[{...t.questions[0],word:{vi:123,en:'I'}}]}));
});

import {CONNECTOR_GUIDE,VI_LESSON_UPGRADES} from './vietnamese-grammar.mjs';
test('connector guide and paragraph workshops are linked to existing lessons with usable answer explanations',()=>{assert.equal(CONNECTOR_GUIDE.length,10);assert.equal(Object.keys(VI_LESSON_UPGRADES).length,12);for(const group of CONNECTOR_GUIDE){assert.ok(group.forms.length>=3);assert.ok(group.answers.length&&group.explanation&&group.exercise&&group.reason);for(const id of group.lessons)assert.ok(LESSONS.some(l=>l.id===id));}for(const l of LESSONS.filter(l=>l.language==='vi')){assert.ok(l.workshop.before!==l.workshop.after);assert.ok(l.workshop.reason&&l.workshop.task);}});
