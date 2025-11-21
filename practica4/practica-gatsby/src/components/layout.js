import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      
      {/* Cabecera importada */}
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />

      {/* Contenedor principal */}
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `1200px`,
          padding: `0 1.5rem`,
          flexGrow: 1, // Empujar el footer ahcia abajo
          width: "100%",
        }}
      >
        {/* Tarjeta blanca para el contenido */}
        <main style={{ 
            backgroundColor: "white", 
            padding: "40px", 
            borderRadius: "8px", 
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            minHeight: "60vh" 
        }}>
            {/* Prop para inyectar contenido en el layout */ }
            {children} 
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "#ccc",
          padding: `2rem`,
          textAlign: "center",
          marginTop: `3rem`,
          borderTop: "5px solid #480861" 
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontWeight: "bold", color: "white", marginBottom: "10px" }}>
            Escuela Superior de Ingeniería y Tecnología
          </p>
          <p style={{ fontSize: "0.9rem", margin: "5px 0" }}>
            Máster en Ingeniería Informática <br/>
            Sistemas y Tecnologías Web: Cliente
          </p>
          
          <hr style={{ borderColor: "#555", margin: "20px auto", width: "50%" }}/>
          
          <p style={{ fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} · Práctica desarrollada con 
            {` `}
            <a href="https://www.gatsbyjs.com" style={{ color: "#a679d6", textDecoration: "none" }}>Gatsby</a>
            {` `} y {` `}
            <a href="https://reactjs.org" style={{ color: "#61dafb", textDecoration: "none" }}>React</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout