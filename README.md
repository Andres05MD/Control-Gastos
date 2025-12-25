# Control de Gastos & Finanzas Personales 💰

Una aplicación web progresiva y moderna para la gestión integral de finanzas personales. Diseñada con un estilo "Premium Glassmorphism", ofrece herramientas avanzadas para el control de ingresos, gastos, ahorros en múltiples divisas y planificación financiera.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Control+de+Gastos+App+Preview)

## 🚀 Características Principales

### 📊 Dashboard Interactivo
- **Widgets Inteligentes**: Visualización en tiempo real de ahorros, presupuesto y salario.
- **Conversión de Divisas**: Integración automática de la tasa del Banco Central de Venezuela (BCV) para ver equivalencias en Bolívares (Bs.).
- **Diseño Glassmorphism**: Interfaz oscura con efectos de desenfoque, gradientes y sombras de neón.

### 💰 Gestión de Ahorros (Nuevo)
- **Billetera Multi-Divisa**: Registro de ahorros en **Efectivo Físico** y **USDT** (Cripto).
- **Historial de Ahorros**: Control detallado de depósitos y retiros para tus fondos de ahorro.
- **Validación de Fondos**: El sistema evita retiros si el saldo es insuficiente.

### 📝 Listas de Compras Inteligentes
- **Calculadora Integrada**: Suma automática del total de la lista mientras agregas productos.
- **Conversión en Tiempo Real**: Visualiza cuánto costará tu compra en Bs. según la tasa del día.
- **Checklists**: Marca productos como comprados o pendientes.

### 📈 Reportes Financieros
- **Análisis por Periodo**: Filtrado mensual y anual de tus finanzas.
- **Gráficos**: Distribución de gastos por categoría y balance general.
- **Resumen de Ahorro**: Visualiza cuánto has logrado ahorrar (neto) en cada mes.

### 🔒 Seguridad y Perfil
- **Autenticación Firebase**: Login seguro y gestión de sesiones.
- **Recuperación de Contraseña**: Sistema integrado de reseteo de credenciales.
- **Privacidad**: Datos aislados por usuario en la nube.

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Lenguaje**: TypeScript
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Gráficos**: Recharts
- **UI Components**: SweetAlert2, React Icons, React Datepicker

## 🏁 Comenzando

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tu-usuario/control-gastos-app.git
cd control-gastos-app
npm install
```

Configura tus variables de entorno en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Estructura del Proyecto

```
/src
  /app              # Rutas (Dashboard, Login, Ahorros, Reportes...)
  /components       # UI Kit, Widgets, Gráficos
  /hooks            # Lógica personalizada (useTransactions, useSavings...)
  /lib              # Configuración de Firebase y Utils
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

## 📄 Licencia

[MIT](https://choosealicense.com/licenses/mit/)
