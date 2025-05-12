// App.js - Componente principal de la aplicación
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import GlobalView from './components/GlobalView';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import { LocalStorageManager } from './utils/LocalStorageManager';
import './styles/App.css';

function App() {
  // Estados para los hábitos, metas y variables de seguimiento diario
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dailyVariables, setDailyVariables] = useState([]);
  const [habitRecords, setHabitRecords] = useState({});
  const [goalProgress, setGoalProgress] = useState({});
  const [variableRecords, setVariableRecords] = useState({});
  
  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const localData = LocalStorageManager.getAllData();
    if (localData) {
      setHabits(localData.habits || []);
      setGoals(localData.goals || []);
      setDailyVariables(localData.dailyVariables || []);
      setHabitRecords(localData.habitRecords || {});
      setGoalProgress(localData.goalProgress || {});
      setVariableRecords(localData.variableRecords || {});
    }
  }, []);
  
  // Guardar cambios en localStorage cuando los datos se actualizan
  useEffect(() => {
    LocalStorageManager.saveData({
      habits,
      goals,
      dailyVariables,
      habitRecords,
      goalProgress,
      variableRecords
    });
  }, [habits, goals, dailyVariables, habitRecords, goalProgress, variableRecords]);
  
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard 
              habits={habits}
              goals={goals}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              goalProgress={goalProgress}
              variableRecords={variableRecords}
            />} />
            <Route path="/daily" element={<DailyView 
              habits={habits}
              goals={goals}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              setHabitRecords={setHabitRecords}
              goalProgress={goalProgress}
              setGoalProgress={setGoalProgress}
              variableRecords={variableRecords}
              setVariableRecords={setVariableRecords}
            />} />
            <Route path="/weekly" element={<WeeklyView 
              habits={habits}
              goals={goals}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              goalProgress={goalProgress}
              variableRecords={variableRecords}
            />} />
            <Route path="/monthly" element={<MonthlyView 
              habits={habits}
              goals={goals}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              goalProgress={goalProgress}
              variableRecords={variableRecords}
            />} />
            <Route path="/global" element={<GlobalView 
              habits={habits}
              goals={goals}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              goalProgress={goalProgress}
              variableRecords={variableRecords}
            />} />
            <Route path="/settings" element={<Settings 
              habits={habits}
              setHabits={setHabits}
              goals={goals}
              setGoals={setGoals}
              dailyVariables={setDailyVariables}
              dailyVariables={dailyVariables}
              habitRecords={habitRecords}
              goalProgress={goalProgress}
              variableRecords={variableRecords}
              setHabitRecords={setHabitRecords}
              setGoalProgress={setGoalProgress}
              setVariableRecords={setVariableRecords}
            />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
