# Ejercicios de Sass 🎯

Este directorio contiene **ejercicios prácticos de Sass** realizados como parte de la práctica.  
Cada ejercicio se encuentra en su propia carpeta (`ejercicio-1`, `ejercicio-2`, …) e incluye sus archivos SCSS, CSS compilado y un `index.html` de prueba.

---

## 📂 Estructura
``` 
    ejercicios/
    ├── ejercicio-1/ # Variables de color y aplicación en body, h1, h2
    ├── ejercicio-2/ # Sistema de mensajes (info, éxito, error)
    ├── ejercicio-3/ # Mixins para flex-direction y tamaños fijos
    └── ejercicio-4/ # Bucle @for para clases de margen
```

---

## 📝 Descripción de cada ejercicio

### Ejercicio 1: Variables de color
- Definición de un parcial `_variables.scss`.
- Variables `$color-primary` y `$color-secondary`.
- Uso en el `body`, `h1` y `h2`.

### Ejercicio 2: Sistema de mensajes
- Uso de un **placeholder** `%message-base` para estilos comunes.
- Variantes `.message--info`, `.message--success`, `.message--error`.
- Enlaces dentro de los mensajes de error aparecen **en negrita**.
- Modular y **DRY** gracias a mapas y `@each`.

### Ejercicio 3: Mixins flex & size
- Mixin `flex-direction()` para configurar dirección y alineado en contenedores flex.
- Mixin `fixed-size()` para asignar ancho y alto fijos a elementos.
- Ejemplo práctico con cajas.

### Ejercicio 4: Bucle @for
- Generación automática de clases `.margin-1` a `.margin-5`.
- Cada clase aplica un margen de `10px * n`.

---

## ▶️ Cómo probar
1. Entrar en la carpeta de cada ejercicio:
   ```
   cd ejercicio-1
2. Compilar con Sass
    ```
    sass scss/main.scss css/main.css --style=expanded
3. Abrir index.html en el navegador.