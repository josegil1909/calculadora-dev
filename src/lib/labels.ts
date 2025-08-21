import { useI18n } from 'vue-i18n';

export function useLabelMaps(){
  const { t } = useI18n();
  const optionMaps: Record<string, Record<string,string>> = {
    role: { frontend:'optRoleFrontend', backend:'optRoleBackend', fullstack:'optRoleFullstack', uiux:'optRoleUiux', pm:'optRolePm' },
    marketLevel: { local:'optMarketLocal', nearshore:'optMarketNearshore', 'us-eu':'optMarketUsEu', premium:'optMarketPremium' },
    complexity: { low:'optComplexityLow', medium:'optComplexityMedium', high:'optComplexityHigh', 'very-high':'optComplexityVeryHigh' },
    risk: { low:'optRiskLow', medium:'optRiskMedium', high:'optRiskHigh' },
    businessValue: { low:'optValueLow', medium:'optValueMedium', high:'optValueHigh', critical:'optValueCritical' }
  };

  function multiplierLabel(group:string, value:string){
    const map = optionMaps[group];
    if(map && map[value]) return t(map[value] as any) || value;
    return value;
  }

  function groupLabel(key:string){
    const groupMap: Record<string,string> = {
      role:'role', marketLevel:'marketLevel', complexity:'complexity', risk:'risk', businessValue:'businessValue'
    };
    return t(groupMap[key] as any) || key;
  }

  function multiplierGroupTip(key:string){
    const tipMap: Record<string,string> = {
      role:'tipGroupRole', marketLevel:'tipGroupMarket', complexity:'tipGroupComplexity', risk:'tipGroupRisk', businessValue:'tipGroupBusinessValue'
    };
    return t(tipMap[key] as any) || '';
  }

  return { multiplierLabel, groupLabel, multiplierGroupTip };
}
