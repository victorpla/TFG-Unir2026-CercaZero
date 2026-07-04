# CercaZero — Frontend

Interfaz web de CercaZero: donación de excedentes geolocalizada entre vecinos,
con ofuscación de ubicación para proteger la privacidad del donante.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3** (mobile-first)
- **react-leaflet 4** + **Leaflet** (mapa, sin API key — tiles de OpenStreetMap)
- **Axios** con interceptores JWT
- **React Hook Form** (validación de formularios)
- **React Router 6**
- **react-hot-toast** (feedback visual)
- **lucide-react** (iconos)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_API_BASE_URL a tu backend
npm run dev
```

```bash
npm run build     # build de producción a /dist
npm run preview   # sirve el build localmente
```

## Estructura de carpetas

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # BrowserRouter + AuthProvider + Toaster
├── index.css                # Tailwind + estilos base de Leaflet
│
├── router/
│   ├── AppRouter.jsx         # Definición de rutas
│   └── ProtectedRoute.jsx    # Guard para rutas que requieren JWT
│
├── layouts/
│   └── MainLayout.jsx        # Layout raíz: TopNavbar + BottomNavbar + Outlet
│
├── pages/                    # Una página = una ruta
│   ├── HomeMapPage.jsx        # "/"  → mapa de donaciones cercanas
│   ├── LoginPage.jsx          # "/login"
│   ├── RegisterPage.jsx       # "/register"
│   └── MyDonationsPage.jsx    # "/mis-donaciones" (protegida)
│
├── components/
│   ├── layout/
│   │   ├── TopNavbar.jsx      # Nav superior (siempre visible)
│   │   └── BottomNavbar.jsx   # Nav inferior fija (solo móvil) + FAB "Donar"
│   ├── ui/                    # Átomos reutilizables
│   │   ├── Button.jsx
│   │   ├── Spinner.jsx
│   │   └── TextField.jsx
│   ├── map/
│   │   └── DonationMap.jsx    # Mapa interactivo (react-leaflet)
│   ├── donations/
│   │   ├── DonationFormModal.jsx  # Modal para publicar una donación
│   │   ├── DonationCard.jsx       # Tarjeta de donación (lista)
│   │   ├── StatusBadge.jsx        # Pastilla de estado
│   │   └── StatusManager.jsx      # Botón para avanzar el estado
│   └── auth/
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
│
├── context/
│   ├── AuthContext.jsx           # Sesión, JWT, login/register/logout
│   └── DonationModalContext.jsx  # Visibilidad del modal de donación
│
├── hooks/
│   ├── useAuth.js
│   ├── useDonationModal.js
│   ├── useGeolocation.js         # Posición del navegador (+ fallback)
│   └── useNearbyItems.js         # Wrapper de GET /items/nearby
│
├── services/                     # Toda la comunicación HTTP vive aquí
│   ├── api.js                    # Instancia Axios + interceptores JWT
│   ├── authService.js            # /auth/register, /auth/login
│   └── itemsService.js           # /items/nearby, /items, /items/:id/status
│
└── utils/
    └── geoPrivacy.js              # Jitter de coordenadas (refuerzo de privacidad en cliente)
```

## Conexión con el backend

Todas las peticiones pasan por `src/services/api.js`, una única instancia de
Axios con dos interceptores:

1. **Petición** → adjunta `Authorization: Bearer <token>` leyendo el JWT de
   `localStorage`, si existe. Los servicios (`authService`, `itemsService`)
   nunca gestionan el token manualmente.
2. **Respuesta** → si el backend responde `401`, limpia la sesión local y
   emite un evento (`cercazero:unauthorized`) que `AuthContext` escucha para
   cerrar sesión en toda la app. Se usa un evento en vez de un import directo
   para evitar una dependencia circular entre la capa HTTP y el estado React.

Para llamar a un endpoint protegido nuevo, basta con crear la función en el
`service` correspondiente usando `api` — el JWT se añade solo.

## Endpoints consumidos

| Método | Endpoint | Servicio | Auth |
|---|---|---|---|
| POST | `/auth/register` | `authService.registerUser` | No |
| POST | `/auth/login` | `authService.loginUser` | No |
| GET | `/items/nearby` | `itemsService.getNearbyItems` | Opcional |
| POST | `/items` | `itemsService.createItem` | Sí |
| PUT | `/items/:id/status` | `itemsService.updateItemStatus` | Sí |

> `MyDonationsPage` asume además un `GET /items/mine` (protegido) para listar
> las donaciones del usuario autenticado, ya que no estaba en la
> especificación original — ajústalo al endpoint real que exponga el backend.

## Privacidad de ubicación

La ofuscación **vinculante** debe implementarse en el backend: mientras un
ítem esté `disponible`, la API nunca debe devolver la coordenada exacta del
domicilio del donante, sino un punto dentro de un radio razonable (p. ej.
80–150 m). La dirección exacta solo debería revelarse al receptor tras
confirmarse la reserva.

`src/utils/geoPrivacy.js` añade una capa de refuerzo en el cliente (jitter
determinista) por si la API devolviera alguna vez una coordenada exacta por
error — no sustituye la ofuscación del servidor.

## Estados de una donación

`disponible → reservado → entregado`, gestionado por `StatusManager.jsx`,
que llama a `PUT /items/:id/status` con el siguiente estado del flujo.
