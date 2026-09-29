export const VERSION = '2.0.3';
export const FIELDS = [
  {id:'currentAssets', label:'Current assets', group:'Position', hint:'Use the classified balance sheet. Form 990 does not give a single current-assets total.'},
  {id:'currentLiabilities', label:'Current liabilities', group:'Position', hint:'Use the classified balance sheet. Form 990 does not give a single current-liabilities total.'},
  {id:'totalAssets', label:'Total assets', group:'Position', hint:'2025 Form 990, Part X, line 16, end-of-year column.'},
  {id:'totalLiabilities', label:'Total liabilities', group:'Position', hint:'2025 Form 990, Part X, line 26, end-of-year column.'},
  {id:'unrestrictedCash', label:'Unrestricted cash', group:'Reserves', hint:'Verify availability and donor restrictions in the notes. Part X, lines 1–2 alone do not establish unrestricted cash.'},
  {id:'liquidInvestments', label:'Available liquid investments', group:'Reserves', hint:'Use investment schedules. Include only liquid, unrestricted amounts, and exclude cash already entered above.'},
  {id:'totalExpenses', label:'Total expenses for this period', group:'Reserves', hint:'2025 Form 990, Part IX, line 25, column A. Use the same period length entered above.'},
  {id:'restrictedNetAssets', label:'Net assets with donor restrictions', group:'Restrictions', hint:'2025 Form 990, Part X, line 28, where applicable. Otherwise use the statements and notes.', signed:true},
  {id:'unrestrictedNetAssets', label:'Net assets without donor restrictions', group:'Restrictions', hint:'Optional reconciliation check. 2025 Form 990, Part X, line 27, where applicable.', signed:true, optional:true},
  {id:'totalRevenue', label:'Total revenue for this period', group:'Restrictions', hint:'Optional context. 2025 Form 990, Part VIII, line 12, column A.', signed:true, optional:true},
];
export const SCENARIOS = {
  reference:{name:'Reference', current:1, reserve:3, restriction:60, weights:[35,40,25]},
  lower:{name:'Lower liquidity', current:.5, reserve:1.5, restriction:75, weights:[30,45,25]},
  middle:{name:'Middle', current:.75, reserve:2, restriction:70, weights:[35,40,25]},
};
export function blankState() {
  return {schemaVersion:1, appVersion:VERSION, organization:'', fiscalEnd:'', months:12, currency:'USD', document:'', formYear:'2025', notes:'', scenarioNote:'', showScore:false, scenarioKey:'reference', scenario:structuredClone(SCENARIOS.reference), entries:Object.fromEntries(FIELDS.map(f=>[f.id,{value:'',source:'',confirmed:false}]))};
}
export function parseAmount(value) {
  if (value === '' || value === null || value === undefined || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}
export function validateScenario(s) {
  const errors=[];
  if(!Number.isFinite(s.current)||s.current<=0) errors.push('Current-ratio threshold must be greater than zero.');
  if(!Number.isFinite(s.reserve)||s.reserve<=0) errors.push('Reserve threshold must be greater than zero.');
  if(!Number.isFinite(s.restriction)||s.restriction<0||s.restriction>100) errors.push('Restriction threshold must be between 0 and 100%.');
  if(!Array.isArray(s.weights)||s.weights.length!==3||s.weights.some(w=>!Number.isFinite(w)||w<0||w>100)||Math.abs(s.weights.reduce((a,b)=>a+b,0)-100)>.000001) errors.push('Each weight must be between 0 and 100, and weights must total exactly 100%.');
  return errors;
}
const bound=n=>Math.min(100,Math.max(0,n));
export function componentScore(value, threshold, direction) {
  if(!Number.isFinite(value)||!Number.isFinite(threshold)||value<0||threshold<0) return null;
  if(direction==='higher') return threshold>0 ? bound(70*value/threshold) : null;
  return threshold===0 ? (value===0?100:0) : bound(100-30*value/threshold);
}
export function analyze(state, scenario=state.scenario) {
  const values=Object.fromEntries(FIELDS.map(f=>[f.id,parseAmount(state.entries[f.id]?.value)]));
  const errors=[], notices=[], settingsErrors=validateScenario(scenario);
  const known=id=>Number.isFinite(values[id]);
  for(const f of FIELDS) {
    if(Number.isNaN(values[f.id])||(known(f.id)&&!f.signed&&values[f.id]<0)) errors.push(`${f.label} must be a valid ${f.signed?'':'nonnegative '}number.`);
  }
  const months=Number(state.months);
  if(!Number.isFinite(months)||months<=0||months>24) errors.push('Period length must be greater than zero and no more than 24 months.');
  const compare=(a,b,message)=>{if(known(a)&&known(b)&&values[a]>values[b]) errors.push(message);};
  compare('currentAssets','totalAssets','Current assets exceed total assets. Check that both figures use the same date.');
  compare('currentLiabilities','totalLiabilities','Current liabilities exceed total liabilities. Check the source figures.');
  if(known('unrestrictedCash')&&known('liquidInvestments')&&known('totalAssets')&&values.unrestrictedCash+values.liquidInvestments>values.totalAssets) errors.push('Available cash and investments exceed total assets. Check for double counting.');
  const net=known('totalAssets')&&known('totalLiabilities') ? values.totalAssets-values.totalLiabilities : null;
  if(net!==null&&net<=0) notices.push('Total net assets are zero or negative. The restriction ratio and illustrative index are unavailable. Review the balance sheet with the organization; this is not a funding decision.');
  if(net!==null&&known('restrictedNetAssets')&&known('unrestrictedNetAssets')&&Math.abs(net-values.restrictedNetAssets-values.unrestrictedNetAssets)>1) errors.push('Net-asset categories do not reconcile to total assets minus total liabilities (tolerance: 1 currency unit).');
  if(known('restrictedNetAssets')&&values.restrictedNetAssets<0) notices.push('Donor-restricted net assets are negative. Review the accounting presentation before interpreting a restriction ratio.');
  if(known('totalRevenue')&&known('totalExpenses')&&values.totalExpenses>values.totalRevenue) notices.push('Expenses exceed revenue for this period. Discuss planned reserve use, award timing, and one-time costs before interpreting the difference.');
  function ratio(ids, compute, unavailable) {
    const missing=ids.filter(id=>!known(id));
    if(missing.length) return {value:null, confirmed:false, reason:`Missing or invalid: ${missing.map(id=>FIELDS.find(f=>f.id===id).label.toLowerCase()).join(', ')}.`};
    if(ids.some(id=>!FIELDS.find(f=>f.id===id).signed&&values[id]<0)) return {value:null,confirmed:false,reason:'Correct negative inputs first.'};
    const computed=compute();
    const result=Number.isFinite(computed)?computed:null;
    return {value:result,confirmed:result!==null&&Boolean(state.document.trim())&&Boolean(state.fiscalEnd)&&ids.every(id=>state.entries[id].confirmed&&state.entries[id].source.trim()),reason:result===null?unavailable:''};
  }
  const ratios=[
    ratio(['currentAssets','currentLiabilities'],()=>values.currentLiabilities>0?values.currentAssets/values.currentLiabilities:null,'Current liabilities are zero. A conventional current ratio cannot be calculated.'),
    ratio(['unrestrictedCash','liquidInvestments','totalExpenses'],()=>values.totalExpenses>0&&months>0&&months<=24?(values.unrestrictedCash+values.liquidInvestments)/(values.totalExpenses/months):null,'Positive expenses and a valid period length are needed for reserve coverage.'),
    ratio(['totalAssets','totalLiabilities','restrictedNetAssets'],()=>net>0&&values.restrictedNetAssets>=0?values.restrictedNetAssets/net*100:null,'Positive total net assets and nonnegative restricted net assets are needed for this ratio.'),
  ];
  if(ratios[2].value>100) notices.push('Restrictions exceed 100% of total net assets. This can occur when net assets without donor restrictions are negative. Check the reconciliation and discuss availability of funds.');
  const thresholds=[scenario.current,scenario.reserve,scenario.restriction];
  ratios.forEach((r,i)=>{r.meets=r.value===null||settingsErrors.length||errors.length?null:i===2?r.value<=thresholds[i]:r.value>=thresholds[i];});
  const missing=FIELDS.filter(f=>!f.optional&&!known(f.id)).map(f=>f.id);
  const verified=FIELDS.filter(f=>!f.optional&&known(f.id)&&state.entries[f.id].confirmed&&state.entries[f.id].source.trim()).length;
  const canScore=errors.length===0&&settingsErrors.length===0&&ratios.every(r=>r.value!==null&&r.confirmed);
  const score=canScore?ratios.reduce((sum,r,i)=>sum+componentScore(r.value,thresholds[i],i===2?'lower':'higher')*scenario.weights[i]/100,0):null;
  return {values,ratios,net,errors,notices,settingsErrors,missing,verified,required:FIELDS.filter(f=>!f.optional).length,score};
}
export function exportState(state) { return JSON.stringify({...state,appVersion:VERSION,exportedAt:new Date().toISOString()},null,2); }
export function importState(text) {
  if(text.length>500000) throw new Error('File is too large. Choose a Nonprofit Ratio Explorer JSON export smaller than 500 KB.');
  const data=JSON.parse(text), state=blankState();
  if(!data||data.schemaVersion!==1||!data.entries||!data.scenario) throw new Error('This is not a supported Nonprofit Ratio Explorer export.');
  for(const key of ['organization','fiscalEnd','currency','document','formYear','notes']) {
    if(typeof data[key]!=='string'||data[key].length>10000) throw new Error(`Invalid ${key} in the export.`);
    state[key]=data[key];
  }
  if(!['USD','EUR','GBP','CAD','AUD','Other'].includes(state.currency)) throw new Error('Unsupported currency label.');
  if(state.fiscalEnd&&!/^\d{4}-\d{2}-\d{2}$/.test(state.fiscalEnd)) throw new Error('Invalid fiscal period end.');
  if(!['2025','other'].includes(state.formYear)) throw new Error('Unsupported source guidance.');
  if(typeof data.months!=='number'||!Number.isFinite(data.months)||data.months<=0||data.months>24) throw new Error('Invalid period length.');
  state.months=data.months;
  state.scenario={name:'Imported settings',current:data.scenario.current,reserve:data.scenario.reserve,restriction:data.scenario.restriction,weights:data.scenario.weights};
  if(validateScenario(state.scenario).length) throw new Error('Invalid scenario settings in the export.');
  state.scenarioKey='custom'; state.showScore=data.showScore===true;
  if(data.scenarioNote!==undefined&&(typeof data.scenarioNote!=='string'||data.scenarioNote.length>10000)) throw new Error('Invalid assumption notes.');
  state.scenarioNote=data.scenarioNote||'';
  for(const f of FIELDS) {
    const entry=data.entries[f.id];
    if(!entry||typeof entry.source!=='string'||entry.source.length>10000||!['string','number'].includes(typeof entry.value)||String(entry.value).length>100||Number.isNaN(parseAmount(entry.value))) throw new Error(`Invalid ${f.label} in the export.`);
    if(parseAmount(entry.value)!==null&&!f.signed&&parseAmount(entry.value)<0) throw new Error(`Invalid negative ${f.label}.`);
    state.entries[f.id]={value:String(entry.value),source:entry.source,confirmed:entry.confirmed===true};
  }
  return state;
}
export function sampleState() {
  const s=blankState(); Object.assign(s,{organization:'Example Community Foundation (fictional)',fiscalEnd:'2025-12-31',document:'Fictional statements for demonstration',notes:'Example only. An award is restricted to next year’s program; discuss its release schedule before interpreting available resources.'});
  const vals=[240000,120000,850000,250000,180000,60000,960000,360000,240000,1000000];
  FIELDS.forEach((f,i)=>s.entries[f.id]={value:String(vals[i]),source:'Demo figure, not evidence',confirmed:false});
  return s;
}
