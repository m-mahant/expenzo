import { useState, useEffect } from 'react';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return {
    expenses,
    darkMode,
    addExpense,
    deleteExpense,
    toggleDarkMode,
  };
};