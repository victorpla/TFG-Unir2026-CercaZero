import api from "./api";

/**
 * Normaliza un item individual devuelto por el backend:
 *
 *  - `_id` (Mongo) -> `id`. Los ejemplos de Postman muestran IDs con forma
 *    de ObjectId (p.ej. "64a573c10b8782d282efbbf1"), así que es muy
 *    probable que el backend devuelva `_id` en vez de `id`. Si en tu caso
 *    ya viene como `id`, esto no rompe nada (usa el que exista).
 *
 *  - Ubicación -> siempre `{ lat, lng }` en `item.location`, sea cual sea
 *    la forma real que use el backend: plana (`item.lat`/`item.lng`,
 *    que es como se ENVÍA en POST /items), anidada (`item.location.lat/lng`)
 *    o GeoJSON Point (`item.location.coordinates: [lng, lat]`, típico de
 *    índices geoespaciales de MongoDB).
 *
 * No tenemos aún una respuesta de ejemplo capturada en la colección de
 * Postman (los "response": [] vienen vacíos), así que esta normalización
 * cubre las formas más probables. Si ves un error o coordenadas raras en
 * el mapa, comparte un ejemplo real de la respuesta de /items/nearby y
 * ajustamos esta función.
 */
function normalizeItem(item) {
  if (!item || typeof item !== "object") return item;

  const id = item.id ?? item._id;

  // Intenta extraer { lat, lng } de todos los formatos conocidos.
  // El orden importa: primero los más específicos.
  let location = null;

  // 1. Campos numéricos planos: { lat, lng } o { latitude, longitude }
  //    (igual que se ENVÍAN en POST /items según Postman)
  const rawLat = item.lat ?? item.latitude;
  const rawLng = item.lng ?? item.longitude;
  if (rawLat != null && rawLng != null) {
    const lat = parseFloat(rawLat);
    const lng = parseFloat(rawLng);
    if (!isNaN(lat) && !isNaN(lng)) location = { lat, lng };
  }

  // 2. Objeto anidado { location: { lat, lng } } o { location: { latitude, longitude } }
  if (!location && item.location && typeof item.location === "object" && !Array.isArray(item.location)) {
    const nLat = item.location.lat ?? item.location.latitude;
    const nLng = item.location.lng ?? item.location.longitude;
    if (nLat != null && nLng != null) {
      const lat = parseFloat(nLat);
      const lng = parseFloat(nLng);
      if (!isNaN(lat) && !isNaN(lng)) location = { lat, lng };
    }
  }

  // 3. GeoJSON Point: { location: { type: "Point", coordinates: [lng, lat] } }
  //    Típico de índices geoespaciales de MongoDB ($near / $geoNear)
  if (!location && Array.isArray(item.location?.coordinates) && item.location.coordinates.length >= 2) {
    const [lng, lat] = item.location.coordinates;
    if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
  }

  // 4. Objeto { coords: { lat, lng } } — menos común pero posible
  if (!location && item.coords?.lat != null && item.coords?.lng != null) {
    const lat = parseFloat(item.coords.lat);
    const lng = parseFloat(item.coords.lng);
    if (!isNaN(lat) && !isNaN(lng)) location = { lat, lng };
  }

  // Si ningún formato encajó, logueamos el ítem completo para que puedas
  // ver exactamente qué devuelve tu backend y añadir el caso que falta.
  if (!location) {
    console.warn(
      "[CercaZero] No se pudo extraer lat/lng del ítem. " +
        "Busca en este objeto el campo que contiene las coordenadas y " +
        "añade el caso correspondiente en normalizeItem() de itemsService.js:",
      JSON.stringify(item, null, 2)
    );
  }

  return { ...item, id, location };
}

/**
 * El backend puede envolver el array de resultados de formas distintas
 * según la convención que uses (`{ items }`, `{ data }`, `{ results }`,
 * un array "pelado", etc.). Normalizamos aquí para que el resto de la app
 * SIEMPRE reciba un array de items ya normalizados (`id` + `location`
 * consistentes) — así componentes como DonationMap pueden hacer `.map()`
 * y leer `item.id` / `item.location.lat/lng` con seguridad.
 */
function normalizeItemsResponse(data) {
  let list = null;
  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data?.items)) list = data.items;
  else if (Array.isArray(data?.data)) list = data.data;
  else if (Array.isArray(data?.results)) list = data.results;
  else if (Array.isArray(data?.donations)) list = data.donations;

  if (!list) {
    console.warn(
      "[CercaZero] La respuesta de /items/nearby no tiene un array reconocible. " +
        "Revisa la forma real de la respuesta (abajo) y ajusta normalizeItemsResponse en itemsService.js:",
      data
    );
    return [];
  }

  return list.map(normalizeItem);
}

/**
 * GET /api/items/nearby — público (JWT opcional).
 * Búsqueda geoespacial de donaciones cercanas.
 * Confirmado por Postman: query params `lng`, `lat`, `radius` (metros).
 */
export async function getNearbyItems({ lat, lng, radius }) {
  const { data } = await api.get("/items/nearby", {
    params: { lat, lng, radius },
  });
  return normalizeItemsResponse(data);
}

/**
 * POST /api/items — protegido.
 *
 * Confirmado por Postman: body JSON plano (NO multipart/form-data), con
 * los campos { title, description, category, contactPhone, lng, lat }.
 * El backend actual no acepta foto en este endpoint (no aparece ningún
 * campo de imagen en la colección) — se ha quitado del formulario. Si el
 * backend añade subida de imagen más adelante (p. ej. un endpoint aparte
 * o subida directa a un storage), se puede reintroducir aquí.
 */
export async function createItem({ title, description, category, contactPhone, lat, lng }) {
  const { data } = await api.post("/items", {
    title,
    description,
    category,
    contactPhone,
    lat,
    lng,
  });
  return normalizeItem(data);
}

/**
 * PUT /api/items/:id/status — protegido.
 *
 * Confirmado por Postman: el body es { status: "RESERVED" } — valores en
 * MAYÚSCULAS e inglés, no "reservado"/"disponible" como se asumió antes.
 * Ver el flujo completo de estados en StatusManager.jsx.
 */
export async function updateItemStatus(itemId, status) {
  const { data } = await api.put(`/items/${itemId}/status`, { status });
  return normalizeItem(data);
}

export { normalizeItem, normalizeItemsResponse };

