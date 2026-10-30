// Local review server only. No deployment commands or production integration.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../../', import.meta.url));
const root = path.join(project, 'dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.woff2':'font/woff2', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.xml':'application/xml', '.pdf':'application/pdf', '.mp4':'video/mp4', '.json':'application/json' };
const additions = '<link rel="stylesheet" href="/css/fitclo-typography.css">';

http.createServer(async (req,res) => {
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  try {
    const url=new URL(req.url,'http://127.0.0.1:4331');
    if(url.pathname==='/__font-review.js') {
      res.setHeader('Content-Type',mime['.js']); res.setHeader('Cache-Control','no-store');
      return res.end(await readFile(new URL('./review.js',import.meta.url)));
    }
    let target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!target.startsWith(root+path.sep)&&target!==root) {res.writeHead(403);return res.end();}
    let info=await stat(target).catch(()=>null);
    if(info?.isDirectory()) {
      if(!url.pathname.endsWith('/')) {res.writeHead(302,{Location:url.pathname+'/'+url.search});return res.end();}
      target=path.join(target,'index.html');
      info=await stat(target).catch(()=>null);
    }
    if(!info?.isFile()) {res.statusCode=404;target=path.join(root,'404.html');}
    const ext=path.extname(target);
    let content=await readFile(target);
    if(ext==='.html') content=content.toString()
      .replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*href="\/fonts\/zoho-puvi-[^"]+")[^>]*>/gi,'')
      .replace('</head>',additions+'</head>');
    res.setHeader('Content-Type',mime[ext]||'application/octet-stream');
    res.setHeader('Cache-Control',ext==='.woff2'?'public, max-age=3600':'no-store');
    res.end(content);
  } catch(error) {res.statusCode=500;res.end('Local preview error');console.error(error.message);}
}).listen(4331,'127.0.0.1',()=>console.log('Poppins typography audit preview: http://127.0.0.1:4331/ (local only)'));
