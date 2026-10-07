import 'server-only';
import va from '../../../data/manual/va-compensation/2026.json';
import gi from '../../../data/manual/gi-bill/2026-2027.json';
import retirement from '../../../data/manual/retirement/current-rules.json';
export function getVaRates(){return va;}
export function getGiRules(){return gi;}
export function getRetirementRules(){return retirement;}
