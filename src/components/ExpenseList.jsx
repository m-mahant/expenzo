import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, Filter, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

const ExpenseList = ({ expenses, onDeleteExpense, selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getCategoryInfo = (categoryName) => {
    return CATEGORIES.find(cat => cat.name === categoryName) || CATEGORIES[CATEGORIES.length - 1];
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          if (customDateStart) {
            startDate = new Date(customDateStart);
          }
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          if (dateRange === 'custom' && customDateEnd) {
            const endDate = new Date(customDateEnd);
            return expenseDate >= startDate && expenseDate <= endDate;
          }
          return expenseDate >= startDate;
        });
      }
    }

    // Amount range filter
    if (amountRange.min !== '' || amountRange.max !== '') {
      filtered = filtered.filter(expense => {
        const amount = expense.amount;
        const min = amountRange.min === '' ? 0 : parseFloat(amountRange.min);
        const max = amountRange.max === '' ? Infinity : parseFloat(amountRange.max);
        return amount >= min && amount <= max;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, selectedCategory, searchTerm, sortBy, sortOrder, dateRange, customDateStart, customDateEnd, amountRange]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange('all');
    setCustomDateStart('');
    setCustomDateEnd('');
    setAmountRange({ min: '', max: '' });
  };

  const hasActiveFilters = searchTerm || dateRange !== 'all' || amountRange.min !== '' || amountRange.max !== '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Recent Expenses ({filteredAndSortedExpenses.length})
        </h2>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-purple-500 text-white border-purple-500'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {hasActiveFilters && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {[searchTerm, dateRange !== 'all', amountRange.min !== '' || amountRange.max !== ''].filter(Boolean).length}
              </span>
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by description or category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* First row - Sort and Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                      <option value="description">Description</option>
                      <option value="category">Category</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              {/* Second row - Amount Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amountRange.min}
                      onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      value={amountRange.max}
                      onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div></div> {/* Empty div for grid alignment */}
              </div>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💸</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {hasActiveFilters ? 'No expenses match your filters.' : 'No expenses yet. Start tracking your spending!'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            filteredAndSortedExpenses.map((expense, index) => {
              const categoryInfo = getCategoryInfo(expense.category);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center`}>
                        <span className="text-xl">{categoryInfo.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {expense.description}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                            {expense.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">
                        {expense.amount.toFixed(2)}
                      </span>
                      <motion.button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpenseList;