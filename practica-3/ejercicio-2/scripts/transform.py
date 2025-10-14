import json, sys
from pathlib import Path

SRC = Path(sys.argv[1])  # ruta de tu JSON original
DST = Path(sys.argv[2])  # salida: db.json

def normalize_record(rec):
    return {
        "id": str(rec.get("espacio_cultural_id") or rec.get("id") or ""),
        "espacio_cultural_id": rec.get("espacio_cultural_id"),
        "espacio_cultura_nombre": rec.get("espacio_cultura_nombre") or rec.get("nombre") or "Sin nombre",
        "horario": rec.get("horario") or None,
        "imagen_url_1": rec.get("imagen_url_1") or None,
        "direccion_municipio_nombre": rec.get("direccion_municipio_nombre") or None,
        "direccion_codigo_postal": rec.get("direccion_codigo_postal") or None,
        "pagina_web": rec.get("pagina_web") or None,
        "biblioteca": rec.get("biblioteca") or rec.get("es_biblioteca") or None,
        "museo": rec.get("museo") or None,
        "centro_cultural": rec.get("centro_cultural") or None,
    }

def is_yes(v):
    return str(v).strip().lower() in {"sí","si","true","1","yes"}

# carga (acepta array o objeto con clave 'espacios')
raw = json.loads(SRC.read_text(encoding="utf-8"))
items = raw if isinstance(raw, list) else raw.get("espacios", [])

filtered = []
for r in items:
    nr = normalize_record(r)
    # Filtra por tipología si quieres reducir tamaño (ej.: bibliotecas)
    if not nr.get("biblioteca") or not is_yes(nr.get("biblioteca")):
        continue
    filtered.append(nr)

db = {"espacios": filtered}
DST.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"OK → escrito {len(filtered)} registros en {DST}")