export function formatNumber(n:number, locale='es-ES', maxFractionDigits=0){
  return new Intl.NumberFormat(locale,{ maximumFractionDigits:maxFractionDigits }).format(n);
}
export function formatCurrency(n:number, currency='USD', locale='en-US', maxFractionDigits=2){
  return new Intl.NumberFormat(locale,{ style:'currency', currency, maximumFractionDigits:maxFractionDigits }).format(n);
}
