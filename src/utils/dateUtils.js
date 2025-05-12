// utils/dateUtils.js

/**
 * Formatea una fecha en diferentes formatos
 * @param {Date} date - Objeto de fecha a formatear
 * @param {string} format - Formato deseado ('full', 'medium', 'short', 'short-day', 'day')
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, format = 'iso') => {
  // Asegurarse de que date sea un objeto Date
  const d = new Date(date);
  
  // Nombres de los días y meses en español
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const shortWeekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  switch (format) {
    case 'full':
      // Ejemplo: "Lunes, 15 de Mayo de 2023"
      return `${weekdays[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
      
    case 'medium':
      // Ejemplo: "15 Mayo 2023"
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      
    case 'short':
      // Ejemplo: "15/05/2023"
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      
    case 'short-day':
      // Ejemplo: "15"
      return `${d.getDate()}`;
      
    case 'day':
      // Ejemplo: "Lun"
      return shortWeekdays[d.getDay()];
      
    case 'month':
      // Ejemplo: "Mayo"
      return months[d.getMonth()];
      
    case 'short-month':
      // Ejemplo: "May"
      return shortMonths[d.getMonth()];
      
    case 'iso':
    default:
      // Ejemplo: "2023-05-15" (formato ISO para comparaciones y almacenamiento)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
};

/**
 * Obtener el inicio de la semana (lunes) para una fecha dada
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Fecha del lunes de la semana
 */
export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  
  // Ajustar para que la semana comience el lunes (0 = lunes, 6 = domingo)
  const diff = day === 0 ? 6 : day - 1;
  
  d.setDate(d.getDate() - diff);
  
  return d;
};

/**
 * Obtener los días de la semana actual
 * @param {Date} referenceDate - Fecha de referencia (por defecto hoy)
 * @returns {Array<Date>} - Array con los 7 días de la semana
 */
export const getDaysOfWeek = (referenceDate = new Date()) => {
  const startOfWeek = getStartOfWeek(referenceDate);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });
};

/**
 * Obtener los días de la semana actual
 * @returns {Array<Date>} - Array con los 7 días de la semana actual
 */
export const getThisWeekDates = () => {
  return getDaysOfWeek(new Date());
};

/**
 * Obtener todos los días de un mes determinado
 * @param {number} year - Año
 * @param {number} month - Mes (0-11)
 * @returns {Array<Date>} - Array con todos los días del mes
 */
export const getDaysInMonth = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const numDays = endDate.getDate();
  
  return Array.from({ length: numDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(i + 1);
    return date;
  });
};

/**
 * Obtener los últimos N días hasta hoy
 * @param {number} n - Número de días a obtener
 * @returns {Array<Date>} - Array con los últimos n días
 */
export const getLastNDays = (n) => {
  const today = new Date();
  
  return Array.from({ length: n }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (n - 1) + i);
    return date;
  });
};

/**
 * Obtener el nombre del mes
 * @param {number} monthIndex - Índice del mes (0-11)
 * @returns {string} - Nombre del mes
 */
export const getMonthName = (monthIndex) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return months[monthIndex];
};

/**
 * Calcular el porcentaje de hábitos completados para un día
 * @param {Array} habits - Array de hábitos
 * @param {Object} dayRecords - Registros de hábitos del día
 * @returns {number} - Porcentaje de completitud (0-100)
 */
export const calculateDailyCompletionRate = (habits, dayRecords) => {
  if (!habits || habits.length === 0) return 0;
  
  const completedCount = habits.reduce((count, habit) => {
    return count + (dayRecords[habit.id] ? 1 : 0);
  }, 0);
  
  return Math.round((completedCount / habits.length) * 100);
};

/**
 * Agrupar días por semana para gráficos de tendencia
 * @param {Array<Date>} days - Array de días a agrupar
 * @returns {Array<Object>} - Array de objetos con datos por semana
 */
export const groupDaysByWeek = (days, habitRecords, habits) => {
  const weekMap = new Map();
  
  days.forEach(date => {
    const weekStart = getStartOfWeek(date);
    const weekKey = formatDate(weekStart);
    
    if (!weekMap.has(weekKey)) {
      // Determinar el número de semana del año
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (weekStart - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      
      weekMap.set(weekKey, {
        weekStart,
        weekNumber,
        days: [],
        completionRates: []
      });
    }
    
    const week = weekMap.get(weekKey);
    week.days.push(date);
    
    // Si se proporcionan habitRecords y habits, calcular la tasa de completitud
    if (habitRecords && habits) {
      const dateStr = formatDate(date);
      const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
      week.completionRates.push(completionRate);
    }
  });
  
  // Convertir el mapa a un array y calcular promedios
  return Array.from(weekMap.values()).map(week => {
    return {
      ...week,
      average: week.completionRates.length > 0
        ? week.completionRates.reduce((sum, rate) => sum + rate, 0) / week.completionRates.length
        : 0
    };
  }).sort((a, b) => a.weekStart - b.weekStart);
};

/**
 * Agrupar días por mes para gráficos de tendencia
 * @param {Array<Date>} days - Array de días a agrupar
 * @returns {Array<Object>} - Array de objetos con datos por mes
 */
export const groupDaysByMonth = (days, habitRecords, habits) => {
  const monthMap = new Map();
  
  days.forEach(date => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        monthStart,
        name: `${getMonthName(date.getMonth())} ${date.getFullYear()}`,
        days: [],
        completionRates: []
      });
    }
    
    const month = monthMap.get(monthKey);
    month.days.push(date);
    
    // Si se proporcionan habitRecords y habits, calcular la tasa de completitud
    if (habitRecords && habits) {
      const dateStr = formatDate(date);
      const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
      month.completionRates.push(completionRate);
    }
  });
  
  // Convertir el mapa a un array y calcular promedios
  return Array.from(monthMap.values()).map(month => {
    return {
      ...month,
      average: month.completionRates.length > 0
        ? month.completionRates.reduce((sum, rate) => sum + rate, 0) / month.completionRates.length
        : 0
    };
  }).sort((a, b) => a.monthStart - b.monthStart);
};

/**
 * Calcular información de racha para un hábito
 * @param {string} habitId - ID del hábito
 * @param {Object} habitRecords - Registros de hábitos
 * @returns {Object} - Información de racha
 */
export const getStreakInfo = (habitId, habitRecords) => {
  // Ordenar todas las fechas de forma descendente (más reciente primero)
  const sortedDates = Object.keys(habitRecords)
    .sort((a, b) => new Date(b) - new Date(a));
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Fecha actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Verificar si hay un registro para hoy
  const todayStr = formatDate(today);
  const hasRecordForToday = habitRecords[todayStr] && habitRecords[todayStr][habitId];
  
  // Si no hay registro para hoy, la racha actual debe verificarse hasta ayer
  const checkUntil = hasRecordForToday ? today : new Date(today);
  if (!hasRecordForToday) {
    checkUntil.setDate(checkUntil.getDate() - 1);
  }
  
  // Obtener la fecha límite como string
  const checkUntilStr = formatDate(checkUntil);
  
  // Calcular la racha actual
  let previousDate = null;
  for (const dateStr of sortedDates) {
    // Si la fecha es mayor (más reciente) que la fecha límite, la ignoramos
    // Esto es por si el usuario tiene registros para fechas futuras
    if (dateStr > checkUntilStr) continue;
    
    const date = new Date(dateStr);
    const isCompleted = habitRecords[dateStr][habitId] || false;
    
    // Si es la primera fecha que estamos revisando
    if (previousDate === null) {
      previousDate = date;
      if (isCompleted) {
        currentStreak = 1;
      } else {
        break; // La racha se rompió en la fecha más reciente
      }
    } else {
      // Verificar si esta fecha es consecutiva con la anterior
      const expectedDate = new Date(previousDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      if (
        date.getFullYear() === expectedDate.getFullYear() &&
        date.getMonth() === expectedDate.getMonth() &&
        date.getDate() === expectedDate.getDate()
      ) {
        if (isCompleted) {
          currentStreak++;
        } else {
          break; // La racha se rompió
        }
      } else {
        break; // Hay un día perdido, la racha se rompió
      }
      
      previousDate = date;
    }
  }
  
  // Calcular la mejor racha
  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const isCompleted = habitRecords[dateStr][habitId] || false;
    
    if (isCompleted) {
      tempStreak++;
      
      // Si es el último día o hay un salto al siguiente día
      if (
        i === sortedDates.length - 1 ||
        !areDatesConsecutive(new Date(sortedDates[i]), new Date(sortedDates[i + 1]))
      ) {
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    } else {
      // Día no completado, reiniciar racha temporal
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    bestStreak
  };
};

/**
 * Verificar si dos fechas son consecutivas
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {boolean} - Verdadero si las fechas son consecutivas
 */
const areDatesConsecutive = (date1, date2) => {
  // Normalizar las fechas eliminando las horas, minutos, etc.
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);
  
  // Calcular la diferencia en milisegundos
  const diffMs = Math.abs(d1 - d2);
  
  // Convertir a días (1 día = 86400000 ms)
  const diffDays = diffMs / 86400000;
  
  return diffDays === 1;
};
