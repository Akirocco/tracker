// utils/LocalStorageManager.js

// Clave para almacenar todos los datos en localStorage
const STORAGE_KEY = 'habit-tracker-data';

export const LocalStorageManager = {
  /**
   * Guardar todos los datos en localStorage
   * @param {Object} data - Datos a guardar
   */
  saveData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar datos en localStorage:', error);
      return false;
    }
  },
  
  /**
   * Obtener todos los datos desde localStorage
   * @returns {Object|null} - Datos recuperados o null si no hay datos
   */
  getAllData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al recuperar datos desde localStorage:', error);
      return null;
    }
  },
  
  /**
   * Eliminar todos los datos de localStorage
   * @returns {boolean} - true si se eliminaron correctamente
   */
  clearAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error al eliminar datos de localStorage:', error);
      return false;
    }
  }
};

export default LocalStorageManager;
