// MB Casino UI minimal behaviour
const $ = (sel, el=document)=> el.querySelector(sel);
const $$ = (sel, el=document)=> [...el.querySelectorAll(sel)];

async function loadJSON(url){ const r = await fetch(url); return r.json(); }

const state = {
  games: [],
  winners: []
};

function formatAmount(n, currency='ARS'){
  try { return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(n); }
  catch { return n.toFixed(2)+' '+currency; }
}

function gameCard(game){
  return `<article class="card" data-provider="${game.provider.toLowerCase()}">
    ${game.isLive ? '<span class="badge">L</span>' : ''}
    <img src="${game.img}" alt="${game.title}">
    <div class="body">
      <h3>${game.title}</h3>
      <div class="meta">
        <span class="prov">${game.provider}</span>
        <span class="players">👥 ${game.players}</span>
      </div>
    </div>
  </article>`
}

function renderGames(){
  const continueRow = $("#continueRow");
  const favoritesRow = $("#favoritesRow");
  const sample = state.games.slice(0,6);
  continueRow.innerHTML = sample.map(gameCard).join("");
  favoritesRow.innerHTML = state.games.map(gameCard).join("");
}

function renderWinners(){
  const row = $("#winnersRow");
  if(!state.winners.length){
    // fabricate winners
    const names = ["tony1100","7starsz","Ysxxfhv...","chino90","maki87","lucho","anita"];
    state.winners = names.map((n,i)=>({name:n, amount: (200+Math.random()*150).toFixed(2), currency:"ARSM"}));
  }
  row.innerHTML = state.winners.map(w=>`<div class="winner"><div class="name">@${w.name}</div><div class="amount">${w.amount} ${w.currency}</div></div>`).join("");
}

function initFilters(){
  $$(".chip").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".chip").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$("#favoritesRow .card").forEach(c=>{
        c.style.display = (f==="todo" || c.dataset.provider===f) ? "" : "none";
      });
    });
  });
}

function initAddFunds(){
  const dialog = $("#addFundsModal");
  $("#addFundsBtn").addEventListener("click", ()=> dialog.showModal());
  const wa = $("#waLink");
  const amount = $("#depositAmount");
  const curr = $("#depositCurrency");
  function update(){
    const text = encodeURIComponent(`Hola, quiero cargar ${amount.value||0} ${curr.value}. Adjunto comprobante.`);
    // TODO: reemplaza el número por tu WhatsApp con código de país, sin + (e.g., 54911...)
    const phone = "5491112345678";
    wa.href = `https://wa.me/${phone}?text=${text}`;
  }
  amount.addEventListener("input", update);
  curr.addEventListener("change", update);
  update();
}

function initLogin(){
  const modal = $("#loginModal");
  // Mostrar modal si no hay usuario
  if(!localStorage.getItem("mb_user")){
    // modal.showModal(); // descomenta si querés forzar login
  }
  $("#loginSubmit").addEventListener("click", (e)=>{
    e.preventDefault();
    const u = $("#loginUser").value.trim();
    const p = $("#loginPass").value.trim();
    if(u && p){
      localStorage.setItem("mb_user", u);
      modal.close();
      alert("¡Bienvenido, "+u+"!");
    }
  });
}

async function bootstrap(){
  state.games = await loadJSON("games.json");
  renderGames();
  renderWinners();
  initFilters();
  initAddFunds();
  initLogin();
}

bootstrap();
