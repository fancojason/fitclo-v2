import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from './submit.js';
import {createMockFailureAlert} from '../scripts/mail-alert-prototype.mjs';
test('isolated provider matrix, validation, privacy and unchanged acceptance contract',async()=>{
 const savedFetch=globalThis.fetch,savedError=console.error;const pii='private-buyer@example.invalid';
 try {
  for(const scenario of [401,403,429,500,502,'timeout','network','missing-id','success','crm-failure','empty-type','missing-name','missing-contact','no-config']){
   const calls=[],logs=[],background=[];console.error=(...a)=>logs.push(a.join(' '));
   globalThis.fetch=async(url,options)=>{
    assert(['https://api.resend.com/emails','https://crm.example.invalid/api/crm/leads/website'].includes(String(url)));calls.push({url:String(url),data:JSON.parse(options.body)});
    if(String(url).includes('crm.example.invalid'))return new Response('{}',{status:scenario==='crm-failure'?503:200});
    if(scenario==='timeout')throw new DOMException(pii,'TimeoutError');
    if(scenario==='network')throw new TypeError(pii);
    if(typeof scenario==='number')return new Response(JSON.stringify({error:pii}),{status:scenario});
    return new Response(JSON.stringify(scenario==='missing-id'?{}:{id:'MOCK-ID'}),{status:200});
   };
   const data={name:scenario==='missing-name'?'':'MOCK ONLY',email:scenario==='missing-contact'?'':pii,product_type:'Yoga',product_code:'TZ4549-6',message:'MOCK BODY',inquiry_type:scenario==='empty-type'?'':'Private Label'};
   const response=await onRequestPost({request:{headers:new Headers(),json:async()=>data},env:{...(scenario==='no-config'?{}:{RESEND_API_KEY:'mock'}),CRM_WEBHOOK_URL:'https://crm.example.invalid',CRM_API_SECRET:'mock'},waitUntil:p=>background.push(p)});await Promise.all(background);
   const expected=['missing-name','missing-contact'].includes(scenario)?400:scenario==='no-config'?503:['timeout','network'].includes(scenario)?500:typeof scenario==='number'||scenario==='missing-id'?502:200;
   assert.equal(response.status,expected,scenario);const body=await response.json();assert.equal(Boolean(body.success),expected===200,scenario);
   assert(!JSON.stringify(logs).includes(pii),'private content in error log');assert(!JSON.stringify(body).includes(pii),'private exception in response');
   if(expected===200){assert.equal(body.id,'MOCK-ID');assert(calls[0].data.html.includes('TZ4549-6'));assert(calls[0].data.html.includes('MOCK BODY'));assert.equal(calls[1].data.inquiryType,data.inquiry_type);}
   if(expected===400||expected===503)assert.equal(calls.length,0);else if(expected!==200)assert.equal(calls.length,1);
   if(scenario==='timeout')assert(logs.join('').includes('timeout'));
   if(scenario===401||scenario===403)assert(logs.join('').includes('authorization'));
   if(scenario===429)assert(logs.join('').includes('rate_limit'));
  }
 } finally {globalThis.fetch=savedFetch;console.error=savedError;}
});
test('disabled-by-default mock alert strips PII, suppresses repeats and isolates sink failure',async()=>{
 const events=[];let time=0;const event={stage:'email',category:'authorization',provider_status:401,email:'PRIVATE',message:'PRIVATE'};
 assert.equal((await createMockFailureAlert({sink:e=>events.push(e)})(event)).state,'disabled');assert.equal(events.length,0);
 const alert=createMockFailureAlert({enabled:true,sink:e=>events.push(e),now:()=>time});assert.equal((await alert(event)).state,'mock_recorded');assert.equal((await alert(event)).state,'suppressed');assert(!JSON.stringify(events).includes('PRIVATE'));
 time=300001;assert.equal((await alert(event)).state,'mock_recorded');assert.equal(events.length,2);
 assert.equal((await createMockFailureAlert({enabled:true,sink:()=>{throw Error('PRIVATE');}})(event)).state,'sink_failed');
});
