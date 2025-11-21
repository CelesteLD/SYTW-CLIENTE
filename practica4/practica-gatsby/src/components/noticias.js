import React, { useState, useEffect } from "react"

const Noticias = ({ idEspacio }) => {
  // Estado para la lista de noticias
  const [listaNoticias, setListaNoticias] = useState([])
  // Estado para el texto nuevo que escribimos
  const [nuevoTexto, setNuevoTexto] = useState("")

  const STORAGE_KEY = `noticias_espacio_${idEspacio}`

  // 1. Cargar noticias al iniciar
  useEffect(() => {
    const guardadas = localStorage.getItem(STORAGE_KEY)
    if (guardadas) {
      setListaNoticias(JSON.parse(guardadas))
    } else {
      // Datos iniciales de ejemplo si no hay nada guardado
      setListaNoticias([
        { id: 1, texto: "📅 Próximo evento: Jornadas de puertas abiertas este fin de semana.", fecha: new Date().toLocaleDateString() }
      ])
    }
  }, [idEspacio])

  // 2. Función para añadir noticia
  const agregarNoticia = (e) => {
    e.preventDefault() // Evitar que se recargue la página
    if (!nuevoTexto.trim()) return

    const nuevaNoticia = {
      id: Date.now(), // Usamos la hora como ID único
      texto: nuevoTexto,
      fecha: new Date().toLocaleDateString()
    }

    const nuevaLista = [nuevaNoticia, ...listaNoticias] // Añadimos al principio
    setListaNoticias(nuevaLista)
    setNuevoTexto("") // Limpiamos el input
    
    // Guardamos en LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista))
  }

  return (
    <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
      <h3>📰 Noticias y Comentarios</h3>

      {/* Formulario para añadir */}
      <form onSubmit={agregarNoticia} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
          placeholder="Escribe una nueva noticia o comentario..."
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button 
          type="submit" 
          style={{ backgroundColor: "#663399", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
        >
          Publicar
        </button>
      </form>

      {/* Lista de noticias */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {listaNoticias.map((noticia) => (
          <div key={noticia.id} style={{ 
            backgroundColor: "#f9f9f9", 
            padding: "15px", 
            borderLeft: "4px solid #663399",
            borderRadius: "0 4px 4px 0"
          }}>
            <p style={{ margin: "0 0 5px 0" }}>{noticia.texto}</p>
            <small style={{ color: "#888" }}>Publicado el: {noticia.fecha}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Noticias