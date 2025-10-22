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

## Despliegue a AWS S3 (Instrucciones)

IMPORTANTE: No agregues claves de acceso en este repositorio. Usa un usuario IAM con permisos mínimos y configura tus credenciales localmente (no las subas a Git).

1) Instalar AWS CLI (macOS):

```bash
# usando Homebrew
brew install awscli
```

2) Configurar credenciales (opciones):

- Ejecuta `aws configure` y proporciona tu Access Key ID, Secret Access Key, región y formato de salida.
- O exporta variables de entorno en tu máquina local (ejemplo `~/.zshrc`):

```bash
export AWS_ACCESS_KEY_ID="<tu_access_key_id>"
export AWS_SECRET_ACCESS_KEY="<tu_secret_access_key>"
export AWS_DEFAULT_REGION="us-east-1"
```

3) Crear un bucket S3 (ejemplo):

```bash
aws s3 mb s3://mi-bucket-keystone --region us-east-1
```

4) Construir la aplicación (Vite):

```bash
npm run build
```

5) Subir el build al bucket (ejemplo):

```bash
# Asegúrate de que la carpeta de salida es 'dist' tras el build
aws s3 sync dist/ s3://mi-bucket-keystone --delete --acl public-read
```

6) (Opcional) Habilitar hosting estático en S3 y/o configurar CloudFront para CDN y HTTPS.

Recomendaciones de seguridad:

- Usa un usuario IAM con permisos limitados (ej. políticas que permitan `s3:PutObject`, `s3:ListBucket`, `s3:DeleteObject`, `s3:GetBucketLocation` en el bucket específico).
- No subas claves al repositorio. Si necesitas integrarlo en CI/CD, utiliza secretos del proveedor (GitHub Actions Secrets, GitLab CI variables, etc.).
- Considera usar roles y políticas vinculadas a instancias o a pipelines cuando publiques en producción.

Si quieres, puedo:
- Añadir un archivo de ejemplo `.github/workflows/deploy.yml` para desplegar automáticamente a S3 desde GitHub Actions usando Secrets.
- O ejecutar algunos comandos en tu terminal si autorizas correrlos aquí.

