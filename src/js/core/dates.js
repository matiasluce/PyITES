/**
 * PyITES · core/dates
 * Utilidades de fecha en formato YYYY-MM-DD, en hora local.
 * El progreso se guarda como lista de cadenas, no de Date.
 */

const pad = number => String(number).padStart(2, '0');

/** Convierte un Date a 'YYYY-MM-DD' usando la fecha local. */
export const formatDate = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Fecha de hoy en formato 'YYYY-MM-DD'. */
export const today = () => formatDate(new Date());

/** Número de días transcurridos entre dos fechas 'YYYY-MM-DD'. */
export const dayDiff = (from, to) => {
  const toDays = iso => {
    const [year, month, day] = iso.split('-').map(Number);
    return Date.UTC(year, month - 1, day) / 864e5;
  };
  return Math.round(toDays(to) - toDays(from));
};
