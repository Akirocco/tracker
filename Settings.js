// components/Settings.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/Settings.css';

const Settings = ({ 
  habits, 
  setHabits, 
  goals, 
  setGoals, 
  dailyVariables, 
  setDailyVariables,
  habitRecords,
  goalProgress,
  variableRecords,
  setHabitRecords,
  setGoalProgress,
  setVariableRecords
}) => {
  // Estado para la pestaña de configuración activa
  const [activeTab, setActiveTab] = useState('habits');
  
  // Estados para los formularios
  const [newHabit, setNewHabit] = useState({ name: '', description: '', color: '#3b82f6' });
  const [newGoal, setNewGoal] = useState({ name: '', description: '', target: '', unit: '', deadline: '', type: 'noDate' });
  const [newVariable, setNewVariable] = useState({ name: '', unit: '' });
  
  // Estados para edición
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingVariableId, setEditingVariableId] = useState(null);
  
  // Función para agregar un nuevo hábito
  const addHabit = (e) => {
    e.preventDefault();
    
    if (!newHabit.name.trim()) return;
    
    if (editingHabitId) {
      // Actualizar hábito existente
      setHabits(habits.map(habit => 
        habit.id === editingHabitId 
          ? { ...habit, name: newHabit.name, description: newHabit.description, color: newHabit.color }
          : habit
      ));
      setEditingHabitId(null);
    } else {
      // Agregar nuevo hábito
      const habit = {
        id: uuidv4(),
        name: newHabit.name,
        description: newHabit.description,
        color: newHabit.color,
        createdAt: new Date().toISOString()
      };
      
      setHabits([...habits, habit]);
    }
    
    // Restablecer el formulario
    setNewHabit({ name: '', description: '', color: '#3b82f6' });
  };
  
  // Función para agregar una nueva meta
  const addGoal = (e) => {
    e.preventDefault();
    
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.unit.trim()) return;
    
    let deadlineValue = '';
    if (newGoal.type === 'sixMonths') {
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      deadlineValue = date.toISOString().split('T')[0];
    } else if (newGoal.type === 'oneYear') {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      deadlineValue = date.toISOString().split('T')[0];
    } else if (newGoal.type === 'custom') {
      deadlineValue = newGoal.deadline;
    }
    
    if (editingGoalId) {
      // Actualizar meta existente
      setGoals(goals.map(goal => 
        goal.id === editingGoalId 
          ? { 
              ...goal, 
              name: newGoal.name, 
              description: newGoal.description, 
              target: parseFloat(newGoal.target),
              unit: newGoal.unit,
              deadline: deadlineValue,
              type: newGoal.type
            }
          : goal
      ));
      setEditingGoalId(null);
    } else {
      // Agregar nueva meta
      const goal = {
        id: uuidv4(),
        name: newGoal.name,
        description: newGoal.description,
        target: parseFloat(newGoal.target),
        unit: newGoal.unit,
        deadline: deadlineValue,
        type: newGoal.type,
        createdAt: new Date().toISOString()
      };
      
      setGoals([...goals, goal]);
      
      // Inicializar el progreso de la meta
      setGoalProgress(prev => ({
        ...prev,
        [goal.id]: { current: 0, history: {} }
      }));
    }
    
    // Restablecer el formulario
    setNewGoal({ name: '', description: '', target: '', unit: '', deadline: '', type: 'noDate' });
  };
  
  // Función para agregar una nueva variable
  const addVariable = (e) => {
    e.preventDefault();
    
    if (!newVariable.name.trim() || !newVariable.unit.trim()) return;
    
    if (editingVariableId) {
      // Actualizar variable existente
      setDailyVariables(dailyVariables.map(variable => 
        variable.id === editingVariableId 
          ? { ...variable, name: newVariable.name, unit: newVariable.unit }
          : variable
      ));
      setEditingVariableId(null);
    } else {
      // Agregar nueva variable
      const variable = {
        id: uuidv4(),
        name: newVariable.name,
        unit: newVariable.unit,
        createdAt: new Date().toISOString()
      };
      
      setDailyVariables([...dailyVariables, variable]);
    }
    
    // Restablecer el formulario
    setNewVariable({ name: '', unit: '' });
  };
  
  // Función para eliminar un hábito
  const deleteHabit = (habitId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hábito? Se perderán todos los registros asociados.')) {
      setHabits(habits.filter(habit => habit.id !== habitId));
      
      // Eliminar registros asociados
      const newHabitRecords = { ...habitRecords };
      
      Object.keys(newHabitRecords).forEach(dateStr => {
        if (newHabitRecords[dateStr][habitId]) {
          const newDateRecords = { ...newHabitRecords[dateStr] };
          delete newDateRecords[habitId];
          newHabitRecords[dateStr] = newDateRecords;
        }
      });
      
      setHabitRecords(newHabitRecords);
    }
  };
  
  // Función para eliminar una meta
  const deleteGoal = (goalId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta meta? Se perderán todos los registros asociados.')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
      
      // Eliminar progreso asociado
      const newGoalProgress = { ...goalProgress };
      delete newGoalProgress[goalId];
      setGoalProgress(newGoalProgress);
    }
  };
  
  // Función para eliminar una variable
  const deleteVariable = (variableId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta variable? Se perderán todos los registros asociados.')) {
      setDailyVariables(dailyVariables.filter(variable => variable.id !== variableId));
      
      // Eliminar registros asociados
      const newVariableRecords = { ...variableRecords };
      
      Object.keys(newVariableRecords).forEach(dateStr => {
        if (newVariableRecords[dateStr][variableId]) {
          const newDateRecords = { ...newVariableRecords[dateStr] };
          delete newDateRecords[variableId];
          newVariableRecords[dateStr] = newDateRecords;
        }
      });
      
      setVariableRecords(newVariableRecords);
    }
  };
  
  // Función para editar un hábito existente
  const editHabit = (habit) => {
    setNewHabit({
      name: habit.name,
      description: habit.description || '',
      color: habit.color || '#3b82f6'
    });
    setEditingHabitId(habit.id);
    setActiveTab('habits');
  };
  
  // Función para editar una meta existente
  const editGoal = (goal) => {
    setNewGoal({
      name: goal.name,
      description: goal.description || '',
      target: goal.target.toString(),
      unit: goal.unit,
      deadline: goal.deadline || '',
      type: goal.type || 'noDate'
    });
    setEditingGoalId(goal.id);
    setActiveTab('goals');
  };
  
  // Función para editar una variable existente
  const editVariable = (variable) => {
    setNewVariable({
      name: variable.name,
      unit: variable.unit
    });
    setEditingVariableId(variable.id);
    setActiveTab('variables');
  };
  
  // Función para restaurar todos los datos
  const resetAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      setHabits([]);
      setGoals([]);
      setDailyVariables([]);
      setHabitRecords({});
      setGoalProgress({});
      setVariableRecords({});
      
      alert('Todos los datos han sido eliminados.');
    }
  };
  
  // Función para exportar todos los datos
  const exportData = () => {
    const data = {
      habits,
      goals,
      dailyVariables,
      habitRecords,
      goalProgress,
      variableRecords,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `habit-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Función para importar datos
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validar el formato de los datos
        if (
          !data.habits || 
          !data.goals || 
          !data.dailyVariables || 
          !data.habitRecords || 
          !data.goalProgress || 
          !data.variableRecords
        ) {
          throw new Error('El archivo no tiene el formato correcto');
        }
        
        if (window.confirm('¿Estás seguro de que quieres importar estos datos? Se sobrescribirán todos los datos actuales.')) {
          setHabits(data.habits);
          setGoals(data.goals);
          setDailyVariables(data.dailyVariables);
          setHabitRecords(data.habitRecords);
          setGoalProgress(data.goalProgress);
          setVariableRecords(data.variableRecords);
          
          alert('Datos importados correctamente.');
        }
      } catch (err) {
        alert('Error al importar los datos: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="settings">
      <h1 className="settings-title">Configuración</h1>
      
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          Hábitos
        </button>
        <button 
          className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Metas
        </button>
        <button 
          className={`tab-button ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => setActiveTab('variables')}
        >
          Variables
        </button>
        <button 
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Datos
        </button>
      </div>
      
      <div className="settings-content">
        {/* Configuración de hábitos */}
        {activeTab === 'habits' && (
          <div className="habits-settings">
            <form className="form-container" onSubmit={addHabit}>
              <h2 className="form-title">{editingHabitId ? 'Editar Hábito' : 'Agregar Nuevo Hábito'}</h2>
              
              <div className="form-group">
                <label htmlFor="habit-name">Nombre <span className="required">*</span></label>
                <input
                  id="habit-name"
                  type="text"
                  placeholder="Ej: Hacer ejercicio"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="habit-description">Descripción (opcional)</label>
                <textarea
                  id="habit-description"
                  placeholder="Ej: 30 minutos de ejercicio diario"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  rows="2"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="habit-color">Color</label>
                <input
                  id="habit-color"
                  type="color"
                  value={newHabit.color}
                  onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingHabitId ? 'Actualizar Hábito' : 'Agregar Hábito'}
                </button>
                
                {editingHabitId && (
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setEditingHabitId(null);
                      setNewHabit({ name: '', description: '', color: '#3b82f6' });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            
            <div className="items-list">
              <h2 className="list-title">Hábitos Configurados</h2>
              
              {habits.length > 0 ? (
                <ul className="settings-list">
                  {habits.map(habit => (
                    <li key={habit.id} className="settings-item">
                      <div className="item-color" style={{ backgroundColor: habit.color || '#3b82f6' }}></div>
                      <div className="item-details">
                        <div className="item-name">{habit.name}</div>
                        {habit.description && (
                          <div className="item-description">{habit.description}</div>
                        )}
                      </div>
                      <div className="item-actions">
                        <button 
                          className="edit-button"
                          onClick={() => editHabit(habit)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-list-message">
                  No hay hábitos configurados. Agrega uno para comenzar.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Configuración de metas */}
        {activeTab === 'goals' && (
          <div className="goals-settings">
            <form className="form-container" onSubmit={addGoal}>
              <h2 className="form-title">{editingGoalId ? 'Editar Meta' : 'Agregar Nueva Meta'}</h2>
              
              <div className="form-group">
                <label htmlFor="goal-name">Nombre <span className="required">*</span></label>
                <input
                  id="goal-name"
                  type="text"
                  placeholder="Ej: Leer libros"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="goal-description">Descripción (opcional)</label>
                <textarea
                  id="goal-description"
                  placeholder="Ej: Leer 12 libros este año"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows="2"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="goal-target">Meta numérica <span className="required">*</span></label>
                  <input
                    id="goal-target"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 12"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group half">
                  <label htmlFor="goal-unit">Unidad <span className="required">*</span></label>
                  <input
                    id="goal-unit"
                    type="text"
                    placeholder="Ej: libros"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Plazo</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deadline-type"
                      value="noDate"
                      checked={newGoal.type === 'noDate'}
                      onChange={() => setNewGoal({ ...newGoal, type: 'noDate', deadline: '' })}
                    />
                    Sin fecha límite
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deadline-type"
                      value="sixMonths"
                      checked={newGoal.type === 'sixMonths'}
                      onChange={() => setNewGoal({ ...newGoal, type: 'sixMonths', deadline: '' })}
                    />
                    6 meses
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deadline-type"
                      value="oneYear"
                      checked={newGoal.type === 'oneYear'}
                      onChange={() => setNewGoal({ ...newGoal, type: 'oneYear', deadline: '' })}
                    />
                    1 año
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deadline-type"
                      value="custom"
                      checked={newGoal.type === 'custom'}
                      onChange={() => setNewGoal({ ...newGoal, type: 'custom' })}
                    />
                    Personalizado
                  </label>
                </div>
              </div>
              
              {newGoal.type === 'custom' && (
                <div className="form-group">
                  <label htmlFor="goal-deadline">Fecha límite</label>
                  <input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    required={newGoal.type === 'custom'}
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingGoalId ? 'Actualizar Meta' : 'Agregar Meta'}
                </button>
                
                {editingGoalId && (
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setEditingGoalId(null);
                      setNewGoal({ name: '', description: '', target: '', unit: '', deadline: '', type: 'noDate' });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            
            <div className="items-list">
              <h2 className="list-title">Metas Configuradas</h2>
              
              {goals.length > 0 ? (
                <ul className="settings-list">
                  {goals.map(goal => (
                    <li key={goal.id} className="settings-item">
                      <div className="item-details">
                        <div className="item-name">{goal.name}</div>
                        <div className="item-meta">
                          Meta: {goal.target} {goal.unit}
                          {goal.deadline && (
                            <span> · Fecha límite: {new Date(goal.deadline).toLocaleDateString()}</span>
                          )}
                        </div>
                        {goal.description && (
                          <div className="item-description">{goal.description}</div>
                        )}
                      </div>
                      <div className="item-actions">
                        <button 
                          className="edit-button"
                          onClick={() => editGoal(goal)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-list-message">
                  No hay metas configuradas. Agrega una para comenzar.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Configuración de variables */}
        {activeTab === 'variables' && (
          <div className="variables-settings">
            <form className="form-container" onSubmit={addVariable}>
              <h2 className="form-title">{editingVariableId ? 'Editar Variable' : 'Agregar Nueva Variable'}</h2>
              
              <div className="form-group">
                <label htmlFor="variable-name">Nombre <span className="required">*</span></label>
                <input
                  id="variable-name"
                  type="text"
                  placeholder="Ej: Horas de trabajo"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="variable-unit">Unidad <span className="required">*</span></label>
                <input
                  id="variable-unit"
                  type="text"
                  placeholder="Ej: horas"
                  value={newVariable.unit}
                  onChange={(e) => setNewVariable({ ...newVariable, unit: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingVariableId ? 'Actualizar Variable' : 'Agregar Variable'}
                </button>
                
                {editingVariableId && (
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setEditingVariableId(null);
                      setNewVariable({ name: '', unit: '' });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            
            <div className="items-list">
              <h2 className="list-title">Variables Configuradas</h2>
              
              {dailyVariables.length > 0 ? (
                <ul className="settings-list">
                  {dailyVariables.map(variable => (
                    <li key={variable.id} className="settings-item">
                      <div className="item-details">
                        <div className="item-name">{variable.name}</div>
                        <div className="item-meta">Unidad: {variable.unit}</div>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="edit-button"
                          onClick={() => editVariable(variable)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => deleteVariable(variable.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-list-message">
                  No hay variables configuradas. Agrega una para comenzar.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Configuración de datos */}
        {activeTab === 'data' && (
          <div className="data-settings">
            <div className="settings-cards">
              <div className="settings-card">
                <h2 className="card-title">Exportar Datos</h2>
                <p className="card-description">
                  Descarga una copia de todos tus datos para hacer una copia de seguridad o transferirlos a otro dispositivo.
                </p>
                <button 
                  className="card-button primary-button"
                  onClick={exportData}
                >
                  Exportar Datos
                </button>
              </div>
              
              <div className="settings-card">
                <h2 className="card-title">Importar Datos</h2>
                <p className="card-description">
                  Sube un archivo de respaldo para restaurar tus datos. Esto sobrescribirá todos los datos actuales.
                </p>
                <label className="file-input-label">
                  Seleccionar Archivo
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={importData}
                    className="file-input"
                  />
                </label>
              </div>
              
              <div className="settings-card danger-card">
                <h2 className="card-title">Eliminar Todos los Datos</h2>
                <p className="card-description">
                  Elimina todos los datos almacenados. Esta acción no se puede deshacer.
                </p>
                <button 
                  className="card-button danger-button"
                  onClick={resetAllData}
                >
                  Eliminar Todos los Datos
                </button>
              </div>
            </div>
            
            <div className="data-info">
              <h3 className="info-title">Información de Uso de Datos</h3>
              <ul className="info-list">
                <li>Todos los datos se almacenan localmente en tu navegador (localStorage).</li>
                <li>Ningún dato se transmite a servidores externos.</li>
                <li>Los datos se perderán si limpias el almacenamiento del navegador.</li>
                <li>Realiza copias de seguridad periódicamente usando la función de exportar datos.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
