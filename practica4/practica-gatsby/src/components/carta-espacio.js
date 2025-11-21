import * as React from "react"
import { Link } from "gatsby"

const CartaEspacio = ({ data }) => {
  return (
    <div style={{ 
      border: "1px solid #e0e0e0", 
      borderRadius: "8px", 
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      maxWidth: "300px"
    }}>
      {/* Imagen del espacio */}
      <img 
        src={data.imagen_url_1} 
        alt={data.espacio_cultura_nombre} 
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
      />
      
      <h3 style={{ fontSize: "1.1rem", margin: "10px 0" }}>
        {data.espacio_cultura_nombre}
      </h3>
      
      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        📍 {data.direccion_municipio_nombre}
      </p>

      {/* Enlace a la página de detalle que crearemos luego */}
      <Link 
        to={"/espacio/" + data.espacio_cultural_id}
        style={{ 
          display: "inline-block", 
          marginTop: "10px", 
          textDecoration: "none", 
          color: "white", 
          backgroundColor: "#663399", 
          padding: "8px 16px", 
          borderRadius: "4px" 
        }}
      >
        Ver detalles →
      </Link>
    </div>
  )
}

export default CartaEspacio