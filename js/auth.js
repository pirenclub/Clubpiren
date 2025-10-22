
(function(){
  function getCFG(){
    if (window.CFG && window.CFG.ENDPOINT) return window.CFG;
    console.warn("CFG not found. Please edit js/config.js");
    return { ENDPOINT: "", WHATSAPP_PHONE: "" };
  }
  const CFG = getCFG();

  const $ = (s, c=document)=>c.querySelector(s);
  const gate = document.getElementById('gate');
  const err = document.getElementById('login_err');

  async function api(body){
    const token = localStorage.getItem('token');
    if (!CFG.ENDPOINT) return {ok:false, error:'endpoint_vacio'};
    const res = await fetch(CFG.ENDPOINT, {method:'POST', body: JSON.stringify({...body, token})});
    try { return await res.json(); } catch (e) { return {ok:false, error:'bad_json'}; }
  }
  window.__api = api;

  const form = document.getElementById('login_form');
  if (form){
    form.onsubmit = async (e)=>{
      e.preventDefault();
      err.textContent = '';
      const formData = Object.fromEntries(new FormData(form));
      if (!CFG.ENDPOINT){ err.textContent = 'Configurar ENDPOINT en js/config.js'; return; }
      try {
        const r = await fetch(CFG.ENDPOINT, {method:'POST', body: JSON.stringify({action:'login', ...formData})}).then(r=>r.json());
        if(!r.ok){ err.textContent = 'Usuario o PIN inválido.'; return; }
        localStorage.setItem('token', r.token);
        localStorage.setItem('me', JSON.stringify(r.me||{}));
        if (gate) gate.style.display='none';
        document.dispatchEvent(new CustomEvent('login:ok', {detail:r.me||{}}));
      } catch(e){
        err.textContent = 'Error de conexión. Revisá js/config.js';
      }
    };
  }

  (async()=>{
    const token = localStorage.getItem('token');
    if(!token) return;
    const r = await api({action:'me'});
    if(r && r.ok && gate) {
      gate.style.display='none';
      document.dispatchEvent(new CustomEvent('login:ok', {detail:r.me||{}}));
    }
  })();

  window.logout = function(){
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    if (gate) gate.style.display='grid';
  };
})();
