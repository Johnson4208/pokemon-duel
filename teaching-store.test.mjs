import {test} from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {openTeachingStore,validateFile,MAX_FILE_SIZE,validPage} from './teaching-store.mjs';
test('teaching library persists original bytes and progress across connections and removes file and metadata together',async()=>{
 const factory=new IDBFactory(),first=await openTeachingStore(factory),blob=new Blob(['original presentation bytes'],{type:'application/pdf'}),meta={id:'deck-a',name:'Lesson A',originalName:'lesson.pdf',kind:'pdf',size:blob.size,count:3,page:0,annotations:{},updatedAt:1};
 await first.save(meta,blob);await first.patch(meta.id,{page:2,annotations:{2:[{mode:'pen',color:'#ff0000',points:[[.1,.2],[.2,.3]]}]},updatedAt:2});first.db.close();
 const next=await openTeachingStore(factory),restored=await next.get(meta.id);assert.equal(await restored.blob.text(),'original presentation bytes');assert.equal(restored.page,2);assert.equal(restored.annotations[2][0].points.length,2);assert.equal((await next.list()).length,1);
 await next.remove(meta.id);assert.equal(await next.get(meta.id),null);assert.deepEqual(await next.list(),[]);next.db.close();
});
test('failed autosave rolls back both metadata and original, preserving the existing library',async()=>{
 const store=await openTeachingStore(new IDBFactory());const original={id:'old',name:'Saved',updatedAt:1};await store.save(original,new Blob(['keep']));
 const real=store.db.transaction.bind(store.db);store.db.transaction=(...args)=>{const tx=real(...args),access=tx.objectStore.bind(tx);tx.objectStore=name=>{const object=access(name);if(name==='files')object.put=()=>{throw new DOMException('Full','QuotaExceededError');};return object;};return tx;};
 await assert.rejects(store.save({id:'new',name:'Must not appear',updatedAt:2},new Blob(['lost'])),{name:'QuotaExceededError'});store.db.transaction=real;
 assert.equal(await store.get('new'),null);assert.deepEqual((await store.list()).map(f=>f.id),['old']);assert.equal(await (await store.get('old')).blob.text(),'keep');store.db.close();
});
test('unsupported, oversized and empty files fail before parsing and page restore stays bounded',()=>{
 for(const file of [{name:'old.ppt',size:12},{name:'empty.pdf',size:0},{name:'large.pptx',size:MAX_FILE_SIZE+1}])assert.throws(()=>validateFile(file));
 assert.equal(validateFile({name:'LESSON.PPTX',size:50}),'pptx');assert.equal(validateFile({name:'lesson.pdf',size:20}),'pdf');assert.equal(validPage(900,3),2);assert.equal(validPage(-10,3),0);assert.equal(validPage('bad',3),0);
});
