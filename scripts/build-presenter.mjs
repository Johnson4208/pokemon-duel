import {build} from 'esbuild';
import {mkdir,cp,copyFile,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root=process.cwd(),out=path.resolve(process.argv[2]||'_site');
await mkdir(path.join(out,'presenter-vendor'),{recursive:true});
await build({entryPoints:['scripts/pptx-entry.mjs'],outfile:path.join(out,'presenter-vendor/pptx.mjs'),bundle:true,format:'esm',platform:'browser',target:['chrome110','firefox115','safari17'],minify:true,legalComments:'eof'});
for(const name of ['pdf.min.mjs','pdf.worker.min.mjs','pdf.renderer.min.mjs'])await copyFile(path.join(root,'node_modules/pdfjs-dist/build',name),path.join(out,'presenter-vendor',name));
for(const name of ['cmaps','standard_fonts','wasm'])await cp(path.join(root,'node_modules/pdfjs-dist',name),path.join(out,'presenter-vendor',name),{recursive:true,filter:source=>!source.endsWith('.map')});
const files=['presenter.html','presenter.css','presenter.mjs','teaching-store.mjs'];
for(const name of files)await copyFile(path.join(root,name),path.join(out,name));
let license='Little Lingua teaching viewer — bundled third-party licenses\n\n';
for(const name of ['pdfjs-dist','pptxviewjs','jszip','chart.js']){const pkg=JSON.parse(await readFile(`node_modules/${name}/package.json`,'utf8'));license+=`\n--- ${name} ${pkg.version} ---\n`;for(const candidate of ['LICENSE','LICENSE.txt','LICENSE.md','LICENSE.markdown']){try{license+=await readFile(`node_modules/${name}/${candidate}`,'utf8');break;}catch{}}}
await writeFile(path.join(out,'presenter-vendor/LICENSES.txt'),license);
async function walk(dir){let all=[];for(const item of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);all.push(...(item.isDirectory()?await walk(file):[path.relative(out,file).split(path.sep).join('/')]));}return all;}
files.push(...await walk(path.join(out,'presenter-vendor')));files.sort();
const hash=createHash('sha256');for(const name of files)hash.update(await readFile(path.join(out,name)));const version=hash.digest('hex').slice(0,16);
await writeFile(path.join(out,'presenter-assets.json'),JSON.stringify({version,files}));
const sw=(await readFile('presenter-sw.js','utf8')).replace('__PRESENTER_VERSION__',version);
await writeFile(path.join(out,'presenter-sw.js'),sw);console.log(`Teaching viewer built: ${files.length} offline assets, version ${version}`);
