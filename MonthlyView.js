// components/MonthlyView.js
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  formatDate, 
  getDaysInMonth, 
  getMonthName,
  calculateDailyCompletionRate 
} from '../utils/dateUtils';
import { getColorForPercentage } from '../utils/colorUtils';
import '../styles/MonthlyView.css';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyView = ({ habits, goals, dailyVariables, habitRecords, goalProgress, variableRecords }) => {
  // Estado para el mes y año seleccionados (por defecto el mes actual)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Obtener los días del mes seleccionado
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  
  // Nombres de los días de la semana
  const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Cambiar al mes anterior
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Cambiar al mes siguiente
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Ir al mes actual
  const goToCurrentMonth = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };
  
  // Determinar el día de la semana del primer día del mes (0 = domingo, 1 = lunes, ...)
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  // Ajustar para que la semana comience el lunes (0 = lunes, 1 = martes, ..., 6 = domingo)
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Preparar datos para el gráfico de tendencia mensual
  const monthlyTrendData = {
    labels: daysInMonth.map(day => day.getDate().toString()),
    datasets: [
      {
        label: 'Completitud Diaria (%)',
        data: daysInMonth.map(date => {
          const dateStr = formatDate(date);
          return calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
        }),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Preparar datos para los gráficos de variables diarias
  const variablesTrendsData = {};
  
  dailyVariables.forEach(variable => {
    variablesTrendsData[variable.id] = {
      labels: daysInMonth.map(day => day.getDate().toString()),
      datasets: [
        {
          label: variable.name,
          data: daysInMonth.map(date => {
            const dateStr = formatDate(date);
            return variableRecords[dateStr]?.[variable.id] || 0;
          }),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.3,
        }
      ],
    };
  });
  
  // Calcular el promedio mensual de completitud
  const daysWithData = daysInMonth.filter(date => {
    const dateStr = formatDate(date);
    return habitRecords[dateStr] && Object.keys(habitRecords[dateStr]).length > 0;
  });
  
  const monthlyAverage = daysWithData.length > 0
    ? daysWithData.reduce((sum, date) => {
        const dateStr = formatDate(date);
        return sum + calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
      }, 0) / daysWithData.length
    : 0;
  
  // Verificar si el día actual está en el mes seleccionado
  const today = new Date();
  const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
  const currentDay = isCurrentMonth ? today.getDate() : null;
  
  return (
    <div className="monthly-view">
      <div className="month-navigation">
        <button className="nav-button" onClick={goToPreviousMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="current-month">
          <span>{getMonthName(selectedMonth)} {selectedYear}</span>
          {!(today.getMonth() === selectedMonth && today.getFullYear() === selectedYear) && (
            <button className="current-month-button" onClick={goToCurrentMonth}>
              Mes actual
            </button>
          )}
        </div>
        
        <button className="nav-button" onClick={goToNextMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      {habits.length > 0 ? (
        <div className="monthly-content">
          {/* Calendario mensual (heat map) */}
          <div className="calendar-container">
            <h2 className="section-title">Calendario de Consistencia</h2>
            <div className="calendar">
              {/* Encabezado con los nombres de los días de la semana */}
              <div className="calendar-header">
                {weekdayNames.map((name, index) => (
                  <div key={index} className="weekday-name">{name}</div>
                ))}
              </div>
              
              <div className="calendar-grid">
                {/* Espaciadores para alinear el primer día del mes */}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`spacer-${index}`} className="calendar-day empty"></div>
                ))}
                
                {/* Días del mes */}
                {daysInMonth.map((date) => {
                  const day = date.getDate();
                  const dateStr = formatDate(date);
                  const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
                  const hasData = habitRecords[dateStr] && Object.keys(habitRecords[dateStr]).length > 0;
                  const isToday = day === currentDay;
                  
                  return (
                    <div 
                      key={day} 
                      className={`calendar-day ${isToday ? 'today' : ''} ${hasData ? 'has-data' : ''}`}
                    >
                      <div className="day-number">{day}</div>
                      {hasData && (
                        <div 
                          className="completion-indicator"
                          style={{ backgroundColor: getColorForPercentage(completionRate) }}
                        >
                          {completionRate}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: getColorForPercentage(0) }}></div>
                <span>0-20%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: getColorForPercentage(30) }}></div>
                <span>21-40%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: getColorForPercentage(50) }}></div>
                <span>41-60%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: getColorForPercentage(70) }}></div>
                <span>61-80%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: getColorForPercentage(90) }}></div>
                <span>81-100%</span>
              </div>
            </div>
          </div>
          
          {/* Tendencia mensual */}
          <div className="monthly-trend-container">
            <div className="chart-header">
              <h2 className="section-title">Tendencia Mensual</h2>
              <div className="chart-average">
                Promedio mensual: <span>{Math.round(monthlyAverage)}%</span>
              </div>
            </div>
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
          
          {/* Gráficos de tendencia para variables diarias */}
          {dailyVariables.length > 0 && (
            <div className="variables-trends-container">
              <h2 className="section-title">Tendencias de Variables</h2>
              <div className="variables-charts-grid">
                {dailyVariables.map(variable => {
                  // Calcular totales mensuales y promedios
                  const monthlyTotal = daysInMonth.reduce((sum, date) => {
                    const dateStr = formatDate(date);
                    return sum + (variableRecords[dateStr]?.[variable.id] || 0);
                  }, 0);
                  
                  const daysWithVariableData = daysInMonth.filter(date => {
                    const dateStr = formatDate(date);
                    return variableRecords[dateStr]?.[variable.id] > 0;
                  }).length;
                  
                  const dailyAverage = daysWithVariableData > 0
                    ? monthlyTotal / daysWithVariableData
                    : 0;
                    
                  return (
                    <div key={variable.id} className="variable-chart-container">
                      <div className="variable-chart-header">
                        <h3>{variable.name}</h3>
                        <div className="variable-stats">
                          <div className="stat-item">
                            <span className="stat-label">Total:</span>
                            <span className="stat-value">{monthlyTotal.toFixed(1)} {variable.unit}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Promedio:</span>
                            <span className="stat-value">{dailyAverage.toFixed(1)} {variable.unit}/día</span>
                          </div>
                        </div>
                      </div>
                      <div className="variable-chart-body">
                        <Line 
                          data={variablesTrendsData[variable.id]} 
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
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Resumen mensual */}
          <div className="monthly-summary">
            <h2 className="section-title">Resumen Mensual</h2>
            <div className="summary-stats">
              <div className="stat-card">
                <div className="stat-title">Días Activos</div>
                <div className="stat-value">{daysWithData.length} / {daysInMonth.length}</div>
                <div className="stat-percentage">
                  {Math.round((daysWithData.length / daysInMonth.length) * 100)}%
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Completitud Promedio</div>
                <div className="stat-value">{Math.round(monthlyAverage)}%</div>
                <div className="stat-indicator" 
                  style={{ backgroundColor: getColorForPercentage(monthlyAverage) }}>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Mejor Día</div>
                {daysWithData.length > 0 ? (
                  (() => {
                    const bestDay = daysWithData.reduce((best, date) => {
                      const dateStr = formatDate(date);
                      const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
                      
                      if (!best || completionRate > best.rate) {
                        return { date, rate: completionRate };
                      }
                      return best;
                    }, null);
                    
                    return (
                      <>
                        <div className="stat-value">{formatDate(bestDay.date, 'medium')}</div>
                        <div className="stat-percentage">{bestDay.rate}%</div>
                      </>
                    );
                  })()
                ) : (
                  <div className="stat-value">-</div>
                )}
              </div>
            </div>
            
            {habits.length > 0 && (
              <div className="habits-monthly-stats">
                <h3 className="subsection-title">Estadísticas por Hábito</h3>
                <div className="habits-table-container">
                  <table className="habits-table">
                    <thead>
                      <tr>
                        <th>Hábito</th>
                        <th>Días Completados</th>
                        <th>Consistencia</th>
                        <th>Mejor Racha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map(habit => {
                        const completedDays = daysInMonth.filter(date => {
                          const dateStr = formatDate(date);
                          return habitRecords[dateStr]?.[habit.id] || false;
                        });
                        
                        const completionRate = (completedDays.length / daysInMonth.length) * 100;
                        
                        // Calcular la mejor racha
                        let currentStreak = 0;
                        let bestStreak = 0;
                        
                        daysInMonth.forEach(date => {
                          const dateStr = formatDate(date);
                          const isCompleted = habitRecords[dateStr]?.[habit.id] || false;
                          
                          if (isCompleted) {
                            currentStreak++;
                            if (currentStreak > bestStreak) {
                              bestStreak = currentStreak;
                            }
                          } else {
                            currentStreak = 0;
                          }
                        });
                        
                        return (
                          <tr key={habit.id}>
                            <td>{habit.name}</td>
                            <td>
                              {completedDays.length} / {daysInMonth.length}
                            </td>
                            <td>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ 
                                    width: `${completionRate}%`,
                                    backgroundColor: getColorForPercentage(completionRate)
                                  }}
                                ></div>
                                <span className="progress-text">
                                  {Math.round(completionRate)}%
                                </span>
                              </div>
                            </td>
                            <td>{bestStreak} días</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay hábitos configurados. Agrega algunos en la sección de Ajustes para ver estadísticas mensuales.</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyView;
