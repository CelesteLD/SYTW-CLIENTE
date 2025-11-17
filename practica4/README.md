# Espacios Culturales – Gatsby Practice

Este proyecto corresponde a una práctica 4 relacionada con el uso de **Gatsby**, **GraphQL** y la generación dinámica de páginas mediante **createPages** y plantillas.

## 📁 Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables (Avatar, Layout, Rating, etc.)
├── images/            # Recursos gráficos
├── pages/             # Páginas estáticas (index.js)
├── styles/            # CSS global
└── templates/         # Plantillas dinámicas (espacio-template.js)
```

## 🚀 ¿Qué hace este proyecto?

- Muestra un listado de espacios culturales obtenidos desde una API.
- Cada tarjeta enlaza a una página de detalle generada automáticamente.
- Se utilizan:
  - **Gatsby** (v5)
  - **GraphQL**
  - **Plantillas dinámicas**
  - **Estilos personalizados**

## ▶️ Scripts disponibles

| Comando | Descripción |
|--------|-------------|
| `npm run develop` | Levanta el servidor de desarrollo |
| `npm run build`   | Genera la versión de producción |
| `npm run serve`   | Sirve la build generada |
| `gatsby clean`    | Limpia caché y artefactos |

## 🔧 Datos de los espacios

Los espacios provienen de un JSON remoto servido vía jsDelivr desde GitHub.  
Gatsby los procesa mediante nodos GraphQL y genera rutas del tipo:

```
/espacios/{espacio_id}/
```

## 🧩 Plantilla dinámica

La plantilla `src/templates/espacio-template.js` genera cada página individual mostrando:

- Nombre del espacio
- Horario
- Imagen
- Municipio
- Otros metadatos (biblioteca, museo, centro cultural…)

## 🎨 Estilos

El proyecto incluye:

- `src/styles/global.css` → Estilos globales
- Componentes estilizados como tarjetas y avatares

---
