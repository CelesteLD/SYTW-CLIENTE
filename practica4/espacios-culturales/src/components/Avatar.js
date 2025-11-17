import React from "react";

/**
 * Genera un hash simple a partir de un string.
 * Retorna un número entero.
 */
const hashString = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return h >>> 0;
};

/**
 * Convierte un hash en un color HSL legible.
 * Devuelve cadena "hsl(h, s%, l%)"
 */
const hashToHsl = (hash) => {
  const h = hash % 360; // matchea en el hue
  // saturación y luminosidad agradables
  const s = 60 + (hash % 20); // 60-79%
  const l = 45 + (hash % 10); // 45-54%
  return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Extrae hasta 2 iniciales del nombre.
 * Ej: "Archivo Histórico Provincial" : "AH"
 */
const getInitials = (name = "") => {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    // toma las dos primeras letras de la única palabra si tiene >=2
    return words[0].slice(0, 2).toUpperCase();
  }
  const first = words[0][0] || "";
  const second = words[1][0] || "";
  return (first + second).toUpperCase();
};

const Avatar = ({ name = "", size = 64, className = "" }) => {
  const label = name || "Espacio";
  const initials = getInitials(label);
  const h = hashString(label.toLowerCase());
  const bg = hashToHsl(h);
  const textColor = (h % 360) > 200 && (h % 360) < 330 ? "#fff" : "#111";

  const fontSize = Math.round(size * 0.38);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Avatar de ${label}`}
      className={`avatar ${className}`}
    >
      <title>{`Avatar de ${label}`}</title>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={bg} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        fontSize={fontSize}
        fill={textColor}
        style={{ fontWeight: 600, userSelect: "none" }}
      >
        {initials}
      </text>
    </svg>
  );
};

export default Avatar;
