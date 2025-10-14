# Práctica 1 · Sass 🎨

Este repositorio contiene la **Práctica 1 de la asignatura**, dedicada al uso de **Sass** como preprocesador CSS.  
El objetivo es aprender a organizar y estructurar estilos de manera **modular, reutilizable y mantenible**, aplicando conceptos como **variables, mixins, parciales, Grid y Flexbox**.

---

## 📂 Estructura del repositorio

```
    ├── ejercicios/ # Ejercicios individuales de Sass (1 a 4)
    └── saas-webapp/ # Práctica principal: landing page basada en mockup
```

### 🔹 `ejercicios/`
Contiene cuatro ejercicios independientes, cada uno en su propia carpeta (`ejercicio-1` … `ejercicio-4`).  
- **Ejercicio 1**: uso de variables.  
- **Ejercicio 2**: sistema de mensajes (info, éxito, error).  
- **Ejercicio 3**: creación de mixins para flex y tamaños fijos.  
- **Ejercicio 4**: bucle `@for` para generar clases de margen.  

### 🔹 `saas-webapp/`
Contiene la práctica completa: una **landing page** desarrollada a partir de un mockup.  
Incluye estructura modular en Sass (`base/`, `layout/`, variables y mixins) y uso de **Grid y Flexbox** para el diseño.

---

## ✅ Organización
La separación entre **ejercicios** y **proyecto webapp** permite mantener el repositorio **claro y navegable**:  
- Los ejercicios demuestran de forma aislada conceptos específicos de Sass.  
- La webapp integra todos esos conceptos en un proyecto realista y completo.  

---

## ▶️ Cómo usar
1. Entrar en la carpeta deseada (`ejercicios/ejercicio-x` o `saas-webapp/`).  
2. Compilar Sass:
   ```bash
   sass scss/main.scss css/main.css --style=expanded
    (o style.css en el caso de saas-webapp)
3. Abrir index.html en el navegador.