# Lista de Verificación para Despliegue en Vercel

## 1. Variables de Entorno
Asegúrate de agregar las siguientes variables en la configuración de tu proyecto en Vercel (Settings > Environment Variables):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 2. Comandos de Build
Vercel detectará automáticamente que es un proyecto Next.js.
- **Build Command:** `next build` (o `npm run build`)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## 3. Despliegue
Si tienes Vercel CLI instalado:
```bash
vercel
```
Para producción:
```bash
vercel --prod
```

O conecta tu repositorio de GitHub directamente en el dashboard de Vercel.

## 4. Verificación
Una vez desplegado, verifica:
- Que el Login funcione correctamente (Firebase Auth dominios autorizados).
- *Nota:* Debes agregar el dominio de Vercel (ej: `tu-app.vercel.app`) a la lista de "Authorized Domains" en la consola de Firebase Authentication > Settings.
