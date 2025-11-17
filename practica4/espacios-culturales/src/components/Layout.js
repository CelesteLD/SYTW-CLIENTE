import * as React from "react";
import { Link } from "gatsby";

const Layout = ({ children }) => (
  <div className="site">
    <header>
      <nav>
        <Link to="/">Inicio</Link> {" | "}
      </nav>
    </header>
    <main>{children}</main>
    <footer>© {new Date().getFullYear()} Espacios Culturales</footer>
  </div>
);

export default Layout;
