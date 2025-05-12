// components/GlobalView.js
import React from 'react';
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
import { 
  formatDate, 
  getLastNDays, 
  calculateDailyCompletionRate,
  groupDaysByWeek,
  groupDaysByMonth,
  getStreakInfo
} from '../utils/dateUtils';
import { getColorForPercentage } from '../utils/colorUtils';
import '../styles/GlobalView.css';

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

const GlobalView = ({ habits, goals, dailyVariables, habitRecords, goalProgress, variableRecords }) => {
  // Obtener los últimos 90 días para análisis global
  const last90Days = getLastNDays(90);
  const last30Days = last90Days.slice(-30);
  
  // Agrupar días por semana y mes para gráficos de tendencia
  const weeklyData = groupDaysByWeek(last90Days);
  const monthlyData = groupDaysByMonth(last90Days);
  
  // Calcular el promedio general de los últimos 90 días
  const daysWithData = last90Days.filter(date => {
    const dateStr = formatDate(date);
    return habitRecords[dateStr] && Object.keys(habitRecords[dateStr]).length > 0;
  });
  
  const globalAverage = daysWithData.length > 0
    ? daysWithData.reduce((sum, date) => {
        const dateStr = formatDate(date);
        return sum + calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
      }, 0) / daysWithData.length
    : 0;
  
  // Calcular información de racha para cada hábito
  const habitsStreakInfo = habits.map(habit => {
    return {
      ...habit,
      ...getStreakInfo(habit.id, habitRecords)
    };
  }).sort((a, b) => b.currentStreak - a.currentStreak);
  
  // Calcular días perfectos (100% de completitud)
  const perfectDays = daysWithData.filter(date => {
    const dateStr = formatDate(date);
    return calculateDailyCompletionRate(habits, habitRecords[dateStr] || {}) === 100;
  });
  
  // Calcular el día de la semana más consistente
  const weekdayStats = [0, 1, 2, 3, 4, 5, 6].map(weekday => {
    const daysWithThisWeekday = daysWithData.filter(date => date.getDay() === weekday);
    
    const averageCompletion = daysWithThisWeekday.length > 0
      ? daysWithThisWeekday.reduce((sum, date) => {
          const dateStr = formatDate(date);
          return sum + calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
        }, 0) / daysWithThisWeekday.length
      : 0;
    
    return {
      weekday,
      name: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][weekday],
      average: averageCompletion
    };
  }).sort((a, b) => b.average - a.average);
  
  // Preparar datos para el gráfico de tendencia semanal
  const weeklyTrendData = {
    labels: weeklyData.map(week => `Sem ${week.weekNumber}`),
    datasets: [
      {
        label: 'Completitud Semanal (%)',
        data: weeklyData.map(week => week.average),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Preparar datos para el gráfico de tendencia mensual
  const monthlyTrendData = {
    labels: monthlyData.map(month => month.name),
    datasets: [
      {
        label: 'Completitud Mensual (%)',
        data: monthlyData.map(month => month.average),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Preparar datos para el gráfico de comparación de hábitos
  const habitsComparisonData = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Consistencia Global (%)',
        data: habits.map(habit => {
          const completedDays = daysWithData.filter(date => {
            const dateStr = formatDate(date);
            return habitRecords[dateStr]?.[habit.id] || false;
          }).length;
          
          return daysWithData.length > 0 
            ? Math.round((completedDays / daysWithData.length) * 100) 
            : 0;
        }),
        backgroundColor: habits.map((_, index) => `hsla(${index * 30}, 70%, 50%, 0.7)`),
        borderWidth: 0,
      }
    ],
  };
  
  // Calcular estadísticas de las variables diarias
  const variablesStats = dailyVariables.map(variable => {
    const variableData = last30Days.map(date => {
      const dateStr = formatDate(date);
      return variableRecords[dateStr]?.[variable.id] || 0;
    });
    
    const total = variableData.reduce((sum, value) => sum + value, 0);
    const nonZeroDays = variableData.filter(value => value > 0).length;
    const average = nonZeroDays > 0 ? total / nonZeroDays : 0;
    const max = Math.max(...variableData);
    
    return {
      ...variable,
      total,
      average,
      max
    };
  });
  
  return (
    <div className="global-view">
      <h1 className="page-title">Vista Global de Consistencia</h1>
      
      {habits.length > 0 ? (
        <div className="global-content">
          {/* Resumen Global */}
          <div className="global-summary">
            <div className="summary-card average-card">
              <div className="progress-circle" style={{ '--percentage': `${Math.round(globalAverage)}%` }}>
                <div className="progress-circle-inner">
                  <span className="progress-value">{Math.round(globalAverage)}%</span>
                  <span className="progress-label">Promedio Global</span>
                </div>
              </div>
              <div className="summary-details">
                <div className="summary-stat">
                  <span className="stat-label">Días Registrados</span>
                  <span className="stat-value">{daysWithData.length}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Días Perfectos</span>
                  <span className="stat-value">{perfectDays.length}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Mejor Día</span>
                  <span className="stat-value">{weekdayStats[0]?.name || '-'}</span>
                </div>
              </div>
            </div>
            
            {/* Tarjetas de rachas */}
            <div className="streaks-container">
              <h2 className="section-title">Rachas Actuales</h2>
              <div className="streaks-grid">
                {habitsStreakInfo.slice(0, 5).map(habit => (
                  <div key={habit.id} className="streak-card">
                    <div className="streak-name">{habit.name}</div>
                    <div className="streak-value">{habit.currentStreak} días</div>
                    <div className="streak-subtitle">Mejor: {habit.bestStreak} días</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Gráficos de tendencia */}
          <div className="trends-section">
            <h2 className="section-title">Tendencias de Consistencia</h2>
            <div className="trends-grid">
              <div className="chart-container">
                <h3 className="chart-title">Tendencia Semanal</h3>
                <div className="chart-body">
                  <Line 
                    data={weeklyTrendData} 
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
              
              <div className="chart-container">
                <h3 className="chart-title">Tendencia Mensual</h3>
                <div className="chart-body">
                  <Line 
                    data={monthlyTrendData} 
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
            </div>
          </div>
          
          {/* Estadísticas por día de la semana */}
          <div className="weekday-stats-section">
            <h2 className="section-title">Consistencia por Día de la Semana</h2>
            <div className="weekday-stats-grid">
              {weekdayStats.map(day => (
                <div 
                  key={day.weekday} 
                  className="weekday-card"
                  style={{ '--percentage': `${Math.round(day.average)}%` }}
                >
                  <div className="weekday-name">{day.name}</div>
                  <div className="weekday-percentage">{Math.round(day.average)}%</div>
                  <div className="weekday-bar-container">
                    <div 
                      className="weekday-bar" 
                      style={{ 
                        width: `${Math.round(day.average)}%`,
                        backgroundColor: getColorForPercentage(day.average)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ranking de hábitos */}
          <div className="habits-ranking-section">
            <h2 className="section-title">Ranking de Hábitos por Consistencia</h2>
            <div className="chart-container horizontal-chart">
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
          
          {/* Tabla detallada de hábitos */}
          <div className="habits-table-section">
            <h2 className="section-title">Detalles por Hábito</h2>
            <div className="table-container">
              <table className="habits-table">
                <thead>
                  <tr>
                    <th>Hábito</th>
                    <th>Completitud</th>
                    <th>Racha Actual</th>
                    <th>Mejor Racha</th>
                    <th>Días Completados</th>
                    <th>Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map(habit => {
                    const completedDays = daysWithData.filter(date => {
                      const dateStr = formatDate(date);
                      return habitRecords[dateStr]?.[habit.id] || false;
                    });
                    
                    const consistencyRate = daysWithData.length > 0 
                      ? (completedDays.length / daysWithData.length) * 100 
                      : 0;
                    
                    // Calcular tendencia (últimos 14 días vs los 14 días anteriores)
                    const last14Days = last30Days.slice(-14);
                    const previous14Days = last30Days.slice(-28, -14);
                    
                    const currentPeriodCompletions = last14Days.filter(date => {
                      const dateStr = formatDate(date);
                      return habitRecords[dateStr]?.[habit.id] || false;
                    }).length;
                    
                    const previousPeriodCompletions = previous14Days.filter(date => {
                      const dateStr = formatDate(date);
                      return habitRecords[dateStr]?.[habit.id] || false;
                    }).length;
                    
                    const currentRate = (currentPeriodCompletions / 14) * 100;
                    const previousRate = (previousPeriodCompletions / 14) * 100;
                    
                    const difference = currentRate - previousRate;
                    let trend;
                    if (Math.abs(difference) < 5) {
                      trend = { symbol: '→', class: 'neutral' };
                    } else if (difference > 0) {
                      trend = { symbol: '↗', class: 'positive' };
                    } else {
                      trend = { symbol: '↘', class: 'negative' };
                    }
                    
                    // Obtener información de racha
                    const streakInfo = habitsStreakInfo.find(h => h.id === habit.id);
                    
                    return (
                      <tr key={habit.id}>
                        <td>{habit.name}</td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ 
                                width: `${consistencyRate}%`,
                                backgroundColor: getColorForPercentage(consistencyRate)
                              }}
                            ></div>
                            <span className="progress-text">
                              {Math.round(consistencyRate)}%
                            </span>
                          </div>
                        </td>
                        <td>{streakInfo?.currentStreak || 0} días</td>
                        <td>{streakInfo?.bestStreak || 0} días</td>
                        <td>{completedDays.length} / {daysWithData.length}</td>
                        <td className={`trend ${trend.class}`}>{trend.symbol}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Estadísticas de variables diarias */}
          {variablesStats.length > 0 && (
            <div className="variables-stats-section">
              <h2 className="section-title">Estadísticas de Variables</h2>
              <div className="variables-grid">
                {variablesStats.map(variable => (
                  <div key={variable.id} className="variable-card">
                    <h3 className="variable-title">{variable.name}</h3>
                    <div className="variable-stats">
                      <div className="variable-stat">
                        <span className="stat-label">Total (30 días)</span>
                        <span className="stat-value">{variable.total.toFixed(1)} {variable.unit}</span>
                      </div>
                      <div className="variable-stat">
                        <span className="stat-label">Promedio por día</span>
                        <span className="stat-value">{variable.average.toFixed(1)} {variable.unit}</span>
                      </div>
                      <div className="variable-stat">
                        <span className="stat-label">Máximo registrado</span>
                        <span className="stat-value">{variable.max} {variable.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay hábitos configurados. Agrega algunos en la sección de Ajustes para ver estadísticas globales.</p>
        </div>
      )}
    </div>
  );
};

export default GlobalView;
