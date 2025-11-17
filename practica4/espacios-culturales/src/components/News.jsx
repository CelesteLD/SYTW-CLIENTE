import React, { useEffect, useState } from "react";

/**
 * News component - historial de noticias por espacio
 *
 * Props:
 * - espacioId (string) : identificador del espacio (obligatorio)
 * - onSave (function) : callback que recibe ({ espacioId, item }) tras crear noticia
 * - children : nodos React que serán clonados con props { title, body, handleSubmit }
 *
 * Persistencia: localStorage key = "noticias_espacios_v1"
 */

const STORAGE_KEY = "noticias_espacios_v1";

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeToStorage = (obj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
};

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function News({ espacioId, onSave, children }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!espacioId) return;
    const all = readFromStorage();
    const list = all[espacioId] || [];
    // más reciente primero
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setEntries(list);
  }, [espacioId]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!espacioId) return;
    const t = title.trim();
    const b = body.trim();
    if (!t && !b) return; // no crear noticias vacías

    const item = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: t || "(sin título)",
      body: b,
      created_at: new Date().toISOString(),
    };

    const all = readFromStorage();
    const list = all[espacioId] || [];
    list.unshift(item);
    all[espacioId] = list;
    writeToStorage(all);

    setEntries(list);
    setTitle("");
    setBody("");

    if (typeof onSave === "function") {
      try {
        onSave({ espacioId, item });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = (id) => {
    if (!espacioId) return;
    const all = readFromStorage();
    const list = (all[espacioId] || []).filter((x) => x.id !== id);
    all[espacioId] = list;
    writeToStorage(all);
    setEntries(list);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { title, body, handleSubmit });
  });

  return (
    <div className="news">
      <div className="news-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h3 style={{ margin: 0 }}>Noticias</h3>
          <p className="small" style={{ margin: "6px 0 0 0" }}>Publica novedades, eventos o avisos del espacio.</p>
        </div>
      </div>

      <form className="news-form" onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <label className="small" htmlFor={`news-title-${espacioId}`}>Título</label>
        <input
          id={`news-title-${espacioId}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título breve (opcional)"
        />

        <label className="small" htmlFor={`news-body-${espacioId}`} style={{ marginTop: "8px", display: "block" }}>Contenido</label>
        <textarea
          id={`news-body-${espacioId}`}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Cuenta lo que pasa en este lugar..."
        />

        <div className="news-actions" style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn" type="submit" disabled={!title.trim() && !body.trim()}>
            Publicar
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTitle("");
              setBody("");
            }}
          >
            Limpiar
          </button>

          {childrenWithProps}
        </div>
      </form>

      <div className="news-list" style={{ marginTop: "12px" }}>
        {entries.length === 0 ? (
          <div className="small">No hay noticias todavía.</div>
        ) : (
          entries.map((n) => (
            <article key={n.id} className="news-entry" aria-labelledby={`news-title-${n.id}`}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
                <h4 id={`news-title-${n.id}`} style={{ margin: 0, fontSize: "1rem" }}>{n.title}</h4>
                <time dateTime={n.created_at} className="small" style={{ marginLeft: "auto", color: "var(--muted)" }}>
                  {formatDate(n.created_at)}
                </time>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleDelete(n.id)}
                  aria-label="Eliminar noticia"
                  title="Eliminar"
                  style={{ marginLeft: "8px" }}
                >
                  Eliminar
                </button>
              </div>

              {n.body ? <div className="news-body" style={{ whiteSpace: "pre-wrap" }}>{n.body}</div> : <div className="small" style={{ color: "var(--muted)" }}>— Sin contenido —</div>}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
