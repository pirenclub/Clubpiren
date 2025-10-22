import {API_BASE, WHATSAPP_PHONE} from './config.js';
import {renderBalance} from './wallet.js';
const $ = (sel, el=document)=> el.querySelector(sel);
const $$ = (sel, el=document)=> [...el.querySelectorAll(sel)];
function toSlug(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
async function loadJSON(url){ const r = await fetch(url); return r.json(); }
const state = { games: [], winners: [] };

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
  $$("#continueRow .card, #favoritesRow .card").forEach(card=>{
    card.addEventListener('click',()=>{
      const t = card.querySelector('h3').textContent;
      const g = state.games.find(x=>x.title===t);
      if(g) location.href = `juego.html?id=${g.id}`;
    });
  });
}

function renderWinners(){
  const row = $("#winnersRow");
  if(!state.winners.length){
    const names = ["tony1100","7starsz","Ysxxfhv","chino90","maki87","lucho","anita"];
    state.winners = names.map((n)=>({name:n, amount:(200+Math.random()*150).toFixed(2), currency:"ARSM"}));
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
    wa.href = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }
  amount.addEventListener("input", update); curr.addEventListener("change", update); update();
  renderBalance();
}

function initLogin(){
  const modal = $("#loginModal");
  $("#loginSubmit").addEventListener("click", (e)=>{
    e.preventDefault();
    const u = $("#loginUser").value.trim();
    const p = $("#loginPass").value.trim();
    if(u && p){ localStorage.setItem("mb_user", u); modal.close(); alert("¡Bienvenido, "+u+"!"); }
  });
}

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
    const text = encodeURIComponent("Hola, tengo una consulta sobre MB Casino.");
    location.href = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  });
}

// Iframe opener
function initIframePlayer(){
  const wrap = document.getElementById('gameFrameWrap');
  const iframe = document.getElementById('gameFrame');
  const btnClose = document.getElementById('closeFrame');
  btnClose?.addEventListener('click', ()=>{ wrap.classList.remove('open'); iframe.src='about:blank'; history.replaceState(null,null,location.pathname); });

  if(location.hash==='#play'){
    const url = sessionStorage.getItem('launchUrl');
    if(url){ iframe.src=url; wrap.classList.add('open'); }
  }
  if(location.hash==='#demo'){
    iframe.src = 'provider-demo.html';
    wrap.classList.add('open');
  }
}

async function bootstrap(){
  state.games = await loadJSON("games.json");
  renderGames(); renderWinners();
  initFilters(); initAddFunds(); initLogin(); initDrawerAndNav(); initIframePlayer();
}
bootstrap();
