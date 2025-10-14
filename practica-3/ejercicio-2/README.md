# Ejercicio 2 — Web Components: Espacios culturales (tarjetas + rating)

## Objetivo
Construir una vista de **tarjetas** de espacios culturales usando **Web Components nativos**, consumiendo datos desde un JSON servido como “API” estática, y añadiendo un **sistema de valoración de 1–5 estrellas**.

---

## Estructura
```
practica-3/ejercicio-2/
├── index.html
├── scripts/
│   ├── db.json          # ejemplo de salida compatible con My JSON Server / CDN
│   ├── espacios.json    # dataset original (o reducido) de referencia
│   └── transform.py     # script para normalizar/filtrar → db.json
├── src/
    ├── app.js           # <cultura-app>: carga JSON, filtra, búsqueda y lista tarjetas
    ├── card.js          # <cultura-card>: tarjeta minimal (nombre, horario, municipio·CP, rating)
    └── rating.js        # <cultura-rating>: 5⭐ con persistencia en localStorage
```

---

## Datos (API estática)
Para evitar montar un backend, consumimos el JSON vía **CDN** con CORS abierto:
```
https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json
```
> Formato esperado: `{ "espacios": [ { ... } ] }` con los campos usados en las tarjetas.

**Campos utilizados por tarjeta:**
- `espacio_cultura_nombre`
- `horario` (fallback: “Horario no disponible” cuando `_U` o vacío)
- `direccion_municipio_nombre`
- `direccion_codigo_postal`
- `espacio_cultural_id` (también como `id` para identificar cada entrada)

---

## Componentes (Web Components)
- `<cultura-app>`: carga el JSON (prop `data-url`), permite **filtrar por tipología** (ej. `biblioteca`) y **buscar** por nombre/municipio. Renderiza una **grid** de `<cultura-card>`.
- `<cultura-card>`: tarjeta **sin imagen** (diseño minimal), con **badge** de color e iniciales, muestra **nombre**, **horario**, **municipio·CP** y el rating.
- `<cultura-rating>`: control de **5 estrellas**. Guarda la valoración por `item-id` en **localStorage**. Es **reactivo** al hacer clic y **persistente** tras recargar.

---

## Scripts (`scripts/transform.py`)
Script para **normalizar** y **filtrar** el JSON original y producir un `db.json` compatible:
- Renombra/garantiza campos clave (incluye `id`).
- Opcional: **filtra por tipología** (p. ej. `biblioteca`) para reducir tamaño.
- Salida: `{"espacios": [ ... ]}`.

**Uso:**
```bash
cd practica-3/ejercicio-2/scripts
python3 transform.py espacios.json db.json
```

---

## Ejecución local
No hay dependencias. Abrir con un servidor estático (recomendado Live Server) desde `practica-3/ejercicio-2/` y acceder a `index.html`.

En `index.html` se configura la URL de datos y el filtro inicial:
```html
<cultura-app
  data-url="https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json"
  filtro="biblioteca">
</cultura-app>
```

---

## Decisiones de diseño
- **Sin imágenes**: muchos enlaces del dataset no cargan, así que se usa un **layout limpio** con badge de color e iniciales.
- **Accesibilidad**: botones de estrella con `aria-label` y estado `aria-pressed`; texto legible y roles adecuados.
- **Persistencia local**: `localStorage` para mantener el rating por elemento.
- **Robustez**: fallback en `horario` y en datos vacíos.

---