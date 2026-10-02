import {mkdir,cp,readFile,stat,rm} from 'node:fs/promises';
const pages=['index.html','catalog.html','branding.html','delivery.html','tracking.html','company.html','contact.html','image-credits.html'];
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('assets','dist/assets',{recursive:true});
for(const file of [...pages,'style.css','app.js','favicon.ico'])await cp(file,'dist/'+file);
for(const page of pages){const html=await readFile('dist/'+page,'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){const ref=match[1];if(/^(?:https?:|tel:|mailto:)/.test(ref))continue;const info=await stat('dist/'+ref.replace(/^\//,''));if(!info.isFile()||!info.size)throw Error('Missing asset: '+ref);}}
console.log('Built 8 pages; all local page links and assets verified. No external image downloads.');
