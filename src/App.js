import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import CategoryFilter from './components/CategoryFilter';
import ThemeToggle from './components/ThemeToggle';
import { useExpenses } from './hooks/useExpenses';
import './styles/globals.css';

function App() {
  const { expenses, darkMode, addExpense, deleteExpense, toggleDarkMode } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentView, setCurrentView] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'expenses', name: 'Expenses', icon: '💰' },
    { id: 'charts', name: 'Charts', icon: '📈' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} />;
      case 'expenses':
        return (
          <div className="space-y-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              selectedCategory={selectedCategory}
            />
          </div>
        );
      case 'charts':
        return <ExpenseChart expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">💸</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Expenzo
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navigation.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </motion.button>
                ))}
              </nav>
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </main>

      {/* Add Expense FAB */}
      <AddExpense onAddExpense={addExpense} />

      {/* Background Decoration */}
      <div className="floating-shapes">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rotate-45 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rotate-12 animate-float"></div>

        {/* Triangle Shapes */}
        <div className="absolute top-60 left-1/4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-purple-300/30 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-60 right-1/4 w-0 h-0 border-l-10 border-r-10 border-b-20 border-l-transparent border-r-transparent border-b-pink-300/30 animate-float animation-delay-4000"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-indigo-300/10 via-purple-300/10 to-pink-300/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-cyan-300/10 via-blue-300/10 to-purple-300/10 rounded-full blur-xl animate-float animation-delay-2000"></div>

        {/* Dotted Patterns */}
        <div className="absolute top-32 right-1/3 grid grid-cols-3 gap-2 animate-float animation-delay-4000">
          <div className="w-2 h-2 bg-purple-400/40 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-400/40 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-400/40 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400/40 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400/40 rounded-full"></div>
          <div className="w-2 h-2 bg-red-400/40 rounded-full"></div>
        </div>

        {/* Lines and Strokes */}
        <div className="absolute bottom-32 left-1/3 w-24 h-1 bg-gradient-to-r from-purple-400/30 to-transparent animate-float"></div>
        <div className="absolute top-1/2 right-10 w-1 h-24 bg-gradient-to-b from-pink-400/30 to-transparent animate-float animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default App;