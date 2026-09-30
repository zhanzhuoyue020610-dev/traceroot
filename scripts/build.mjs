import {mkdir,cp,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sources=[{"file":"bearing-reference.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/2/2d/Ball_bearing.jpg","title":"Ball bearing","author":"Solaris2006","source":"https://commons.wikimedia.org/wiki/File:Ball_bearing.jpg","license":"https://creativecommons.org/licenses/by-sa/3.0/","label":"CC BY-SA 3.0"},{"file":"spark-reference.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/c/c3/Spark_plugs_2.jpg","title":"Spark plugs 2","author":"Aidan Wojtas","source":"https://commons.wikimedia.org/wiki/File:Spark_plugs_2.jpg","license":"https://creativecommons.org/licenses/by-sa/2.0/","label":"CC BY-SA 2.0"},{"file":"alternator-reference.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/5/59/Alternator.jpg","title":"Alternator","author":"Angelsharum","source":"https://commons.wikimedia.org/wiki/File:Alternator.jpg","license":"https://creativecommons.org/licenses/by-sa/3.0/","label":"CC BY-SA 3.0"}];
await mkdir('dist/assets',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of ['index.html','style.css','app.js','image-credits.html'])await cp(file,'dist/'+file);
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
for(const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)){const info=await stat('dist/'+match[1]);if(!info.isFile()||info.size===0)throw new Error('Missing asset '+match[1]);}
await writeFile('dist/assets/photo-sources.json',JSON.stringify(downloaded,null,2));
console.log('All page images and brochure assets verified.');
