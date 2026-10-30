import assert from 'node:assert/strict';
import { onRequestPost } from '../../functions/submit.js';
const original=globalThis.fetch;const results=[];
try {
 for(const value of [undefined,'','Sample','Ready Stock','Private Label','Full OEM','Not Sure Yet']) {
  const calls=[],pending=[];
  globalThis.fetch=async(url,options)=>{assert(['https://api.resend.com/emails','https://crm.example.invalid/api/crm/leads/website'].includes(String(url)));calls.push(JSON.parse(options.body));return new Response(JSON.stringify({id:'MOCK-ONLY',ok:true}),{status:200});};
  const data={name:'MOCK ONLY',email:'buyer@example.invalid',product_type:'Capri',product_code:'TZ4549-6',message:'MOCK context retained',...(value===undefined?{}:{inquiry_type:value})};
  const response=await onRequestPost({request:{headers:new Headers(),json:async()=>data},env:{RESEND_API_KEY:'mock',CRM_WEBHOOK_URL:'https://crm.example.invalid',CRM_API_SECRET:'mock'},waitUntil:p=>pending.push(p)});await Promise.all(pending);
  assert.equal(response.status,200);assert.equal(calls[1].inquiryType,value);
  assert.equal(calls[1].productCode,'TZ4549-6');assert(calls[0].html.includes('TZ4549-6') && calls[0].html.includes('MOCK context retained'));
  assert(calls[0].subject.includes(value||'Website'));assert(calls[0].html.includes(value||'Not provided'));
  results.push({input:value??'(absent)',http:response.status,emailType:value||'Not provided',crmType:calls[1].inquiryType??'(omitted)'});
 }
 // Proposal-only policy, not imported into any page.
 const choose=(entry,current,manual)=>manual?current:entry==='sample'?'Sample':'';
 assert.equal(choose('quote','Sample',false),'');assert.equal(choose('sample','',false),'Sample');
 for(const current of ['Sample','Ready Stock','Private Label','Full OEM','']) for(const entry of ['quote','sample']) assert.equal(choose(entry,current,true),current);
 console.log(JSON.stringify({mockOnly:true,backendCases:results,proposalAssertions:12},null,2));
} finally {globalThis.fetch=original;}
