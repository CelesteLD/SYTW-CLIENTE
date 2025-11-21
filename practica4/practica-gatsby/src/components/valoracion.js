import React, { useState, useEffect } from "react"

const Valoracion = ({ idEspacio }) => {
  // Estado para la puntuación actual (por defecto 0)
  const [puntuacion, setPuntuacion] = useState(0)
  // Estado para saber si el usuario ya ha votado
  const [haVotado, setHaVotado] = useState(false)

  // Clave única para guardar en el navegador
  const STORAGE_KEY = `voto_espacio_${idEspacio}`

  // 1. Al cargar la página, miramos si ya había un voto guardado
  useEffect(() => {
    const votoGuardado = localStorage.getItem(STORAGE_KEY)
    if (votoGuardado) {
      setPuntuacion(parseInt(votoGuardado))
      setHaVotado(true)
    } else {
      // Si no hay voto personal, ponemos una media ficticia inicial de 4
      setPuntuacion(4) 
    }
  }, [idEspacio])

  // 2. Función para manejar el clic en una estrella
  const votar = (valor) => {
    setPuntuacion(valor)
    setHaVotado(true)
    // Guardamos en el navegador
    localStorage.setItem(STORAGE_KEY, valor)
  }

  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{ fontSize: "1.5rem", cursor: "pointer" }}>
        {/* Generamos 5 estrellas dinámicamente */}
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            onClick={() => votar(estrella)}
            style={{ 
              color: estrella <= puntuacion ? "#FFD700" : "#ccc", // Oro si está seleccionada, gris si no
              marginRight: "5px",
              transition: "color 0.2s"
            }}
          >
            ★
          </span>
        ))}
      </div>
      
      <span style={{ color: "#666", fontSize: "0.9rem" }}>
        {haVotado 
          ? `¡Gracias por tu voto de ${puntuacion} estrellas!` 
          : "(Haz clic en las estrellas para valorar)"}
      </span>
    </div>
  )
}

export default Valoracion