import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";

export default function IndexPage({ data }) {
  const spaces = data.allEspacio.nodes || [];

  return (
    <Layout>
      <h2>🇮🇨 Portal de espacios culturales de Canarias 📚 </h2>
      <div className="cards" role="list">
        {spaces.map((s) => {
          console.log("space node:", s);
          const id = s.espacio_id ?? s.id; // fallback si falta espacio_id
          const to = id ? `/espacios/${id}/` : "/"; // evita /espacios/undefined

          return (
            <Link
              key={id ?? Math.random()}
              to={to}
              className="card-link"
              aria-label={`Ir a la página de ${s.espacio_cultura_nombre || "espacio"}`}
            >
              <article className="card" role="listitem" aria-labelledby={`title-${id}`}>
                <Avatar name={s.espacio_cultura_nombre || "Espacio"} size={64} />
                <div className="card-content">
                  <h3 id={`title-${id}`}>{s.espacio_cultura_nombre || "— Sin nombre —"}</h3>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}

export const query = graphql`
  query {
    allEspacio {
      nodes {
        espacio_id
        espacio_cultura_nombre
      }
    }
  }
`;
