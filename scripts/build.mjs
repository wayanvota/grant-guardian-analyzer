import {readFile,mkdir,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const [html,css,model,app]=await Promise.all(['src/index.html','src/style.css','src/model.js','src/app.js'].map(p=>readFile(new URL(p,root),'utf8')));
const bundle=model.replace(/^export /gm,'')+'\n'+app.replace(/^import .*?;\n/,'');
const result=html.replace('<link rel="stylesheet" href="style.css">',()=>`<style>\n${css}\n</style>`).replace('<script type="module" src="app.js"></script>',()=>`<script type="module">\n${bundle.replace(/<\/script/gi,'<\\/script')}\n</script>`);
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/grant-guardian-analyzer.html',root),result);
console.log('Built dist/grant-guardian-analyzer.html (standalone; no external runtime dependencies).');
