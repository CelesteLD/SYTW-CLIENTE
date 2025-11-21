import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Noticias from "../components/noticias"
import Valoracion from "../components/valoracion"

// Esta es la plantilla visual de la página
const PlantillaEspacio = ({ data }) => {
  const espacio = data.espacioCultural // Aquí llegan los datos de GraphQL

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <Link to="/">← Volver al inicio</Link>
        
        {/* Título del Espacio */}
        <h1 style={{ color: "#663399", marginTop: "20px" }}>
          {espacio.espacio_cultura_nombre}
        </h1>

        {/* Componente de Valoración (Micro-frontend) */}
        <Valoracion idEspacio={espacio.espacio_cultural_id}/>

        {/* Imagen Principal */}
        <img 
          src={espacio.imagen_url_1} 
          alt={espacio.espacio_cultura_nombre}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }} 
        />

        {/* Información Detallada */}
        <div style={{ margin: "20px 0" }}>
          <p><strong>📍 Municipio:</strong> {espacio.direccion_municipio_nombre} ({espacio.direccion_codigo_postal})</p>
          <p><strong>🕘 Horario:</strong> {espacio.horario}</p>
          <p><strong>🌐 Web:</strong> <a href={espacio.pagina_web} target="_blank" rel="noreferrer">Visitar sitio web</a></p>
          
          <p>
             Este espacio cuenta con: 
             {espacio.biblioteca === "sí" ? " 📚 Biblioteca" : ""} 
             {espacio.museo === "sí" ? " 🏛️ Museo" : ""}
          </p>
        </div>

        {/* Componente de Noticias (Micro-frontend) */}
        <Noticias idEspacio={espacio.espacio_cultural_id}/>

      </div>
    </Layout>
  )
}

// Esta consulta busca UN solo espacio usando el ID que le pasamos desde gatsby-node
export const query = graphql`
  query($id: String!) {
    espacioCultural(id: { eq: $id }) {
      espacio_cultura_nombre
      horario
      imagen_url_1
      direccion_municipio_nombre
      direccion_codigo_postal
      pagina_web
      biblioteca
      museo
      espacio_cultural_id
    }
  }
`

// Título de la pestaña del navegador 
export const Head = ({ data }) => <title>{data.espacioCultural.espacio_cultura_nombre}</title>

export default PlantillaEspacio