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

# Documentación de Pruebas E2E con Cypress

Este documento recoge la implementación de las pruebas E2E realizadas para el proyecto **Espacios Culturales** usando Cypress. Incluye los cambios en la interfaz para soportar testeo, la configuración necesaria y los tests implementados.

La forma de ejecutar los tests es:

```
npm run cypress:run
```

---

## 1. Selectores estables para testing

Para asegurar pruebas resistentes a cambios estéticos, se añadieron atributos `data-cy` en elementos clave del frontend.

### Ejemplo en `src/pages/index.js`:

```jsx
<Link
  key={id}
  to={to}
  className="card-link"
  aria-label={`Ir a la página de ${s.espacio_cultura_nombre || "espacio"}`}
  data-cy="card-link"
  data-cy-id={id}
>
  ...
</Link>
```

### Ejemplo en `src/templates/espacio-template.js`:

```jsx
<h1 className="espacio-title" data-cy="espacio-title">{s.espacio_cultura_nombre}</h1>
<p className="espacio-section-body" data-cy="espacio-horario">{horario}</p>
```

---

## 2. Configuración de Cypress

Crear o editar el archivo `cypress.config.js` en la raíz del proyecto:

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
```

---

## 3. Estructura de los tests

Los tests se encuentran dentro de la carpeta:

```
cypress/e2e/
```

### Test 1: `home.spec.js`

```js
describe("Página principal - listado de espacios", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Carga la página y muestra tarjetas", () => {
    cy.contains("Portal de espacios culturales").should("be.visible");
    cy.get(".cards").should("exist");
    cy.get("[data-cy=card-link]").its("length").should("be.gte", 1);
  });

  it("La primera tarjeta tiene un link válido a /espacios/:id/", () => {
    cy.get("[data-cy=card-link]").first().should("have.attr", "href").and((href) => {
      expect(href).to.match(/\/espacios\/\d+\/$/);
    });
  });
});
```

### Test 2: `navigation.spec.js`

```js
describe("Navegación: listado → detalle", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Al clicar la primera tarjeta se muestra la página de detalle con título y horario", () => {
    cy.get("[data-cy=card-link]").should("have.length.gte", 1);
    cy.get("[data-cy=card-link]").first().click();

    cy.url().should("include", "/espacios/");

    cy.get("[data-cy=espacio-title]").should("be.visible").and((el) => {
      expect(el.text().length).to.be.greaterThan(3);
    });

    cy.get("[data-cy=espacio-horario]").should("be.visible");
  });
});
```

---

## 4. Scripts en `package.json`

```json
"scripts": {
  "develop": "gatsby develop",
  "build": "gatsby build",
  "serve": "gatsby serve",
  "cypress:open": "cypress open",
  "cypress:run": "cypress run"
}
```

---

## 5. Ejecución de las pruebas

1. Arranca el servidor:

```
npm run develop
```

2. Ejecuta Cypress:

```
npm run cypress:run
```

---

## 6. Qué prueban los tests

- La carga de la página principal.
- La existencia de tarjetas.
- Rutas correctas `/espacios/{id}/`.
- Navegación desde el listado a la página de detalle.
- Visualización del título y horario en la página de detalle.
