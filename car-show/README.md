# 🏎️ Virtual Car Showroom - React Three Fiber

Esta práctica consiste en una aplicación web inmersiva en 3D que simula un concesionario de coches de alto rendimiento. Desarrollada con **React** y el ecosistema de **Three.js**, la aplicación permite explorar vehículos en un entorno realista con iluminación basada en físicas (HDRI).

![Captura de pantalla del proyecto](./public/image1.png)

## 📋 Características Principales

* **Entorno realista:** Escenario inmersivo utilizando un mapa HDRI 4K ("Abandoned Garage") que proporciona iluminación y reflejos naturales en las carrocerías.
* **Modelos 3D interactivos:** Carga de múltiples modelos GLTF (Lamborghini, Dodge, Nissan, etc.) encapsulados en componentes reutilizables.
* **Animación procedural ("Engine Idle"):** Implementación de micro-animaciones mediante `useFrame` para simular la vibración del motor y la suspensión de los coches al ralentí.
* **Interfaz flotante (UI):** Etiquetas HTML integradas en la escena 3D que muestran información técnica y precio al hacer clic en los vehículos.
* **Cámara cinemática:** Control orbital con rotación automática (`autoRotate`) que se detiene inteligentemente al interactuar con un coche para facilitar la lectura.

## 🛠️ Tecnologías Utilizadas

* **[React](https://reactjs.org/):** Librería principal para la interfaz de usuario.
* **[Vite](https://vitejs.dev/):** Entorno de desarrollo rápido.
* **[React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber):** Renderizador de Three.js para React.
* **[@react-three/drei](https://github.com/pmndrs/drei):** Colección de ayudantes y abstracciones para R3F (Environment, OrbitControls, Html, useGLTF).

## 🚀 Instalación y Ejecución

Para probar este proyecto en local, sigue estos pasos:

1.  **Clonar el repositorio** (o descargar la carpeta):
    ```bash
    git clone https://github.com/CelesteLD/SYTW-CLIENTE.git
    ```

2.  **Instalar dependencias:**
    Navega a la carpeta del proyecto y ejecuta:
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Visita `http://localhost:5173/` (o el puerto que indique la terminal).

## 💡 Detalles de Implementación

### Componente `Coche`
Se ha creado un componente modular que acepta propiedades como `url`, `position`, `rotation` y `scale`. Esto permite instanciar tantos coches como se desee sin duplicar código.

### Lógica de Animación (`useFrame`)
Para simular que los coches están "arrancados", no se han usado animaciones pre-grabadas. Se ha calculado matemáticamente en tiempo real:
```javascript
useFrame((state) => {
  const t = state.clock.getElapsedTime();
  // Vibración rápida para el motor
  const vibracion = Math.sin(t * 20) * 0.003; 
  // Oscilación lenta para la suspensión
  const suspension = Math.sin(t * 2) * 0.003; 
  
  ref.current.position.y = posicionInicial + vibracion + suspension;
});

