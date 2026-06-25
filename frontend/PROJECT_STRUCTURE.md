Raíz del Proyecto (/)
Se mantiene casi igual:

package.json → dependencias y scripts.

tsconfig.json → configuración de TypeScript.

.env → variables de entorno.

Configuración de ESLint y Prettier.

👉 Aquí ya no necesitas next.config.ts.

Carpeta src/ - Código Fuente Principal
Todo el código vive aquí.

src/pages/ - Páginas y Rutas
En React no existe App Router, así que usas React Router:

Cada archivo .tsx representa una página.

Ejemplo: src/pages/Dashboard.tsx → ruta /dashboard.

Puedes tener un src/routes.tsx donde defines todas las rutas con <BrowserRouter> y <Route>.

src/components/ - Componentes Reutilizables
Se mantiene igual:

Carpeta por componente (NavBar/, Modal/, etc.).

index.ts para exportar limpio.

Props tipados en ComponentName.types.ts.

src/services/ - Comunicación con Backend

Configuración global de Axios (axiosConfig.ts).

Subcarpetas por dominio (country/, login/, etc.).

Los componentes llaman a estas funciones, nunca directamente a axios.

src/store/ - Estado Global
Puedes usar Zustand o Redux Toolkit:

Cada store maneja un slice de estado (countryStore.ts, authStore.ts).

Accesible desde cualquier componente.

src/models/ - Tipos Compartidos
Interfaces y tipos TypeScript reutilizables:

User, Country, Formula, etc.

src/utils/ - Funciones Helper
Funciones puras y reutilizables:

Validadores, formateadores, helpers de arrays/objetos.

src/config/ - Configuración de la App
Constantes de negocio, feature flags, valores por defecto.

Buenas Prácticas en React
Rutas protegidas:  
Crear un PrivateRoute.tsx que verifique autenticación antes de renderizar.

Layouts reutilizables:  
Definir componentes de layout (MainLayout, DashboardLayout) y envolver páginas.

Estado global ligero:  
Usar Zustand para slices pequeños, Redux Toolkit si el estado es más complejo.

Separación clara:

Páginas = vistas completas.

Componentes = piezas reutilizables.

Services = llamadas HTTP.

Store = estado compartido.


ejemplo:
📦 proyecto-react/
├── 📁 public/                # Archivos estáticos (favicon, index.html, imágenes públicas)
├── 📁 src/
│   ├── 📁 pages/             # Páginas principales (React Router)
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   │
│   ├── 📁 components/        # Componentes reutilizables
│   │   ├── NavBar/
│   │   │   ├── NavBar.tsx
│   │   │   ├── NavBar.types.ts
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   └── AlertBox/
│   │       ├── AlertBox.tsx
│   │       └── index.ts
│   │
│   ├── 📁 services/          # Lógica de comunicación con backend
│   │   ├── axiosConfig.ts
│   │   ├── country/
│   │   │   ├── countryService.ts
│   │   │   └── index.ts
│   │   ├── login/
│   │   │   └── loginService.ts
│   │   └── audit/
│   │       └── auditService.ts
│   │
│   ├── 📁 store/             # Estado global (Zustand/Redux)
│   │   ├── countryStore.ts
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── 📁 models/            # Tipos compartidos
│   │   ├── User.ts
│   │   ├── Country.ts
│   │   └── Formula.ts
│   │
│   ├── 📁 utils/             # Funciones helper puras
│   │   ├── dateUtils.ts
│   │   ├── validationUtils.ts
│   │   └── formatUtils.ts
│   │
│   ├── 📁 config/            # Configuración de negocio
│   │   ├── appConfig.ts
│   │   └── featureFlags.ts
│   │
│   ├── 📁 layouts/           # Layouts reutilizables
│   │   ├── MainLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── 📁 routes/            # Definición de rutas con React Router
│   │   └── AppRouter.tsx
│   │
│   ├── index.tsx             # Punto de entrada principal
│   └── App.tsx               # Componente raíz
│
├── package.json
├── tsconfig.json
├── .env
├── .eslintrc.js
└── vite.config.ts            # Configuración de Vite



# Paleta de colores 
#CC1C1C - Encabezados, botones primarios, acentos
#FFFFFF - Fondo principal, texto en oscuro
#FFF0F0 - Fondos activos, hover suave
#E8E8F0 - Fondos de tarjetas, superficies
#1565C0 - Links, información, datos