
(function(){
  function getCFG(){ return window.CFG || {ENDPOINT:"", WHATSAPP_PHONE:""}; }
  window.openWAWithDeposit = function(amount){
    const CFG = getCFG();
    const phone = (CFG.WHATSAPP_PHONE||"").replace(/[^0-9]/g,"");
    const me = JSON.parse(localStorage.getItem('me')||"{}");
    const userId = me.user_id || "USUARIO";
    const code = 'DEP-' + new Date().toISOString().slice(0,10).replace(/-/g,'')
               + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
    const msg = `Hola 👋 quiero cargar fichas.\nImporte: $${amount}\nCódigo: ${code}\nID jugador: ${userId}\nAlias/CVU emisor: ______`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };
})();
