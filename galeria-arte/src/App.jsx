import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function App() {
  return (
    // El Canvas es tu ventana al mundo 3D
    <Canvas camera={{ position: [3, 3, 3] }}>
      
      {/* Luces: Sin luz, no vemos nada */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Un objeto de prueba: Un cubo morado */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      {/* Controles para mover la cámara con el ratón */}
      <OrbitControls />
      
    </Canvas>
  )
}

export default App