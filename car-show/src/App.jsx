import { Canvas, useFrame } from '@react-three/fiber' 
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei' 
import { Suspense, useState, useRef } from 'react'

function Coche({ url, position, scale = 1, rotation = [0, 0, 0], titulo, descripcion, precio, setGirando}) {
  const gltf = useGLTF(url)
  const [visible, setVisible] = useState(false)
  const miCocheRef = useRef()

  // EFECTO "MOTOR ARRANCADO" 
  // Usamos useFrame para animar en cada fotograma
  useFrame((state) => {
    if (miCocheRef.current) {
      const t = state.clock.getElapsedTime()
      
      
      // 1. Vibración del motor (Rápida y corta):
      // Math.sin(t * 20) crea una oscilación rápida (20 veces por segundo aprox)
      // * 0.002 hace que sea muy sutil (2 milímetros)
      const vibracionMotor = Math.sin(t * 20) * 0.003

      // 2. Respiración de la suspensión (Lenta y suave):
      // Simula el peso del coche oscilando muy levemente
      const suspension = Math.sin(t * 2) * 0.003

      // Aplicamos la nueva posición Y (altura) sumando la posición original + los efectos
      // Nota: position[1] es la altura original que pasas como prop
      miCocheRef.current.position.y = position[1] + vibracionMotor + suspension
      
      // Micro-vibración lateral (opcional, para dar más "fuerza" al motor)
      miCocheRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.0006
    }
  })

  const estiloFicha = {
    background: 'rgba(0, 0, 0, 0.8)', 
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '8px',
    minWidth: '250px',
    textAlign: 'left',
    borderLeft: '4px solid #ff3333', 
    fontFamily: 'Arial, sans-serif'
  }
  const estiloTitulo = { margin: '0 0 10px 0', fontSize: '1.4em', textTransform: 'uppercase', letterSpacing: '2px' };
  const estiloPrecio = { marginTop: '10px', fontSize: '1.3em', fontWeight: 'bold', color: '#4ade80' };

  return (
    <group ref={miCocheRef} position={position} rotation={rotation}>
      <primitive 
        object={gltf.scene} 
        scale={scale}
        onClick={(e) => { 
          e.stopPropagation(); 
          
          const nuevoEstado = !visible; // Invertimos el estado actual
          setVisible(nuevoEstado);      // Actualizamos visibilidad
          setGirando(!nuevoEstado);     // Si abrimos (true), paramos giro (false). Si cerramos, giramos.
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      />

      {visible && (
        <Html position={[0, 2.5, 0]} center distanceFactor={15}>
          <div style={estiloFicha}>
            <h3 style={estiloTitulo}>{titulo}</h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', color: '#ccc' }}>{descripcion}</p>
            {precio && <div style={estiloPrecio}>{precio}</div>}
          </div>
        </Html>
      )}
    </group>
  )
}

function App() {
  // 1. Estado para controlar si la cámara gira o no
  const [girando, setGirando] = useState(true)

  return (
    <Canvas camera={{ position: [4, 2, 8], fov: 50 }}>
      
      <Environment 
        files="/abandoned_garage_4k.exr" 
        ground={{ height: 10, radius: 50, scale: 100 }} 
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
      <spotLight position={[0, 10, 0]} intensity={3} angle={0.5} penumbra={1} castShadow />

      <Suspense fallback={null}>
        
        {/* Pasamos la función 'setGirando' a los coches para que puedan detener la cámara */}
        <Coche 
          url="/lambo.glb" 
          position={[-10, -1, 0]} 
          rotation={[0, 1.1, 0]}   
          scale={0.036}          
          titulo="Lamborghini Aventador"
          descripcion="La bestia italiana. V12 atmosférico de 770 CV."
          precio="550.000 €"
          setGirando={setGirando} 
        />

        <Coche 
          url="/dodge.glb" 
          position={[-0, 1.5, -12]}  
          rotation={[0, 0.05, 0]}   
          scale={1.4}             
          titulo="Dodge Challenger SRT Hellcat"
          descripcion="Puro músculo americano. Motor V8 HEMI Supercharged."
          precio="65.000 €"
          setGirando={setGirando} 
        />

        <Coche 
          url="/nissan.glb" 
          position={[12, 1, -10]}  
          rotation={[0, 0.05, 0]}   
          scale={2.4}             
          titulo="Nissan GT-R"
          descripcion="Deportivo japonés icónico. Motor V6 biturbo."
          precio="95.000 €"
          setGirando={setGirando} 
        />

        <Coche 
          url="/police.glb" 
          position={[15,0,15]}  
          rotation={[0,-2.4,0]}   
          scale={3}             
          titulo="Police Car"
          descripcion="Vehículo policial clásico."
          precio="15.000 €"
          setGirando={setGirando} 
        />

      </Suspense>

      <OrbitControls 
        autoRotate={girando} 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2.1} 
        enablePan={false}
      /> 
    </Canvas>
  )
}

export default App