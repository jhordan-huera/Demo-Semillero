# 🎓 EduParent — Plataforma Digital para Padres de Familia

Plataforma web para el seguimiento del desarrollo cognitivo de niños en Educación Inicial, basada en la teoría de Piaget. Permite a los padres visualizar el progreso de sus hijos, recibir actividades para casa y consultar las evaluaciones del docente.

## 📋 Requisitos Previos

Antes de clonar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) — [Descargar aquí](https://nodejs.org/)
- **Yarn** (gestor de paquetes) — Se instala con: `npm install -g yarn`
- **Git** — [Descargar aquí](https://git-scm.com/)

### Verificar instalación

```bash
node --version    # debe mostrar v18.x.x o superior
yarn --version    # debe mostrar 1.x.x
git --version     # debe mostrar git version x.x.x
```

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/jhordan-huera/Demo-Semillero.git
```

### 2. Entrar al directorio del proyecto

```bash
cd Demo-Semillero
```

### 3. Instalar dependencias

```bash
yarn install
```

### 4. Ejecutar en modo desarrollo

```bash
yarn dev
```

La aplicación se abrirá en: **http://localhost:5173/**

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `yarn dev` | Inicia el servidor de desarrollo con Hot Module Replacement (HMR) |
| `yarn build` | Genera la versión de producción en la carpeta `dist/` |
| `yarn preview` | Previsualiza el build de producción localmente |
| `yarn lint` | Ejecuta ESLint para verificar el código |

## 🔑 Credenciales de Demo

| Usuario | Cédula | Contraseña | Hijos |
|---------|--------|------------|-------|
| María González | `1234567890` | `padre123` | Sofía (4 años), Mateo (3 años) |
| Carlos Ramírez | `0987654321` | `padre456` | Diego (5 años) |

## 📁 Estructura del Proyecto

```
Demo-Semillero/
├── public/                  # Archivos estáticos
├── src/
│   ├── main.jsx             # Punto de entrada de React
│   ├── App.jsx              # Routing y layout principal
│   ├── index.css            # Design System completo (variables, componentes, responsive, dark mode)
│   ├── context/
│   │   └── AppContext.jsx   # Estado global y datos mock
│   ├── components/
│   │   ├── Sidebar.jsx      # Navegación lateral (desktop/tablet)
│   │   └── MobileNav.jsx    # Navegación inferior (móvil)
│   └── pages/
│       ├── Login.jsx        # Inicio de sesión
│       ├── ChildSelector.jsx # Selección de hijo
│       ├── Dashboard.jsx    # Panel principal (perfil, tareas, calendario)
│       ├── Progress.jsx     # Rúbrica cognitiva
│       └── History.jsx      # Historial de evaluaciones
├── index.html               # HTML base
├── package.json             # Dependencias y scripts
├── vite.config.js           # Configuración de Vite
├── eslint.config.js         # Configuración de ESLint
├── vercel.json              # Configuración para deploy en Vercel
└── architecture.md          # Documentación de la arquitectura
```

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2 | Librería UI con componentes funcionales y hooks |
| Vite | 8.0 | Bundler y servidor de desarrollo |
| React Router DOM | 7.15 | Navegación SPA (Single Page Application) |
| CSS Variables | — | Design System con tema claro/oscuro |
| ESLint | 10.3 | Linting de código |

## 🎨 Características

- ✅ **Multi-tenant**: Soporte para múltiples hijos por padre
- ✅ **Modo Oscuro/Claro**: Toggle con persistencia en localStorage
- ✅ **Responsive**: Desktop → Tablet → Móvil (3 breakpoints)
- ✅ **Texto Enriquecido**: Instrucciones con negritas, cursivas, pasos, tips y avisos
- ✅ **Rúbrica Cognitiva**: Evaluación basada en Piaget (Iniciado / En Proceso / Logrado)
- ✅ **Historial**: Evolución del progreso por unidad didáctica
- ✅ **Calendario**: Fechas de entrega de actividades
- ✅ **Deploy**: Configurado para Vercel

## 🌐 Deploy en Vercel

El proyecto incluye `vercel.json` con soporte para SPA. Para hacer deploy:

1. Instala Vercel CLI: `npm install -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones del CLI

O conecta el repositorio de GitHub directamente en [vercel.com](https://vercel.com).

## 👥 Equipo

- **Módulo 1** — Autenticación y Navegación: `Login.jsx`, `ChildSelector.jsx`, `Sidebar.jsx`, `MobileNav.jsx`
- **Módulo 2** — Dashboard y Actividades: `Dashboard.jsx`
- **Módulo 3** — Progreso y Rúbrica: `Progress.jsx`
- **Módulo 4** — Historial y Análisis: `History.jsx`

---

> Proyecto desarrollado para el Semillero de Investigación — Software Empresarial, 7mo Semestre.
