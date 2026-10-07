/** Expected effective-date rollover, not a claim that a future table is published. */
export function nextUpdate(dataset:string,period:string):string|null{
 if(dataset.startsWith('per-diem')){const year=Number(period.replace('FY',''));return Number.isFinite(year)?`${year}-10-01`:null;}
 if(dataset==='va-compensation')return /^\d{4}$/.test(period)?`${period}-12-01`:null;
 if(dataset==='gi-bill'){const year=Number(period.split('-')[1]);return Number.isFinite(year)?`${year}-08-01`:null;}
 if(['bah','military-pay','basic-pay','bas','pcs','tax','fica'].includes(dataset)&&/^\d{4}$/.test(period))return `${Number(period)+1}-01-01`;
 return null;
}
