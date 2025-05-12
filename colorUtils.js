// utils/colorUtils.js

/**
 * Obtener un color basado en un porcentaje
 * @param {number} percentage - Porcentaje (0-100)
 * @returns {string} - Color en formato hexadecimal
 */
export const getColorForPercentage = (percentage) => {
  // Definir rangos de color
  if (percentage >= 80) {
    return '#22c55e'; // Verde (muy bueno)
  } else if (percentage >= 60) {
    return '#3b82f6'; // Azul (bueno)
  } else if (percentage >= 40) {
    return '#eab308'; // Amarillo (regular)
  } else if (percentage >= 20) {
    return '#f97316'; // Naranja (malo)
  } else {
    return '#ef4444'; // Rojo (muy malo)
  }
};

/**
 * Generar un color aleatorio
 * @returns {string} - Color en formato hexadecimal
 */
export const getRandomColor = () => {
  // Colores predefinidos que combinan bien
  const colors = [
    '#3b82f6', // Azul
    '#22c55e', // Verde
    '#ef4444', // Rojo
    '#eab308', // Amarillo
    '#a855f7', // Morado
    '#ec4899', // Rosa
    '#14b8a6', // Turquesa
    '#f97316', // Naranja
    '#6366f1', // Indigo
    '#84cc16', // Verde lima
    '#06b6d4', // Cian
    '#8b5cf6', // Violeta
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Aclarar u oscurecer un color
 * @param {string} color - Color en formato hexadecimal
 * @param {number} amount - Cantidad a aclarar u oscurecer (-100 a 100)
 * @returns {string} - Color modificado en formato hexadecimal
 */
export const adjustColor = (color, amount) => {
  // Convertir color a RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);
  
  // Ajustar valores
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // Convertir de vuelta a hexadecimal
  return '#' + 
    r.toString(16).padStart(2, '0') + 
    g.toString(16).padStart(2, '0') + 
    b.toString(16).padStart(2, '0');
};
