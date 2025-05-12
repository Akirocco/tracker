// components/WeeklyView.js
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatDate, getStartOfWeek, getDaysOfWeek, calculateDailyCompletionRate } from '../utils/dateUtils';
import '../styles/WeeklyView.css';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyView = ({ habits, goals, dailyVariables, habitRecords, goalProgress, variableRecords }) => {
  // Estado para la semana seleccionada (por defecto esta semana)
  const [selectedWeekStart, setSelectedWeekStart] = useState(getStartOfWeek(new Date()));
  
  // Obtener los días de la semana seleccionada
  const daysOfWeek = getDaysOfWeek(selectedWeekStart);
  
  // Cambiar a la semana anterior
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekStart(newDate);
  };
  
  // Cambiar a la semana siguiente
  const goToNextWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekStart(newDate);
  };
  
  // Ir a la semana actual
  const goToCurrentWeek = () => {
    setSelectedWeekStart(getStartOfWeek(new Date()));
  };
  
  // Preparar datos para el gráfico de completitud de hábitos
  const habitsCompletionData = {
    labels: daysOfWeek.map(date => formatDate(date, 'short')),
    datasets: [
      {
        label: 'Completitud Diaria (%)',
        data: daysOfWeek.map(date => {
          const dateStr = formatDate(date);
          return calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
        }),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Calcular el promedio semanal
  const weeklyAverage = habitsCompletionData.datasets[0].data
    .filter(val => val !== null)
    .reduce((sum, val, _, arr) => sum + val / arr.length, 0);
  
  // Preparar datos para el gráfico de variables diarias (si hay variables configuradas)
  const variablesData = {
    labels: daysOfWeek.map(date => formatDate(date, 'short')),
    datasets: dailyVariables.map((variable, index) => ({
      label: variable.name,
      data: daysOfWeek.map(date => {
        const dateStr = formatDate(date);
        return variableRecords[dateStr]?.[variable.id] || 0;
      }),
      borderColor: `hsl(${index * 40}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 40}, 70%, 50%, 0.5)`,
      tension: 0.3,
    })),
  };
  
  // Generar datos para el gráfico de comparación de hábitos (completitud por hábito)
  const habitsComparisonData = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Completitud Semanal (%)',
        data: habits.map(habit => {
          const completedDays = daysOfWeek.filter(date => {
            const dateStr = formatDate(date);
            return habitRecords[dateStr]?.[habit.id] || false;
          }).length;
          
          return Math.round((completedDays / daysOfWeek.length) * 100);
        }),
        backgroundColor: habits.map((_, index) => `hsla(${index * 30}, 70%, 50%, 0.7)`),
        borderWidth: 0,
      }
    ],
  };
  
  return (
    <div className="weekly-view">
      <div className="week-navigation">
        <button className="nav-button" onClick={goToPreviousWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="current-week">
          <span>Semana del {formatDate(daysOfWeek[0], 'medium')} al {formatDate(daysOfWeek[6], 'medium')}</span>
          {!isSameWeek(selectedWeekStart, getStartOfWeek(new Date())) && (
            <button className="current-week-button" onClick={goToCurrentWeek}>
              Esta semana
            </button>
          )}
        </div>
        
        <button className="nav-button" onClick={goToNextWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      {habits.length > 0 ? (
        <div className="weekly-charts">
          {/* Gráfico de completitud diaria */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Completitud Diaria</h2>
              <div className="chart-average">
                Promedio semanal: <span>{Math.round(weeklyAverage)}%</span>
              </div>
            </div>
            <div className="chart-body">
              <Line 
                data={habitsCompletionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      padding: 10,
                      cornerRadius: 4,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
          
          {/* Gráfico de comparación de hábitos */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Completitud por Hábito</h2>
            </div>
            <div className="chart-body horizontal-chart">
              <Bar 
                data={habitsComparisonData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      padding: 10,
                      cornerRadius: 4,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
          
          {/* Gráfico de variables diarias (si hay variables) */}
          {dailyVariables.length > 0 && (
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Variables Diarias</h2>
              </div>
              <div className="chart-body">
                <Line 
                  data={variablesData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        padding: 10,
                        cornerRadius: 4,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Tabla de resumen de la semana */}
          <div className="weekly-summary">
            <h2 className="summary-title">Resumen de la Semana</h2>
            <div className="summary-table-container">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Hábito</th>
                    {daysOfWeek.map(date => (
                      <th key={formatDate(date)}>{formatDate(date, 'short-day')}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map(habit => {
                    const completedDays = daysOfWeek.filter(date => {
                      const dateStr = formatDate(date);
                      return habitRecords[dateStr]?.[habit.id] || false;
                    });
                    
                    return (
                      <tr key={habit.id}>
                        <td>{habit.name}</td>
                        {daysOfWeek.map(date => {
                          const dateStr = formatDate(date);
                          const isCompleted = habitRecords[dateStr]?.[habit.id] || false;
                          
                          return (
                            <td key={dateStr} className="habit-cell">
                              {isCompleted ? (
                                <span className="habit-completed">✓</span>
                              ) : (
                                <span className="habit-not-completed">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="total-cell">
                          {completedDays.length}/{daysOfWeek.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total Diario</th>
                    {daysOfWeek.map(date => {
                      const dateStr = formatDate(date);
                      const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
                      
                      return (
                        <th key={dateStr} className="daily-total">
                          {completionRate}%
                        </th>
                      );
                    })}
                    <th className="weekly-total">
                      {Math.round(weeklyAverage)}%
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay hábitos configurados. Agrega algunos en la sección de Ajustes para ver estadísticas semanales.</p>
        </div>
      )}
    </div>
  );
};

// Función auxiliar para determinar si dos fechas están en la misma semana
const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    formatDate(d1) === formatDate(d2) &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export default WeeklyView;
