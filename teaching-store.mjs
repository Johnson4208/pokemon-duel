export const MAX_FILE_SIZE=80*1024*1024;
export const MAX_PAGES=500;
export function fileKind(file){const name=String(file.name||'').toLowerCase();if(name.endsWith('.pdf'))return 'pdf';if(name.endsWith('.pptx'))return 'pptx';throw Error('Chỉ hỗ trợ PDF và PowerPoint .pptx. Hãy lưu file .ppt cũ thành .pptx trước.');}
export function validateFile(file){const kind=fileKind(file);if(!file.size)throw Error('File trống, không thể trình chiếu.');if(file.size>MAX_FILE_SIZE)throw Error('File vượt giới hạn 80 MB. Hãy chia nhỏ tài liệu trước khi mở.');return kind;}
export function validPage(index,count){return Math.max(0,Math.min(count-1,Math.trunc(Number(index)||0)));}
export function sizeLabel(bytes){if(bytes===0)return '0 KB';return bytes>=1048576?(bytes/1048576).toFixed(1)+' MB':Math.max(1,Math.round(bytes/1024))+' KB';}
export function openTeachingStore(indexedDB=globalThis.indexedDB){return new Promise((resolve,reject)=>{if(!indexedDB)return reject(Error('Trình duyệt không hỗ trợ lưu file trên thiết bị.'));const request=indexedDB.open('little-lingua-teaching-v1',1);request.onupgradeneeded=()=>{for(const name of ['decks','files'])if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name,{keyPath:'id'});};request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Đóng các tab trình chiếu cũ rồi tải lại để mở bộ nhớ.'));request.onsuccess=()=>resolve(new TeachingStore(request.result));});}
export class TeachingStore{
 constructor(db){this.db=db;db.onversionchange=()=>db.close();}
 transaction(stores,mode,job){return new Promise((resolve,reject)=>{const tx=this.db.transaction(stores,mode);let value;tx.oncomplete=()=>resolve(value);tx.onerror=tx.onabort=()=>reject(tx.error||Error('Không thể ghi bộ nhớ thiết bị.'));try{job(tx,result=>value=result);}catch(error){tx.abort();reject(error);}});}
 list(){return this.transaction(['decks'],'readonly',(tx,done)=>{const r=tx.objectStore('decks').getAll();r.onsuccess=()=>done(r.result.sort((a,b)=>b.updatedAt-a.updatedAt));});}
 get(id){return this.transaction(['decks','files'],'readonly',(tx,done)=>{let meta,blob;const a=tx.objectStore('decks').get(id),b=tx.objectStore('files').get(id);a.onsuccess=()=>{meta=a.result;done(meta&&blob?{...meta,blob}:null);};b.onsuccess=()=>{blob=b.result?.blob;done(meta&&blob?{...meta,blob}:null);};});}
 save(meta,blob){return this.transaction(['decks','files'],'readwrite',tx=>{tx.objectStore('decks').put(meta);tx.objectStore('files').put({id:meta.id,blob});});}
 patch(id,patch){return this.transaction(['decks'],'readwrite',(tx,done)=>{const store=tx.objectStore('decks'),r=store.get(id);r.onsuccess=()=>{if(!r.result){tx.abort();return;}const next={...r.result,...patch,id};store.put(next);done(next);};});}
 remove(id){return this.transaction(['decks','files'],'readwrite',tx=>{tx.objectStore('decks').delete(id);tx.objectStore('files').delete(id);});}
}
