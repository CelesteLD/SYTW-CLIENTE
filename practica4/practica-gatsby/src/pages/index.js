import * as React from "react"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image" // Tarea 4: Importar el componente 
import Layout from "../components/layout"
import CartaEspacio from "../components/carta-espacio"

const IndexPage = ({ data }) => {
  // Aquí recibimos los 6 espacios que pedimos en la consulta de abajo
  const espacios = data.allEspacioCultural.nodes

  return (
    <Layout>
      {/* Tarea 4: Imagen optimizada estática (Banner principal) */}
      <div style={{ position: "relative", marginBottom: "40px", textAlign: "center" }}>
        <StaticImage
          src="../images/portada.jpg" 
          alt="Espacios Culturales de Canarias"
          placeholder="blurred"
          layout="fullWidth"
          style={{ maxHeight: "300px" }}
        />
        <h1 style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          color: "white", 
          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          fontSize: "3rem",
          width: "100%"
        }}>
          Espacios Culturales
        </h1>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ borderBottom: "2px solid #663399", paddingBottom: "10px", marginBottom: "30px" }}>
          ✨ Espacios Destacados
        </h2>

        {/* Rejilla de cartas (Grid) */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "30px",
          justifyItems: "center"
        }}>
          {/* Recorremos los datos y creamos una carta por cada uno  */}
          {espacios.map(espacio => (
            <CartaEspacio key={espacio.id} data={espacio} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

// Título de la página en el navegador
export const Head = () => <title>Inicio - Espacios Culturales</title>

// Consulta GraphQL para la Home
export const query = graphql`
  query {
    allEspacioCultural(limit: 6) {
      nodes {
        id
        espacio_cultura_nombre
        imagen_url_1
        direccion_municipio_nombre
        espacio_cultural_id
      }
    }
  }
`

export default IndexPage