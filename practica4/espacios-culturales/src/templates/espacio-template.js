import * as React from "react";
import Layout from "../components/Layout";
import { graphql } from "gatsby";
import Avatar from "../components/Avatar";
import Rating from "../components/Rating";
import News from "../components/News";

const normalizeHorario = (h) => {
  if (!h) return "No disponible";
  if (String(h).trim().toUpperCase() === "_U") return "Lunes a viernes de 8:00 a 14:00";
  return h;
};

export const query = graphql`
  query($espacio_id: String!) {
    espacio(espacio_id: { eq: $espacio_id }) {
      espacio_id
      espacio_cultura_nombre
      horario
      imagen_url_1
      direccion_municipio_nombre
      direccion_codigo_postal
      pagina_web
      biblioteca
      museo
      centro_cultural
    }
  }
`;

const EspacioTemplate = ({ data }) => {
  const s = data.espacio || {};
  const horario = normalizeHorario(s.horario);

  return (
    <Layout>
      <article className="espacio-article">
        <div className="espacio-hero">
          <div className="espacio-hero-left">
            {/* Avatar: el componente Avatar puede mantener su SVG; envolvemos con clase para estilo */}
            <div className="avatar-wrap">
              <Avatar name={s.espacio_cultura_nombre} size={96} />
            </div>

            <div className="espacio-hero-meta">
              <h1 className="espacio-title">{s.espacio_cultura_nombre}</h1>

              <div className="hero-actions">
                {s.pagina_web && (
                  <a
                    className="btn-visit"
                    href={s.pagina_web}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden style={{ marginRight: 8 }}>
                      <path d="M14 3v2h3.59L7 15.59 8.41 17 19 6.41V10h2V3zM5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z"/>
                    </svg>
                    Visitar web
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TOP: horario y dirección */}
        <div className="top-info-grid">
          <div className="top-info-left">
            <section aria-labelledby="horario" className="espacio-section">
              <h2 id="horario" className="espacio-section-title">Horario</h2>
              <p className="espacio-section-body">{horario}</p>
            </section>
          </div>

          <div className="top-info-right">
            <div className="espacio-panel direccion-panel" aria-labelledby="direccion">
              <h3 id="direccion" style={{ margin: 0 }}>Dirección</h3>
              <p className="small" style={{ marginTop: "6px" }}>
                {s.direccion_municipio_nombre || "—"} ({s.direccion_codigo_postal || "—"})
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM: valoraciones y noticias */}
        <div className="bottom-panels-grid">
          <main className="bottom-left">
            <div className="espacio-panel">
              <div className="section-header-row">
              </div>

              <Rating
                espacioId={s.espacio_id}
                onSave={({ espacioId, entry }) => {
                  console.log("Nueva valoración:", espacioId, entry);
                }}
              />
            </div>
          </main>

          <aside className="bottom-right" aria-labelledby="noticias">
            <div className="espacio-panel">
              <News
                espacioId={s.espacio_id}
                onSave={({ espacioId, item }) => {
                  console.log("Noticia publicada:", espacioId, item);
                }}
              />
            </div>
          </aside>
        </div>
      </article>
    </Layout>
  );
};

export default EspacioTemplate;
