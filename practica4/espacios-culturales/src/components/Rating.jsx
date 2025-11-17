import React, { useState, useEffect } from "react";

/**
 * Rating component v2 - historial de valoraciones
 *
 * Props:
 * - espacioId (string) : identificador del espacio (obligatorio)
 * - maxStars (number) : número de estrellas (default 5)
 * - onSave (function) : callback que recibe ({ espacioId, entry }) tras guardar
 * - children : nodos React que serán clonados con props { rating, comment, handleSubmit }
 *
 * Persistencia: localStorage key = "valorar_espacios_v2"
 */

const STORAGE_KEY = "valorar_espacios_v2";

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

const Star = ({ filled, index, onClick, onKeyDown, label }) => (
  <button
    type="button"
    className={`rating-star ${filled ? "filled" : "empty"}`}
    aria-label={`${index} ${index === 1 ? "estrella" : "estrellas"}`}
    aria-pressed={filled}
    onClick={() => onClick(index)}
    onKeyDown={(e) => onKeyDown(e, index)}
    title={`${index} ${index === 1 ? "estrella" : "estrellas"}`}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M12 .587l3.668 7.431L23.2 9.75l-5.6 5.462L18.8 24 12 19.897 5.2 24l1.2-8.788L.8 9.75l7.532-1.732z" />
    </svg>
  </button>
);

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function Rating({ espacioId, maxStars = 5, onSave, children }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [entries, setEntries] = useState([]);

  // carga inicial
  useEffect(() => {
    if (!espacioId) return;
    const all = readFromStorage();
    const list = all[espacioId] || [];
    // ordenar por fecha descendente (más reciente arriba)
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setEntries(list);
  }, [espacioId]);

  const handleStarClick = (i) => setRating(i);

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStarClick(i);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setRating((r) => Math.min(maxStars, r + 1));
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setRating((r) => Math.max(0, r - 1));
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!espacioId) {
      console.warn("Rating: espacioId ausente");
      return;
    }
    if (rating === 0) {
      // evita enviar sin estrellas
      return;
    }
    const entry = {
      rating,
      comment: comment.trim(),
      created_at: new Date().toISOString(),
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };

    const all = readFromStorage();
    const list = all[espacioId] || [];
    list.unshift(entry); // añadir al principio (más reciente)
    all[espacioId] = list;
    writeToStorage(all);

    setEntries(list);
    setRating(0);
    setHover(0);
    setComment("");

    if (typeof onSave === "function") {
      try {
        onSave({ espacioId, entry });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = (entryId) => {
    if (!espacioId) return;
    const all = readFromStorage();
    const list = (all[espacioId] || []).filter((e) => e.id !== entryId);
    all[espacioId] = list;
    writeToStorage(all);
    setEntries(list);
  };

  // clonar children con props útiles
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { rating, comment, handleSubmit });
  });

  const average = entries.length ? (entries.reduce((s, e) => s + e.rating, 0) / entries.length) : 0;
  const avgRounded = Math.round(average * 10) / 10;

  return (
    <div className="rating">
      <div className="rating-header" aria-hidden={false}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <h3 id={`valorar-${espacioId}`} style={{ margin: 0 }}>Valora este sitio</h3>
            <p className="small" style={{ margin: "4px 0 0 0" }}>Haz clic en las estrellas y deja un comentario.</p>
          </div>
          <div className="rating-summary small" aria-live="polite">
            {entries.length ? (
              <div>
                Media: <strong>{avgRounded}</strong> · {entries.length} {entries.length === 1 ? "valoración" : "valoraciones"}
              </div>
            ) : (
              <div>No hay valoraciones aún</div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} aria-labelledby={`valorar-${espacioId}`} className="rating-form">
        <div
          className="rating-stars"
          role="radiogroup"
          aria-label="Valoración en estrellas"
          onMouseLeave={() => setHover(0)}
        >
          {Array.from({ length: maxStars }).map((_, idx) => {
            const i = idx + 1;
            const isFilled = hover ? i <= hover : i <= rating;
            return (
              <span
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseMove={() => setHover(i)}
              >
                <Star
                  filled={isFilled}
                  index={i}
                  onClick={handleStarClick}
                  onKeyDown={handleKeyDown}
                  label={i}
                />
              </span>
            );
          })}
        </div>

        <div className="rating-body">
          <label htmlFor={`rating-comment-${espacioId}`} className="small">Comentario</label>
          <textarea
            id={`rating-comment-${espacioId}`}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu opinión..."
          />
        </div>

        <div className="rating-actions">
          <button className="btn" type="submit" disabled={rating === 0}>
            Enviar valoración
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setRating(0);
              setComment("");
            }}
          >
            Limpiar
          </button>

          {childrenWithProps}
        </div>
      </form>

      {/* Registro de valoraciones */}
      <div className="rating-list" aria-live="polite" style={{ marginTop: "1rem" }}>
        {entries.length === 0 ? (
          <div className="small">Sé el primero en valorar este lugar.</div>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="rating-entry" role="article" aria-label={`Valoración del ${formatDate(e.created_at)}`}>
              <div className="entry-head">
                <div className="entry-stars" aria-hidden="true">
                  {Array.from({ length: maxStars }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="14" height="14" className={i < e.rating ? "filled" : "empty"}>
                      <path d="M12 .587l3.668 7.431L23.2 9.75l-5.6 5.462L18.8 24 12 19.897 5.2 24l1.2-8.788L.8 9.75l7.532-1.732z" />
                    </svg>
                  ))}
                </div>
                <div className="entry-meta small">
                  <time dateTime={e.created_at}>{formatDate(e.created_at)}</time>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleDelete(e.id)}
                    aria-label="Eliminar valoración"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {e.comment ? <div className="entry-comment">{e.comment}</div> : <div className="small" style={{ color: "var(--muted)" }}>— Sin comentario —</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
