// Browser-only acceptance: intercepts every fetch and stubs analytics before any submit.
export async function checkMailForm() {
 const assert=(ok,message)=>{if(!ok)throw Error(message);};
 const form=document.querySelector('form[data-product-inquiry-form],form#inquiry-form');assert(form,'form exists');
 const button=form.querySelector('[type=submit]'),status=document.querySelector('[data-product-form-status],#form-status');
 const fetchBefore=window.fetch,gtagBefore=window.gtag;let mode='failure';const requests=[],events=[];
 const count=n=>events.filter(e=>e===n).length;
 window.gtag=(command,name)=>{if(command==='event')events.push(name);};
 window.fetch=async(url,options)=>{
  assert(new URL(url,location.href).pathname==='/submit','unexpected external call blocked');requests.push(JSON.parse(options.body));await new Promise(r=>setTimeout(r,20));
  if(mode==='network')throw new TypeError('Network request failed');
  if(mode==='timeout')throw new DOMException('The request timed out. Please try again.','TimeoutError');
  return new Response(JSON.stringify(mode==='success'?{success:true,id:'MOCK-ONLY'}:{error:'We could not send your request. Please try again.'}),{status:mode==='success'?200:mode==='unavailable'?503:502,headers:{'Content-Type':'application/json'}});
 };
 const wait=async(predicate)=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,30));}throw Error('submit did not settle');};
 try{
  for(const e of form.querySelectorAll('input,textarea')){
   if(e.type==='hidden'||e.name==='website'||e.type==='file'||e.type==='radio')continue;
   if(e.type==='checkbox'){if(e.required)e.checked=true;continue;}
   if(e.required||['name','email','message'].includes(e.name))e.value=e.type==='email'?'buyer@example.invalid':'MOCK ONLY';
  }
  for(const s of form.querySelectorAll('select[required]')){const o=[...s.options].find(o=>o.value&&!o.disabled);if(o)s.value=o.value;}
  const email=form.querySelector('[name=email]');assert(email,'email control');email.value='not-valid';form.requestSubmit();assert(requests.length===0,'invalid email blocked');email.value='buyer@example.invalid';
  const startName=form.querySelector('[name=name]').value;
  for(const failure of ['failure','unavailable','network','timeout']){
   mode=failure;const before=requests.length;button.click();button.click();await wait(()=>requests.length===before+1&&!button.disabled);
   assert(requests.length===before+1,'rapid click sends once');assert(form.querySelector('[name=name]').value===startName,'failure retains input');assert(status.textContent.trim(),'visible failure message');assert(count('generate_lead')===0&&count('quote_form_submit')===0,'failure not successful');
  }
  mode='success';button.click();await wait(()=>count('generate_lead')===1);await wait(()=>form.querySelector('[name=name]').value==='');
  assert(count('quote_form_submit')===1,'success events exactly once');
  const type=form.querySelector('select[name=inquiry_type]');if(type)assert(type.value==='Sample','production Sample behavior retained');

  return {url:location.href,language:document.documentElement.lang,width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,mockOnly:true,failureCases:4,retryAndRetention:true,rapidClicksSingleRequest:true,invalidEmailBlocked:true,requests:requests.length,successEvents:{generate_lead:count('generate_lead'),quote_form_submit:count('quote_form_submit')},sample:type?.value??'not-applicable'};
 }finally{window.fetch=fetchBefore;window.gtag=gtagBefore;}
}
