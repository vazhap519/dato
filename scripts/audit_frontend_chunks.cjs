#!/usr/bin/env node
/* Verify that each Inertia page is an independently loadable JS chunk and PDF is lazy. */
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const manifestPath='public/build/manifest.json';
if(!fs.existsSync(manifestPath))throw Error('Missing '+manifestPath);
const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const all=Object.entries(m);
const app=m['resources/js/app.jsx'];
if(!app?.file)throw Error('Missing Inertia app entrypoint');
const pages=all.filter(([k,v])=>k.startsWith('resources/js/Pages/')&&k.endsWith('.jsx')&&v.file);
if(pages.length<15)throw Error('Expected at least 15 page modules, found '+pages.length);
for(const required of ['Home','Explore','Numbers','ExploreEmotions','ExploreDreams','ExploreArchetypes','ExplorePatterns','ExplorePersonalityMirror','ExploreLifeLanguage','LegalDocument']){
 if(!m['resources/js/Pages/'+required+'.jsx']?.file)throw Error('Missing lazy page '+required);
}
const byFilename=new Map(all.filter(([,v])=>v.file).map(([key,v])=>[v.file,{key,...v}]));
const closure=(entry,seen=new Set())=>{
 if(!entry||seen.has(entry.file))return seen;
 seen.add(entry.file);
 for(const ref of entry.imports||[])closure(m[ref],seen);
 return seen;
};
const initial=closure(app);
const pdfFiles=[...byFilename.keys()].filter(file=>/pdfmake|vfs_fonts/i.test(file));
if(pdfFiles.length<2)throw Error('PDF engine/fonts must remain separate chunks');
for(const file of pdfFiles)if(initial.has(file))throw Error('Initial app pulls PDF chunk: '+file);
for(const [key,entry] of pages){
 if(initial.has(entry.file))throw Error('Page included in initial app: '+key);
}
const pdfPage=m['resources/js/Pages/LegalDocument.jsx'];
if(!pdfPage.dynamicImports?.some(x=>/pdfmake/i.test(x))&&!pdfFiles.some(file=>closure(pdfPage).has(file))){
 // Vite may attach dynamic imports to a shared page-specific chunk, not the page manifest key.
 const pageText=fs.readFileSync('resources/js/Pages/LegalDocument.jsx','utf8');
 if(!pageText.includes('import("pdfmake/build/pdfmake")')||!pageText.includes('import("pdfmake/build/vfs_fonts")'))
  throw Error('PDF libraries are not lazily imported');
}
const stats=(file)=>{const p=path.join('public/build',file);const b=fs.readFileSync(p);return {bytes:b.length,gzip:zlib.gzipSync(b).length};};
const sum=files=>[...files].reduce((acc,file)=>{const s=stats(file);acc.bytes+=s.bytes;acc.gzip+=s.gzip;return acc;},{bytes:0,gzip:0});
const initialSizes=sum(initial);
const appSizes=stats(app.file);
const largest=all.filter(([,v])=>v.file&&v.file.endsWith('.js')).map(([key,v])=>({key,file:v.file,...stats(v.file)})).sort((a,b)=>b.bytes-a.bytes).slice(0,12);
const report={
 generated_at:new Date().toISOString(),
 initial_download:{...initialSizes,files:[...initial].sort()},
 app_entry:{file:app.file,...appSizes},
 page_chunks:pages.length,
 pdf_chunks:pdfFiles.map(file=>({file,...stats(file)})),
 largest_files:largest,
 previous_build:{app_js_bytes:1491120,app_js_gzip:399110,source:'vite output provided by site owner 2026-10-30; rounded displayed units'},
};
const base=report.previous_build;
report.comparison={
 previous_app_kb:Math.round(base.app_js_bytes/1000),
 current_app_kb:Math.round(appSizes.bytes/1000),
 previous_app_gzip_kb:Math.round(base.app_js_gzip/1000),
 current_app_gzip_kb:Math.round(appSizes.gzip/1000),
 app_change_percent:+(100*(appSizes.bytes/base.app_js_bytes-1)).toFixed(1),
 note:'Entry file comparison only; actual initial request also downloads static imports and CSS. Read initial_download for this build.'
};
const dest=process.argv[2]||'';
if(dest)fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
console.log('PASS: '+pages.length+' lazy Inertia pages; PDF chunks excluded from initial loading.');
console.log('Initial static JS graph: '+(initialSizes.bytes/1000).toFixed(1)+' kB raw, '+(initialSizes.gzip/1000).toFixed(1)+' kB gzip.');
console.log('App entry: '+(appSizes.bytes/1000).toFixed(1)+' kB vs previous ~1491 kB.');
console.log('PDF assets: '+pdfFiles.map(f=>path.basename(f)).join(', '));
console.log('Report: '+(dest||'console only'));
