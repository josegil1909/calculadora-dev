import { usePersistentRef } from './usePersistence.ts';
import type { FormState, ComputedValues } from '../lib/calc.ts';

export interface ScenarioResults { form: FormState; results: ComputedValues; resultsUSD?: ComputedValues }
export interface Scenario { id:number; name:string; data: ScenarioResults }

export function useScenarioStore(snapshot: ()=>ScenarioResults|null, computeUSD:(f:FormState)=>ComputedValues|null){
  const scenarios = usePersistentRef<Scenario[]>('scenarios', ()=> []);

  for(const s of scenarios.value){
    if(!s.data.resultsUSD && s.data.results){
      try { const usd = computeUSD(s.data.form); if(usd) s.data.resultsUSD = usd; } catch {}
    }
  }

  function saveScenario(name:string){ if(!name) return; const snap = snapshot(); if(!snap) return; scenarios.value.push({ id: Date.now(), name, data: snap }); }
  function loadScenario(id:number){ return scenarios.value.find(x=>x.id===id) || null; }
  function removeScenario(id:number){ scenarios.value = scenarios.value.filter(s=> s.id!==id); }

  return { scenarios, saveScenario, loadScenario, removeScenario };
}
