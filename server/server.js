import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.get('/api/health', (req,res)=> res.json({ok:true}));

app.post('/api/sessions/launch', (req,res)=>{
  const { userId='guest', gameId='unknown', currency='ARS', mode='real' } = req.body || {};
  const token = nanoid(16);
  const params = new URLSearchParams({ user:userId, game:gameId, cur:currency, mode, token }).toString();
  const launchUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/mock-provider/play?${params}`;
  res.json({ ok:true, launchUrl });
});

app.get('/mock-provider/play', (req,res)=>{
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mock Provider</title>
  <style>body{margin:0;background:#10141f;color:#fff;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh}.box{max-width:520px;text-align:center;padding:16px}.btn{background:#2a76ff;border:none;color:#fff;border-radius:12px;padding:.6rem .9rem;font-weight:700}</style></head>
  <body><div class="box"><h2>🎰 Mock Provider</h2><p>Usuario: ${req.query.user} — Juego: ${req.query.game} — Moneda: ${req.query.cur}</p><button class="btn" onclick="alert('Aquí iría el juego real del proveedor.')">Jugar ahora</button></div></body></html>`;
  res.set('Content-Type', 'text/html'); res.send(html);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Mock backend on http://localhost:'+port));
