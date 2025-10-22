export const WALLET_KEY='mb_wallet_balance';
export function getBalance(){return Number(localStorage.getItem(WALLET_KEY)||0)}
export function setBalance(v){localStorage.setItem(WALLET_KEY,String(Number(v)||0));renderBalance()}
export function addBalance(v){setBalance(getBalance()+Number(v||0))}
export function renderBalance(){const el=document.getElementById('balanceText');if(el){try{el.textContent=new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(getBalance())}catch{el.textContent=getBalance().toFixed(2)+' ARS'}}}
