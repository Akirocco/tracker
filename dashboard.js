// components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  defaults
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatDate, getStartOfWeek, getThisWeekDates, calculateDailyCompletionRate } from '../utils/dateUtils';
import { getColorForPercentage } from '../utils/colorUtils';
import '../styles/Dashboard.css';

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

// Configuración de estilo global para gráficos
defaults.font.family = "'Poppins', 'Helvetica', 'Arial', sans-serif";
defaults.color = '#64748b';

const Dashboard = ({ habits, goals, dailyVariables, habitRecords, goalProgress, variableRecords }) => {
  // Obtener la semana actual (fechas)
  const weekDates = getThisWeekDates();
  
  // Configurar datos para el gráfico de rendimiento semanal
  const weeklyPerformanceData = {
    labels: weekDates.map(date => formatDate(date, 'short')),
    datasets: [
      {
        label: 'Completado (%)',
        data: weekDates.map(date => {
          const dateStr = formatDate(date);
          return calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
        }),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Obtener los últimos 5 días para mostrar en el panel de rendimiento reciente
  const last5Days = [...weekDates].slice(-5);
  
  // Calcular el promedio de completitud de la semana actual
  const currentWeekAverage = weeklyPerformanceData.datasets[0].data
    .filter(val => val !== 0)
    .reduce((sum, val, _, arr) => sum + val / arr.length, 0);
  
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Personal</h1>
      
      {/* Resumen del día actual */}
      <div className="widget today-summary">
        <h2 className="widget-title">Hoy - {formatDate(new Date(), 'full')}</h2>
        <div className="progress-container">
          {habits.length > 0 ? (
            <>
              <div className="progress-circle" style={
                { '--percentage': `${calculateDailyCompletionRate(habits, habitRecords[formatDate(new Date())] || {})}%` }
              }>
                <span className="progress-text">
                  {calculateDailyCompletionRate(habits, habitRecords[formatDate(new Date())] || {})}%
                </span>
              </div>
              <div className="progress-details">
                <p>
                  <span className="completed-count">
                    {Object.values(habitRecords[formatDate(new Date())] || {}).filter(Boolean).length}
                  </span> 
                  de 
                  <span className="total-count"> {habits.length}</span> hábitos completados
                </p>
                <Link to="/daily" className="action-button">
                  Actualizar hábitos
                </Link>
              </div>
            </>
          ) : (
            <div className="no-data-message">
              <p>No hay hábitos configurados todavía.</p>
              <Link to="/settings" className="action-button">
                Configurar hábitos
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Rendimiento Semanal */}
      <div className="widget weekly-performance">
        <h2 className="widget-title">Rendimiento Semanal</h2>
        <div className="chart-container">
          {habits.length > 0 ? (
            <Line 
              data={weeklyPerformanceData} 
              options={{
                responsive: true,
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
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <div className="no-data-message">
              <p>No hay datos para mostrar.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Metas en Progreso */}
      <div className="widget goals-progress">
        <h2 className="widget-title">Metas en Progreso</h2>
        {goals.length > 0 ? (
          <div className="goals-grid">
            {goals.slice(0, 3).map((goal) => {
              const currentProgress = goalProgress[goal.id]?.current || 0;
              const percentage = (currentProgress / goal.target) * 100;
              const cappedPercentage = Math.min(100, percentage);
              
              return (
                <div key={goal.id} className="goal-card">
                  <h3>{goal.name}</h3>
                  <div className="goal-info">
                    <span className="goal-target">Meta: {goal.target} {goal.unit}</span>
                    <span className="goal-current">Actual: {currentProgress} {goal.unit}</span>
                  </div>
                  <div className="goal-progress-bar">
                    <div 
                      className="goal-progress-fill" 
                      style={{ 
                        width: `${cappedPercentage}%`,
                        backgroundColor: getColorForPercentage(cappedPercentage)
                      }}
                    ></div>
                  </div>
                  <span className="goal-percentage">{Math.round(percentage)}%</span>
                  <div className="goal-deadline">
                    {goal.deadline ? `Meta para: ${goal.deadline}` : 'Sin fecha límite'}
                  </div>
                </div>
              );
            })}
            
            {goals.length > 3 && (
              <Link to="/goals" className="see-more-link">
                Ver todas las metas ({goals.length})
              </Link>
            )}
          </div>
        ) : (
          <div className="no-data-message">
            <p>No hay metas configuradas todavía.</p>
            <Link to="/settings" className="action-button">
              Configurar metas
            </Link>
          </div>
        )}
      </div>
      
      {/* Rendimiento de los últimos 5 días */}
      <div className="widget recent-performance">
        <h2 className="widget-title">Rendimiento Reciente</h2>
        {habits.length > 0 ? (
          <div className="recent-days-grid">
            {last5Days.map((date) => {
              const dateStr = formatDate(date);
              const completionRate = calculateDailyCompletionRate(habits, habitRecords[dateStr] || {});
              
              return (
                <div key={dateStr} className="day-card">
                  <div className="day-info">
                    <span className="day-name">{formatDate(date, 'day')}</span>
                    <span className="day-date">{formatDate(date, 'short')}</span>
                  </div>
                  <div 
                    className="day-completion-indicator"
                    style={{ 
                      backgroundColor: getColorForPercentage(completionRate)
                    }}
                  >
                    {completionRate}%
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data-message">
            <p>No hay datos para mostrar.</p>
          </div>
        )}
      </div>
      
      {/* Variables Diarias */}
      {dailyVariables.length > 0 && (
        <div className="widget daily-variables">
          <h2 className="widget-title">Variables de Seguimiento</h2>
          <div className="variables-grid">
            {dailyVariables.map((variable) => {
              // Calcular el total semanal para esta variable
              const weeklyTotal = weekDates.reduce((sum, date) => {
                const dateStr = formatDate(date);
                return sum + (variableRecords[dateStr]?.[variable.id] || 0);
              }, 0);
              
              return (
                <div key={variable.id} className="variable-card">
                  <h3>{variable.name}</h3>
                  <div className="variable-data">
                    <div className="data-item">
                      <span className="data-label">Hoy:</span>
                      <span className="data-value">
                        {variableRecords[formatDate(new Date())]?.[variable.id] || 0} {variable.unit}
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Esta semana:</span>
                      <span className="data-value">{weeklyTotal} {variable.unit}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Promedio diario:</span>
                      <span className="data-value">
                        {(weeklyTotal / (weekDates.length || 1)).toFixed(1)} {variable.unit}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
