import * as React from "react"
import { Link } from "gatsby"
import logoULL from "../images/ull.svg" 

const Header = ({ siteTitle }) => (
  <header
    style={{
      backgroundColor: "#480861", 
      marginBottom: `1.45rem`,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 1200, 
        padding: `1rem 1.5rem`,
        display: "flex", 
        alignItems: "center",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img 
          src={logoULL} 
          alt="Logo ULL" 
          style={{ 
            height: "50px", 
            margin: 0, 
            filter: "brightness(0) invert(1)" 
          }} 
        />
      </Link>
        
      {/* 2. TÍTULO (Centro) */}
      <h1 style={{ 
          margin: 0, 
          fontSize: "1.5rem",
          flex: 1,            // Ocupar todo el espacio disponible
          textAlign: "center" 
        }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {siteTitle}
        </Link>
      </h1>

      <nav style={{ minWidth: "50px", textAlign: "right" }}> 
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Inicio</Link>
      </nav>

    </div>
  </header>
)

export default Header