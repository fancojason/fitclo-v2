import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
const events=[];
globalThis.window={location:{href:'https://www.fitcloo.com/products/test/',pathname:'/products/test/'},gtag:(...args)=>events.push(args)};
globalThis.document={documentElement:{lang:'en'},referrer:''};
globalThis.sessionStorage={getItem:()=>null,setItem:()=>{}};
const code=stripTypeScriptTypes(readFileSync(new URL('../src/lib/inquiry-client.ts',import.meta.url),'utf8'));
const {submitInquiry}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const [status,body,expected] of [[200,{success:true,id:'test-provider-id'},'generate_lead'],[200,{success:true},'form_submit_error'],[500,{success:false},'form_submit_error']]){
 events.length=0;globalThis.fetch=async()=>new Response(JSON.stringify(body),{status});await submitInquiry({product_code:'TEST-SKU'});assert.equal(events.length,1);assert.equal(events[0][1],expected);if(expected==='generate_lead'){assert.equal(events[0][2].form_type,'product_inquiry');assert.equal(events[0][2].page_path,'/products/test/');}
}
events.length=0;globalThis.fetch=async()=>{throw new TypeError('network');};await assert.rejects(()=>submitInquiry({}));assert.equal(events[0][1],'form_submit_error');
const whatsapp=stripTypeScriptTypes(readFileSync(new URL('../src/lib/whatsapp.ts',import.meta.url),'utf8'));
const waUrl='data:text/javascript;base64,'+Buffer.from(whatsapp).toString('base64');
const inquiryUrl='data:text/javascript;base64,'+Buffer.from(code).toString('base64');
let client=stripTypeScriptTypes(readFileSync(new URL('../src/lib/whatsapp-client.ts',import.meta.url),'utf8')).replace("'./whatsapp'",JSON.stringify(waUrl)).replace("'./inquiry-client'",JSON.stringify(inquiryUrl));
const attrs={};const card={dataset:{waProductCode:'TZ2570-4',waProductName:'Test set',waCategory:'matching-sets'}};
class Link {href='https://wa.me/8617160837538';dataset={};closest(){return card;}}
globalThis.Element=Link;globalThis.HTMLAnchorElement=Link;const link=new Link();let click;
document.documentElement.dataset=attrs;document.querySelectorAll=(selector)=>selector==='a[href]'?[link]:[];document.querySelector=()=>null;document.addEventListener=(name,fn)=>{if(name==='click')click=fn;};
const {initWhatsAppLinks}=await import('data:text/javascript;base64,'+Buffer.from(client).toString('base64'));initWhatsAppLinks();assert(decodeURIComponent(link.href).includes('TZ2570-4'));events.length=0;link.closest=(selector)=>selector==='a[href], #wa-trigger'?link:card;click({target:link});assert.equal(events[0][1],'whatsapp_click');assert.equal(events[0][2].product_code,'TZ2570-4');
console.log('PASS: confirmed acceptance only; failure paths; form type; WhatsApp SKU preserved in message and event. No live submissions sent.');
