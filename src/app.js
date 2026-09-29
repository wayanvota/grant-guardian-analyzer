import {VERSION,FIELDS,SCENARIOS,blankState,parseAmount,analyze,validateScenario,exportState,importState,sampleState,componentScore} from './model.js';
let state=blankState(), step=1, dirty=false, pendingReplacement=null;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=(n,digits=2)=>n===null?'Unavailable':Number(n).toLocaleString(undefined,{maximumFractionDigits:digits});
const money=n=>n===null?'Unknown':`${state.currency==='Other'?'units':state.currency} ${number(n)}`;
const announce=message=>$('status').textContent=message;
function changed(){dirty=true;}
function clearConfirmations(){for(const entry of Object.values(state.entries))entry.confirmed=false;for(const f of FIELDS){const c=$(`confirmed-${f.id}`);if(c)c.checked=false;}}
function mountFields(){
  let group='';
  $('fields').innerHTML=FIELDS.map(f=>{
    const heading=group!==f.group?`<div class="group-title"><h3>${f.group}</h3><span class="small-label">${f.group==='Position'?'At period end':f.group==='Reserves'?'Available resources':'Funding context'}</span></div>`:'';group=f.group;
    const hint=state.formYear==='2025'?f.hint:'Use the matching financial statement, notes, or schedule. Verify the definition and accounting presentation for this reporting year.';
    const e=state.entries[f.id];
    return `${heading}<div class="field-row"><div><label class="field-title" for="value-${f.id}">${f.label}${f.optional?'<span class="optional">Optional</span>':''}</label><p class="field-help" id="help-${f.id}">${hint}</p></div><div class="field-controls"><input class="amount" id="value-${f.id}" type="number" step="any" ${f.signed?'':'min="0"'} placeholder="Unknown" value="${esc(e.value)}" aria-describedby="help-${f.id}"><label for="source-${f.id}">Page / note / schedule<input id="source-${f.id}" maxlength="400" placeholder="e.g. p. 6, Note 3" value="${esc(e.source)}"></label><label class="check-label"><input type="checkbox" id="confirmed-${f.id}" ${e.confirmed?'checked':''}><span>I checked this figure against the source</span></label></div></div>`;
  }).join('');
  for(const f of FIELDS){
    const e=state.entries[f.id], check=$(`confirmed-${f.id}`);
    for(const key of ['value','source']) $(`${key}-${f.id}`).addEventListener('input',event=>{e[key]=event.target.value;e.confirmed=false;check.checked=false;changed();});
    check.addEventListener('change',()=>{
      if(check.checked&&(!Number.isFinite(parseAmount(e.value))||!e.source.trim())){check.checked=false;announce(`Enter ${f.label.toLowerCase()} and a source reference before confirming it.`);}
      e.confirmed=check.checked;changed();
    });
  }
}
function mountSettings(){
  $('scenario-choices').innerHTML=Object.entries(SCENARIOS).map(([key,s])=>`<button class="scenario" data-scenario="${key}" aria-pressed="${state.scenarioKey===key}">${s.name}<small>${s.current}× current · ${s.reserve} mo. reserves</small></button>`).join('');
  document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{state.scenarioKey=button.dataset.scenario;state.scenario=structuredClone(SCENARIOS[state.scenarioKey]);mountSettings();changed();}));
  for(const key of ['current','reserve','restriction'])$(`threshold-${key}`).value=state.scenario[key];
  state.scenario.weights.forEach((w,i)=>$(`weight-${i}`).value=w);
  $('showScore').checked=state.showScore;
  $('scenario-note').value=state.scenarioNote;
  renderSettingFeedback();
}
function renderSettingFeedback(){
  const published=[.5,1].includes(state.scenario.current);
  $('parameter-origin').textContent=`${state.scenarioKey==='custom'?'Custom settings. ':''}${published?'This current-ratio threshold matches a published PJMF example.':'This current-ratio threshold is a simulator assumption or your own setting.'} Reserve and restriction thresholds, weights, and score formulas are simulator assumptions unless you document another source below.`;
  $('weights').hidden=!state.showScore;
  $('weight-total').textContent=`Total weight: ${number(state.scenario.weights.reduce((a,b)=>a+b,0),6)}%`;
  const errors=validateScenario(state.scenario);
  $('setting-errors').innerHTML=errors.length?box(errors,'Check your assumptions','error-box'):'';
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(state.scenarioKey===b.dataset.scenario)));
}
const box=(items,title,klass='notice-box')=>`<div class="${klass}"><b>${esc(title)}</b><ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`;
const names=['Current ratio','Reserve coverage','Restricted net assets'];
const units=['×','months','%'];
const ratioText=(r,i)=>r.value===null?'Unavailable':`${number(r.value)}${i===1?' months':units[i]}`;
const statusText=r=>r.meets===null?'Not evaluated':!r.confirmed?(r.meets?'Meets setting · unverified':'Outside setting · unverified'):(r.meets?'Meets setting':'Outside setting');
function renderReport(){
  const a=analyze(state), date=new Date();
  $('report-subtitle').textContent=`${state.organization||'Unnamed organization'} · Period ending ${state.fiscalEnd||'not entered'} · ${state.months} months · ${state.currency==='Other'?'Unspecified currency':state.currency}`;
  const formulas=[`Current assets ${money(a.values.currentAssets)} ÷ current liabilities ${money(a.values.currentLiabilities)}.`,`(${money(a.values.unrestrictedCash)} cash + ${money(a.values.liquidInvestments)} investments) ÷ (${money(a.values.totalExpenses)} expenses ÷ ${state.months} months).`,`Donor-restricted net assets ${money(a.values.restrictedNetAssets)} ÷ total net assets ${money(a.net)} × 100. Total net assets = total assets minus liabilities.`];
  const checks=[...a.errors,...a.settingsErrors];
  const needsMetadata=!state.document.trim()||!state.fiscalEnd;
  const dataComplete=a.missing.length===0;
  let html=`<div class="completeness"><strong>${a.verified} / ${a.required}</strong><div><b>Required figures confirmed with references</b><p>${dataComplete?'All required amounts entered.':'Unknown amounts remain unknown.'} ${needsMetadata?'Add the document title and fiscal date to complete verification.':'Document and period identified.'} ${a.ratios.every(r=>r.confirmed)&&checks.length===0?'Ratios have confirmed inputs.':'Treat unverified calculations as provisional.'}</p></div></div>`;
  if(checks.length)html+=box(checks,'Resolve these inconsistencies before relying on the report','error-box');
  if(a.notices.length)html+=box(a.notices,'Questions for review');
  html+=`<div class="metric-grid">${a.ratios.map((r,i)=>`<article class="metric"><h3>${names[i]}</h3><div class="number">${r.value===null?'—':number(r.value)} <small>${r.value===null?'unavailable':units[i]}</small></div><span class="tag ${r.meets===null?'':r.meets?'met':'review'}">${statusText(r)}</span><p>${esc(r.reason||formulas[i])}</p><p>Selected setting: ${i===2?'at most':'at least'} ${esc([state.scenario.current,state.scenario.reserve,state.scenario.restriction][i])} ${units[i]}.</p></article>`).join('')}</div>`;
  html+=`<section class="report-section"><h3>Rule-based summary</h3><p>${a.ratios.map((r,i)=>r.value===null?`${names[i]} is unavailable. ${r.reason}`:`${names[i]} is ${ratioText(r,i)} and ${r.meets===null?'cannot be evaluated until the flagged issues are resolved':r.meets?'meets the selected setting':'falls outside the selected setting'}${r.confirmed?'':' using unverified inputs'}.`).map(esc).join(' ')}</p><p>These indicators describe liquidity and restrictions under explicit assumptions. They do not establish organizational quality or predict a funding decision.</p></section>`;
  html+=`<section class="report-section"><h3>Source and verification record</h3><p>Document: <b>${esc(state.document||'Not identified')}</b>. ${state.formYear==='2025'?'Guidance: 2025 Form 990 and statements.':'Guidance: other year or presentation; verify against your source.'} References below were supplied by the user. This tool does not inspect documents.</p><div class="table-wrap" role="region" aria-label="Source figures" tabindex="0"><table><thead><tr><th scope="col">Figure</th><th scope="col">Amount</th><th scope="col">Source reference</th><th scope="col">User check</th></tr></thead><tbody>${FIELDS.map(f=>{const e=state.entries[f.id];return `<tr><th scope="row">${f.label}</th><td>${esc(money(a.values[f.id]))}</td><td>${esc(e.source||'Not provided')}</td><td>${e.confirmed&&e.source.trim()&&Number.isFinite(a.values[f.id])?'Confirmed':'Unverified'}</td></tr>`;}).join('')}</tbody></table></div></section>`;
  if(state.showScore){
    const thresholds=[state.scenario.current,state.scenario.reserve,state.scenario.restriction];
    html+=`<section class="index-box" aria-labelledby="score-heading"><h3 id="score-heading">Illustrative score under these settings</h3><div class="number">${a.score===null?'Unavailable':`${number(a.score,1)} / 100`}</div><p>This optional score combines the three ratios using the settings below. It is not PJMF’s score, a validated financial-health assessment, or a prediction of funding.</p>${a.score===null?'<p>Every required figure must have a value, source reference, and confirmation; document title and fiscal date must be present; all ratios and settings must be valid and figures must reconcile. No score is substituted for missing or unverified data.</p>':''}<div class="table-wrap" role="region" aria-label="Score calculation" tabindex="0"><table class="comparison"><thead><tr><th scope="col">Ratio</th><th scope="col">Value</th><th scope="col">Threshold</th><th scope="col">Component / 100</th><th scope="col">Weight</th><th scope="col">Points contributed</th></tr></thead><tbody>${a.ratios.map((r,i)=>{const component=a.score===null?null:componentScore(r.value,thresholds[i],i===2?'lower':'higher');return `<tr><th scope="row">${names[i]}</th><td>${ratioText(r,i)}</td><td>${i===2?'≤':'≥'} ${esc(number(thresholds[i]))} ${units[i]}</td><td>${number(component,2)}</td><td>${esc(number(state.scenario.weights[i]))}%</td><td>${number(component===null?null:component*state.scenario.weights[i]/100,2)}</td></tr>`;}).join('')}</tbody></table></div><p><b>Calculation:</b> For current ratio and reserves, component = 70 × value ÷ threshold. For restrictions, component = 100 − 30 × value ÷ threshold. Each component is capped between 0 and 100. At a zero restriction threshold, the component is 100 for zero restrictions and 0 otherwise. Points contributed = component × weight ÷ 100; the score is the sum of those points.</p><p>The formulas, weights, and the choice to assign 70 at a threshold are simulator assumptions. Displayed values are rounded; the calculation uses full precision. Compare the scenarios below to see how different assumptions change the score.</p></section>`;
  }
  html+=`<section class="report-section"><h3>How assumptions change the reading</h3><p>The same figures are shown against each scenario. A changed setting changes the comparison, not the underlying finances. All example scenarios below are simulator assumptions except the published 1.0 and 0.5 current-ratio examples.</p><div class="table-wrap" role="region" aria-label="Scenario comparison" tabindex="0"><table class="comparison"><thead><tr><th scope="col">Scenario</th><th scope="col">Current ratio</th><th scope="col">Reserve coverage</th><th scope="col">Restrictions</th>${state.showScore?'<th scope="col">Illustrative score / 100</th>':''}</tr></thead><tbody>${[['selected',{...state.scenario,name:'Your selected settings'}],...Object.entries(SCENARIOS)].map(([key,s])=>{const result=analyze(state,s);return `<tr ${key==='selected'?'class="selected-row"':''}><th scope="row">${esc(s.name)}<small>Weights: ${s.weights.map(w=>esc(number(w))).join(' / ')}%</small></th>${result.ratios.map((r,i)=>`<td>${statusText(r)}<small>${i===2?'≤':'≥'} ${esc([s.current,s.reserve,s.restriction][i])} ${units[i]}</small></td>`).join('')}${state.showScore?`<td>${result.score===null?'Unavailable':number(result.score,1)}</td>`:''}</tr>`;}).join('')}</tbody></table></div>${state.scenarioNote?`<p class="context-copy">${esc(state.scenarioNote)}</p>`:''}</section>`;
  const prompts=[];
  if(a.ratios[0].value!==null)prompts.push('When do current liabilities fall due, and how collectible are the receivables included in current assets?');
  if(a.ratios[1].value!==null)prompts.push('Does average spending reflect the months ahead? What restrictions, seasonality, or planned reserve use change the cash picture?');
  if(a.ratios[2].value!==null)prompts.push('When will restrictions be released, and what share of restricted awards supports future commitments?');
  if(prompts.length)html+=`<section class="report-section"><h3>Bring these questions to the conversation</h3><ul>${prompts.map(p=>`<li>${p}</li>`).join('')}</ul></section>`;
  html+=`<section class="report-section"><h3>Organization context</h3><p class="context-copy">${esc(state.notes||'No context notes provided.')}</p></section>`;
  html+=`<div class="report-footnote"><p>Grant Guardian v${VERSION} · Created ${esc(date.toLocaleString())} · Currency: ${esc(state.currency)} (no conversion) · Period: ${esc(state.months)} months ending ${esc(state.fiscalEnd||'not entered')}.</p><p>Independent tool by Wayan Vota. Not affiliated with PJMF. Manual inputs and deterministic calculations; no AI extraction or generated analysis.</p><p>Method source: <a href="https://www.mcgovern.org/our-work/data-solutions/grant-guardian/">PJMF’s public Grant Guardian documentation</a>. Reviewed September 29, 2026. Example thresholds and the optional score do not reproduce a particular funder’s assessment.</p></div>`;
  $('report-content').innerHTML=html;
}
function goStep(next,focus=true){
  step=next;
  for(let i=1;i<=3;i++)$(`step-${i}`).hidden=i!==next;
  document.querySelectorAll('[data-step]').forEach(button=>{const active=Number(button.dataset.step)===next;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  if(next===3)renderReport();
  if(focus){$(`title-${next}`).focus({preventScroll:true});document.querySelector('.workspace').scrollIntoView({behavior:'instant',block:'start'});}
}
function mount(){
  for(const id of ['organization','fiscalEnd','months','currency','document','formYear','notes'])$(id).value=state[id];
  mountFields();mountSettings();if(step===3)renderReport();
}
function replaceWith(next,message){
  const apply=()=>{state=next;dirty=true;mount();goStep(1);announce(message);};
  if(dirty){pendingReplacement=apply;$('replace-dialog').showModal();}else apply();
}
for(const id of ['organization','fiscalEnd','months','currency','document','notes'])$(id).addEventListener('input',event=>{state[id]=id==='months'?Number(event.target.value):event.target.value;if(['fiscalEnd','months','currency','document'].includes(id))clearConfirmations();changed();});
$('formYear').addEventListener('change',event=>{state.formYear=event.target.value;clearConfirmations();mountFields();changed();});
for(const key of ['current','reserve','restriction'])$(`threshold-${key}`).addEventListener('input',event=>{state.scenario[key]=event.target.value===''?NaN:Number(event.target.value);state.scenarioKey='custom';state.scenario.name='Custom';renderSettingFeedback();changed();});
for(let i=0;i<3;i++)$(`weight-${i}`).addEventListener('input',event=>{state.scenario.weights[i]=event.target.value===''?NaN:Number(event.target.value);state.scenarioKey='custom';state.scenario.name='Custom';renderSettingFeedback();changed();});
$('showScore').addEventListener('change',event=>{state.showScore=event.target.checked;renderSettingFeedback();changed();});
$('scenario-note').addEventListener('input',event=>{state.scenarioNote=event.target.value;changed();});
document.querySelectorAll('[data-step],[data-next]').forEach(button=>button.addEventListener('click',()=>goStep(Number(button.dataset.step||button.dataset.next))));
$('sample').addEventListener('click',()=>replaceWith(sampleState(),'Fictional example loaded. Demo figures are unverified and should not be treated as evidence.'));
$('cancel-replace').addEventListener('click',()=>{$('replace-dialog').close();pendingReplacement=null;});
$('confirm-replace').addEventListener('click',()=>{$('replace-dialog').close();pendingReplacement?.();pendingReplacement=null;});
$('replace-dialog').addEventListener('cancel',()=>{pendingReplacement=null;});
$('import').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>500000)throw new Error('Choose a Grant Guardian export smaller than 500 KB.');const next=importState(await file.text());replaceWith(next,'Saved analysis opened locally. Check its source references before relying on it.');}catch(error){announce(`Could not open analysis: ${error.message}`);}finally{event.target.value='';}});
$('export').addEventListener('click',()=>{
  if(validateScenario(state.scenario).length){announce('Correct the scenario settings before saving so your file can be reopened.');return;}
  if(!Number.isFinite(state.months)||state.months<=0||state.months>24){announce('Correct the period length before saving.');return;}
  try{importState(exportState(state));}catch(error){announce(`Correct the inputs before saving: ${error.message}`);return;}
  const url=URL.createObjectURL(new Blob([exportState(state)],{type:'application/json'})), link=document.createElement('a');
  link.href=url;link.download=`grant-guardian-${new Date().toISOString().slice(0,10)}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;announce('Analysis exported as a local JSON file. It contains the financial figures and notes you entered.');
});
$('print').addEventListener('click',()=>{renderReport();window.print();});
window.addEventListener('beforeprint',renderReport);
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
mount();
