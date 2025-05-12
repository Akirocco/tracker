// components/DailyView.js
import React, { useState } from 'react';
import { formatDate, getDaysOfWeek } from '../utils/dateUtils';
import '../styles/DailyView.css';

const DailyView = ({ 
  habits, 
  goals, 
  dailyVariables, 
  habitRecords, 
  setHabitRecords,
  goalProgress,
  setGoalProgress,
  variableRecords,
  setVariableRecords
}) => {
  // Estado para la fecha seleccionada (por defecto hoy)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateStr = formatDate(selectedDate);
  
  // Obtener días de la semana actual
  const daysOfWeek = getDaysOfWeek(selectedDate);
  
  // Cambiar la fecha seleccionada
  const changeSelectedDate = (date) => {
    setSelectedDate(date);
  };
  
  // Ir a la semana anterior
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  
  // Ir a la semana siguiente
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  
  // Ir a hoy
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Alternar el estado de un hábito
  const toggleHabit = (habitId) => {
    setHabitRecords(prevRecords => {
      const dateRecords = prevRecords[selectedDateStr] || {};
      
      return {
        ...prevRecords,
        [selectedDateStr]: {
          ...dateRecords,
          [habitId]: !dateRecords[habitId]
        }
      };
    });
  };
  
  // Actualizar el valor de una variable diaria
  const updateDailyVariable = (variableId, value) => {
    const numValue = parseFloat(value) || 0;
    
    setVariableRecords(prevRecords => {
      const dateRecords = prevRecords[selectedDateStr] || {};
      
      return {
        ...prevRecords,
        [selectedDateStr]: {
          ...dateRecords,
          [variableId]: numValue
        }
      };
    });
  };
  
  // Actualizar el progreso de una meta
  const updateGoalProgress = (goalId, value) => {
    const numValue = parseFloat(value) || 0;
    
    setGoalProgress(prevProgress => {
      const goalData = prevProgress[goalId] || { current: 0, history: {} };
      
      return {
        ...prevProgress,
        [goalId]: {
          ...goalData,
          current: numValue,
          history: {
            ...goalData.history,
            [selectedDateStr]: numValue
          }
        }
      };
    });
  };
  
  // Calcular el porcentaje de hábitos completados para un día
  const calculateCompletionRate = (date) => {
    const dateStr = formatDate(date);
    const dayRecords = habitRecords[dateStr] || {};
    
    if (habits.length === 0) return 0;
    
    const completedCount = habits.reduce((count, habit) => {
      return count + (dayRecords[habit.id] ? 1 : 0);
    }, 0);
    
    return Math.round((completedCount / habits.length) * 100);
  };
  
  return (
    <div className="daily-view">
      <div className="date-navigation">
        <button className="nav-button" onClick={goToPreviousWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="week-indicator">
          <span>Semana del {formatDate(daysOfWeek[0], 'medium')} al {formatDate(daysOfWeek[6], 'medium')}</span>
          <button className="today-button" onClick={goToToday}>Hoy</button>
        </div>
        
        <button className="nav-button" onClick={goToNextWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      <div className="days-of-week">
        {daysOfWeek.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDateStr;
          const isToday = dateStr === formatDate(new Date());
          const completionRate = calculateCompletionRate(date);
          
          return (
            <button
              key={dateStr}
              className={`day-button ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => changeSelectedDate(date)}
            >
              <div className="day-name">{formatDate(date, 'day')}</div>
              <div className="day-date">{formatDate(date, 'short-day')}</div>
              
              {habits.length > 0 && (
                <div 
                  className="completion-indicator"
                  style={{ 
                    backgroundColor: `hsl(${completionRate}, 70%, 50%)`,
                    opacity: completionRate > 0 ? 1 : 0.3 
                  }}
                >
                  {completionRate}%
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="selected-day-content">
        <h2 className="selected-day-title">
          {formatDate(selectedDate, 'full')}
        </h2>
        
        {/* Sección de hábitos */}
        <div className="section habits-section">
          <h3 className="section-title">Hábitos Diarios</h3>
          
          {habits.length > 0 ? (
            <div className="habits-grid">
              {habits.map((habit) => {
                const isCompleted = habitRecords[selectedDateStr]?.[habit.id] || false;
                
                return (
                  <div key={habit.id} className={`habit-card ${isCompleted ? 'completed' : ''}`}>
                    <div 
                      className="habit-checkbox" 
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {isCompleted && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <div className="habit-info">
                      <div className="habit-name">{habit.name}</div>
                      {habit.description && (
                        <div className="habit-description">{habit.description}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay hábitos configurados. Agrega algunos en la sección de Ajustes.</p>
            </div>
          )}
        </div>
        
        {/* Sección de variables diarias */}
        {dailyVariables.length > 0 && (
          <div className="section variables-section">
            <h3 className="section-title">Variables Diarias</h3>
            <div className="variables-grid">
              {dailyVariables.map((variable) => {
                const currentValue = variableRecords[selectedDateStr]?.[variable.id] || '';
                
                return (
                  <div key={variable.id} className="variable-card">
                    <label className="variable-name" htmlFor={`variable-${variable.id}`}>
                      {variable.name}
                    </label>
                    <div className="variable-input-container">
                      <input
                        id={`variable-${variable.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentValue}
                        onChange={(e) => updateDailyVariable(variable.id, e.target.value)}
                        className="variable-input"
                      />
                      <span className="variable-unit">{variable.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Sección de progreso de metas */}
        {goals.length > 0 && (
          <div className="section goals-section">
            <h3 className="section-title">Progreso de Metas</h3>
            <div className="goals-grid">
              {goals.map((goal) => {
                const currentValue = goalProgress[goal.id]?.current || '';
                const targetValue = goal.target;
                const percentage = currentValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;
                
                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-info">
                      <div className="goal-name">{goal.name}</div>
                      <div className="goal-details">
                        <span className="goal-target">Meta: {goal.target} {goal.unit}</span>
                        {goal.deadline && (
                          <span className="goal-deadline">Para: {goal.deadline}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="goal-progress">
                      <div className="goal-input-container">
                        <label htmlFor={`goal-${goal.id}`}>Progreso actual:</label>
                        <div className="input-with-unit">
                          <input
                            id={`goal-${goal.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentValue}
                            onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                            className="goal-input"
                          />
                          <span className="goal-unit">{goal.unit}</span>
                        </div>
                      </div>
                      
                      <div className="progress-bar-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: `hsl(${percentage}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <span className="progress-percentage">{Math.round(percentage)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {habits.length === 0 && dailyVariables.length === 0 && goals.length === 0 && (
          <div className="empty-all-state">
            <p>No hay elementos configurados. Visita la sección de Ajustes para comenzar a añadir hábitos, variables y metas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyView;
