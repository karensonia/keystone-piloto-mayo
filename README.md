# Keystone - El Soundtrack de tu Noche

## Descripción del Proyecto

Demo de plataforma musical interactiva desarrollada para presentación universitaria. Keystone permite a grupos de amigos participar activamente en la experiencia musical de locales nocturnos mediante microtransacciones, garantizando música auténtica y apoyo directo a los artistas.

## Propuesta de Valor

- **Música variada y auténtica**: Conexión directa con tu energía y estilo musical
- **Experiencia confiable**: Lo que ves es lo que obtienes en el local
- **Momentos memorables**: Cada salida se transforma en un mini-evento
- **Apoyo a artistas**: Sistema transparente de retribución justa

## Features Implementados

### 1. Catálogo Musical Navegable
- Listado de canciones y artistas disponibles
- Filtrado por género y popularidad
- Vista previa de información del artista

### 2. Sistema de Selección
- Agregar canciones a la playlist del local
- Primera canción gratis para usuarios invitados
- Confirmación visual del contenido elegido

### 3. Microtransacciones Simuladas
- Sistema de pago de $500 por canción
- Mensaje claro sobre uso legal y apoyo al artista
- Procesamiento instantáneo

### 4. Comprobante Digital
- Recibo con ID de transacción único
- Información completa: local, artista, monto, fecha
- Opción de visualización expandible

### 5. Información del Local en Tiempo Real
- Contador de visitantes actuales
- Cantidad de canciones en fila
- Tiempo estimado de reproducción

## Flujos de Usuario

### Flujo Invitado
1. Usuario ingresa como invitado desde pantalla de bienvenida
2. Navega por el catálogo de canciones
3. Agrega primera canción gratis
4. Recibe confirmación con posición en playlist

### Flujo Registrado
1. Usuario hace login/registro
2. Selecciona canciones del catálogo
3. Realiza microtransacción de $500
4. Recibe comprobante digital completo

## Stack Tecnológico

- **Frontend**: React + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS con design system personalizado
- **UI Components**: shadcn/ui (personalizados)
- **Build Tool**: Vite
- **Iconos**: Lucide React

## Diseño

### Sistema de Colores (HSL)
- **Primary**: Púrpura vibrante (271° 81% 56%)
- **Secondary**: Rosa/Fucsia (330° 81% 60%)
- **Accent**: Naranja (38° 92% 50%)
- **Background**: Dark gradient (240° 10% 6-10%)

### Características de Diseño
- Gradientes vibrantes inspirados en la energía nocturna
- Glassmorphism en cards para efecto premium
- Animaciones suaves y transiciones fluidas
- Efectos de glow en elementos interactivos
- Tipografía bold para impacto visual

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui personalizados
│   ├── SongCard.tsx     # Card de canción con botón agregar
│   └── VenueHeader.tsx  # Header con info del local
├── pages/
│   ├── Welcome.tsx      # Pantalla de bienvenida
│   ├── Login.tsx        # Login/Registro
│   ├── Home.tsx         # Catálogo de canciones
│   └── Confirmation.tsx # Confirmación y comprobante
├── data/
│   └── mockData.ts      # Datos simulados
└── index.css            # Design system y variables CSS

```

## Entidades del Sistema

- **Usuario consumidor**: Interactúa con el catálogo y realiza transacciones
- **Local**: Espacio físico con playlist activa
- **Canción**: Unidad de contenido musical
- **Artista**: Creador musical
- **Microtransacción**: Operación de pago
- **Comprobante digital**: Registro de transacción

## Contextos de Uso

1. **Catálogo Musical**: Exploración y descubrimiento
2. **Gestión de Playlist**: Administración de cola de reproducción
3. **Transacciones**: Pagos y comprobantes
4. **Experiencia en Local**: Disfrute de la música en vivo

## Autor

Proyecto universitario - Demo de sistema de interacción musical en locales

## Licencia

Este es un proyecto educativo con fines demostrativos.

# Credentials for Spotify https://developer.spotify.com/
Client ID: ad543d6b3b2e46ad8129e7da4102f40c
Client secret: b36a41fd795c42049eaffdcc2272a640

App name: rhythm-connect-io
Website: https://localhost
Redirect URIs: https://127.0.0.1
APIs used: Web API
