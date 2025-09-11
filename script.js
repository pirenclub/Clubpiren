
const WHATSAPP_NUMBER = '+54 9 3757 57-2806';
const WHATSAPP_MESSAGE = 'Hola, quiero más información sobre Club Pirén 🙂';
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScte_rO5VTqjBPPrdweujW_Q-cXA0JvRn-HiU1AWJVXxFhbig/viewform?usp=header';

function buildWaLink(){
  const phone = WHATSAPP_NUMBER.replace(/[^\d+]/g,'').replace(/^\+/,'');
  return `https://wa.me/${phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

function setYear(){ const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear(); }
function setWhatsAppLinks(){
  const link = buildWaLink();
  ['wa-link','wa-fab','wa-inline'].forEach(id => { const el = document.getElementById(id); if(el) el.href = link; });
}

function mobileMenu(){
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('show'));
  nav.querySelectorAll('a').forEach(el => el.addEventListener('click', () => nav.classList.remove('show')));
}

document.addEventListener('DOMContentLoaded', () => { setYear(); setWhatsAppLinks(); mobileMenu(); });
