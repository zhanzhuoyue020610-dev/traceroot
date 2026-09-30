import {mkdir,cp,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sources=[{"file": "new-oil-filter.jpg", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Olejov%C3%BD_filtr_s_t%C4%9Bsn%C4%9Bn%C3%ADm.jpg", "title": "Olejový filtr s těsněním", "author": "Voton.cz autodíly", "source": "https://commons.wikimedia.org/wiki/File:Olejov%C3%BD_filtr_s_t%C4%9Bsn%C4%9Bn%C3%ADm.jpg", "license": "https://creativecommons.org/licenses/by-sa/4.0/", "label": "CC BY-SA 4.0"}, {"file": "new-spark-plug.jpg", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Sparkplug3.jpg", "title": "Sparkplug3", "author": "Ren206", "source": "https://commons.wikimedia.org/wiki/File:Sparkplug3.jpg", "license": "https://commons.wikimedia.org/wiki/File:Sparkplug3.jpg#Licensing", "label": "Public domain"}];
await mkdir('dist/assets',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of ['index.html','style.css','app.js','image-credits.html','favicon.ico'])await cp(file,'dist/'+file);
const downloaded=[];
for(const item of sources){
const response=await fetch(item.url,{headers:{'User-Agent':'TRACEROOT-Website/1.0 (https://www.traceroot.info; licensed-image-build)'},signal:AbortSignal.timeout(45000)});
if(!response.ok)throw new Error('Image download failed: '+item.file+' HTTP '+response.status);
const bytes=Buffer.from(await response.arrayBuffer());
if(bytes.length<1000||bytes.length>10000000||bytes[0]!==255||bytes[1]!==216||bytes[bytes.length-2]!==255||bytes[bytes.length-1]!==217)throw new Error('Invalid JPEG '+item.file);
await writeFile('dist/assets/'+item.file,bytes);
downloaded.push({...item,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
console.log('Bundled licensed photo: '+item.file+' ('+bytes.length+' bytes)');
}
const html=await readFile('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)){const info=await stat('dist/'+match[1].split('?')[0]);if(!info.isFile()||info.size===0)throw new Error('Missing asset '+match[1]);}
await writeFile('dist/assets/photo-sources.json',JSON.stringify(downloaded,null,2));
console.log('All page images and brochure assets verified.');
