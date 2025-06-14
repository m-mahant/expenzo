import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Calendar } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

const AddExpense = ({ onAddExpense }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && description && date) {
      onAddExpense({
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date).toISOString(),
      });
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Pulsing Ring Animation */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-ring"></div>
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-ring animation-delay-2000"></div>
      </div>

      {/* Floating Text Hint */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-20 right-20 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40"
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <div className="relative">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Add your expense! 💰
          </p>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse-dot"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Add Expense
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="What did you spend on?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    required
                  />
                  <div className="absolute right-3 top-3 w-5 h-5 pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        category === cat.name
                          ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 bg-white dark:bg-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className={`text-sm font-medium ${
                          category === cat.name ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {cat.name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Expense
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AddExpense;