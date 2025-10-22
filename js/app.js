import {getBalance,setBalance,addBalance,renderBalance} from './wallet.js';
// JS funcional
const $ = (sel, el=document)=> el.querySelector(sel);
const $$ = (sel, el=document)=> [...el.querySelectorAll(sel)];
function toSlug(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
async function loadJSON(url){ const r = await fetch(url); return r.json(); }
const state = { games: [], winners: [] };
renderBalance();

function gameCard(game){
  const provSlug = toSlug(game.provider_slug || game.provider);
  return `<article class="card" data-provider="${provSlug}">
    ${game.isLive ? '<span class="badge">L</span>' : ''}
    <img src="${game.img}" alt="${game.title}">
    <div class="body">
      <h3>${game.title}</h3>
      <div class="meta"><span class="prov">${game.provider}</span><span class="players">👥 ${game.players}</span></div>
    </div>
  </article>`;
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
    const names = ["tony1100","7starsz","Ysxxfhv","chino90","maki87","lucho","anita"];
    state.winners = names.map((n)=>({name:n, amount:(200+Math.random()*150).toFixed(2), currency:"ARSM"}));
  }
  row.innerHTML = state.winners.map(w=>`<div class="winner"><div class="name">@${w.name}</div><div class="amount">${w.amount} ${w.currency}</div></div>`).join("");
}

// Navegación: click en cards -> juego.html?id=...
function hookCardClicks(){
  document.querySelectorAll("#continueRow .card, #favoritesRow .card").forEach((card)=>{
    card.addEventListener("click", ()=>{
      const title = card.querySelector("h3")?.textContent || "";
      const g = state.games.find(x=>x.title===title);
      if(g){ location.href = `juego.html?id=${g.id}`; }
    });
  });
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
  // Modo dev: acreditación de prueba
  const dev = location.hash.includes("dev");
  if(dev){
    const menu = dialog.querySelector("menu");
    const testBtn = document.createElement("button");
    testBtn.className = "btn";
    testBtn.textContent = "+ Acreditar prueba $1000";
    testBtn.addEventListener("click", (e)=>{ e.preventDefault(); addBalance(1000); alert("Se acreditaron $1000 demo."); dialog.close(); });
    menu.prepend(testBtn);
  }

  const dialog = $("#addFundsModal");
  $("#addFundsBtn").addEventListener("click", ()=> dialog.showModal());
  const wa = $("#waLink");
  const amount = $("#depositAmount");
  const curr = $("#depositCurrency");
  function update(){
    const text = encodeURIComponent(`Hola, quiero cargar ${amount.value||0} ${curr.value}. Adjunto comprobante.`);
    const phone = "5491112345678"; // Cambiar por tu número real
    wa.href = `https://wa.me/${phone}?text=${text}`;
  }
  amount.addEventListener("input", update);
  curr.addEventListener("change", update);
  update();
  // Abrir modal si viene de juego con #deposit
  if(location.hash.includes('deposit')){
    setTimeout(()=>document.getElementById("addFundsModal").showModal(), 150);
  }

}

function initLogin(){
  const modal = $("#loginModal");
  // modal.showModal(); // descomentar si querés forzar login
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

// Drawer y bottom nav
function initDrawerAndNav(){
  const drawer = $("#drawer");
  $("#navMenu")?.addEventListener("click", (e)=>{ e.preventDefault(); drawer.classList.add("open"); });
  $("#drawerClose")?.addEventListener("click", ()=> drawer.classList.remove("open"));
  drawer?.addEventListener("click", (e)=>{ if(e.target===drawer) drawer.classList.remove("open"); });

  $("#navExplore")?.addEventListener("click", (e)=>{ e.preventDefault(); $("#favoritos").scrollIntoView({behavior:"smooth"}); });
  $("#navCasino")?.addEventListener("click", (e)=>{ e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"}); });
  $("#navSports")?.addEventListener("click", (e)=>{ e.preventDefault(); location.href = "proveedores/hacksawgaming.html"; });
  $("#navChat")?.addEventListener("click", (e)=>{
    e.preventDefault();
    const phone = "5491112345678"; // cambia por tu número
    const text = encodeURIComponent("Hola, tengo una consulta sobre MB Casino.");
    location.href = `https://wa.me/${phone}?text=${text}`;
  });

  $("#openDeposit")?.addEventListener("click", (e)=>{ e.preventDefault(); drawer.classList.remove("open"); $("#addFundsModal").showModal(); });
  $("#openLogin")?.addEventListener("click", (e)=>{ e.preventDefault(); drawer.classList.remove("open"); $("#loginModal").showModal(); });
}

async function bootstrap(){
  state.games = await loadJSON("games.json");
  renderGames();
  renderWinners();
  hookCardClicks();
  initFilters();
  initAddFunds();
  initLogin();
  initDrawerAndNav();
}
bootstrap();
