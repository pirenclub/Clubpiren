# Proveedores MVP (PG Soft + BGaming)

Set estático listo para subir a GitHub Pages.

## Pasos rápidos
1. **Crear repo** en GitHub (p.ej., `proveedores-mvp`) y subir todo el contenido de esta carpeta.
2. En `Settings > Pages`, publicar desde la rama `main` (carpeta `/root`).
3. Editar `js/config.js`:
   - `ENDPOINT`: URL de tu **Apps Script Web App** (ver más abajo).
   - `WHATSAPP_PHONE`: tu número, formato internacional (ej. `54911XXXXXXX`).

4. Abrí `index.html` en tu Pages. Login con tu **user_id** y **PIN** (cargados desde Sheets).

## Google Sheets + Apps Script
- Creá un **Google Sheets** con 3 pestañas:
  - `users`: `user_id | nombre | telefono | pin_hash | rol | estado | actualizado`
  - `transactions`: `ts | tx_id | user_id | tipo | monto | estado | referencia | operador | nota`
  - `wallets`: `user_id | nombre | saldo | actualizado`
- Abrí `Extensiones > Apps Script` y pegá el código **auth.gs** y **api.gs** de nuestra conversación.
- En **Propiedades del proyecto**, agregá `SECRET` (cadena larga).
- `Deploy > Manage deployments > Web app` → `Anyone with the link` → **copiá la URL** y pegala en `js/config.js` (`ENDPOINT`).

## Admin
- `admin.html` requiere login.
- Formulario para **aprobar depósitos** (`approve`) y **consultar saldo** (`balance`).
- Solo `rol = admin` puede aprobar.

## Datos
- `data/providers.json`: proveedores listados.
- `data/games/*.json`: juegos por proveedor. Agregá o editá libremente.

## Notas
- Este sitio es **catálogo informativo** (+18, juego responsable). No ofrece juego por dinero.
- Si querés cerrar TODO detrás de login, evaluá **Cloudflare Access** o **Firebase Hosting + Auth**.
- Fecha de generación: 2025-10-22.
