# Habit Tracker App

Una aplicación web personal para el seguimiento de hábitos y metas.

## Características

- **Dashboard inicial visual** con resumen de progreso
- **Seguimiento diario de hábitos** con marcado simple
- **Seguimiento de metas** a corto y largo plazo
- **Variables diarias** para métricas personalizadas (horas trabajadas, etc.)
- **Visualizaciones** semanales, mensuales y globales
- **Almacenamiento local** (localStorage) para máxima privacidad
- **Interfaz responsiva** para usar en cualquier dispositivo
- **Personalizable completamente** a través de la sección de Ajustes

## Instalación

1. Clona este repositorio:
```
git clone https://github.com/tuusuario/habit-tracker-app.git
cd habit-tracker-app
```

2. Instala las dependencias:
```
npm install
```

3. Inicia el servidor de desarrollo:
```
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Despliegue en Vercel

Esta aplicación está optimizada para despliegue en Vercel:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Instala el CLI de Vercel:
```
npm install -g vercel
```

3. Despliega la aplicación:
```
vercel
```

4. Para producción:
```
vercel --prod
```

## Estructura de archivos

```
habit-tracker-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js        # Página principal/dashboard
│   │   ├── DailyView.js        # Vista diaria para marcar hábitos
│   │   ├── WeeklyView.js       # Estadísticas semanales
│   │   ├── MonthlyView.js      # Visualización mensual con calendario
│   │   ├── GlobalView.js       # Estadísticas globales y tendencias
│   │   ├── Settings.js         # Administración de hábitos, metas y datos
│   │   └── Navbar.js           # Navegación principal
│   ├── utils/
│   │   ├── dateUtils.js        # Utilidades para manejo de fechas
│   │   ├── colorUtils.js       # Funciones para colores y visualizaciones
│   │   └── LocalStorageManager.js  # Gestión de almacenamiento local
│   ├── styles/
│   │   ├── App.css             # Estilos globales
│   │   ├── Navbar.css          # Estilos de navegación
│   │   ├── Dashboard.css       # Estilos del dashboard
│   │   └── ...                 # Otros estilos de componentes
│   ├── App.js                  # Componente principal y rutas
│   └── index.js                # Punto de entrada
└── package.json                # Dependencias y scripts
```

## Uso

### Configuración inicial

1. Al abrir por primera vez, dirígete a la sección de **Ajustes**.
2. Agrega tus hábitos diarios que deseas seguir.
3. Configura metas a corto y largo plazo.
4. Opcionalmente, agrega variables diarias personalizadas para seguir.

### Uso diario

1. Cada día, visita la vista **Diaria** para marcar tus hábitos completados.
2. Actualiza tus variables diarias (horas trabajadas, etc.).
3. Registra el progreso de tus metas.
4. Consulta el **Dashboard** para una visión general.

### Análisis

- Utiliza la vista **Semanal** para evaluar patrones a corto plazo.
- Revisa la vista **Mensual** para ver tu consistencia durante períodos más largos.
- Consulta la vista **Global** para analizar tendencias y estadísticas generales.

## Respaldo de datos

Es importante realizar copias de seguridad periódicas de tus datos:

1. Ve a la sección **Ajustes** > pestaña **Datos**.
2. Haz clic en **Exportar Datos** para descargar un archivo JSON con toda tu información.
3. Para restaurar, usa la opción **Importar Datos**.

## Personalización

Todos los aspectos de la aplicación se pueden personalizar:

- Agrega, edita o elimina hábitos en cualquier momento.
- Configura nuevas metas cuando completes las anteriores.
- Ajusta tus variables de seguimiento según cambien tus necesidades.

## Tecnologías utilizadas

- React.js
- React Router
- Chart.js / React-Chartjs-2
- localStorage para persistencia de datos
- CSS moderno (variables, flexbox, grid)

## Licencia

Este proyecto es software libre, puedes modificarlo y utilizarlo como desees para tu uso personal.

## Soporte

Esta aplicación es para uso personal y no incluye soporte técnico dedicado. Sin embargo, puedes reportar problemas o sugerir mejoras a través de issues en GitHub.
