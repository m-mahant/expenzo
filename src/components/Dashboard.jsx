import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

const Dashboard = ({ expenses }) => {
  const [timeFilter, setTimeFilter] = useState('month');

  const getFilteredExpenses = () => {
    const now = new Date();
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (timeFilter) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo;
        case 'month':
          return expenseDate.getMonth() === now.getMonth() &&
                 expenseDate.getFullYear() === now.getFullYear();
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  const expenseCount = filteredExpenses.length;

  const topCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategoryName = Object.keys(topCategory).reduce((a, b) =>
    topCategory[a] > topCategory[b] ? a : b, '');

  const stats = [
    {
      title: 'Total Spent',
      value: `${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-green-400 to-blue-500',
      change: '+12.5%'
    },
    {
      title: 'Transactions',
      value: expenseCount.toString(),
      icon: TrendingUp,
      gradient: 'from-purple-400 to-pink-500',
      change: '+8.2%'
    },
    {
      title: 'Average',
      value: `${averageExpense.toFixed(2)}`,
      icon: Calendar,
      gradient: 'from-yellow-400 to-orange-500',
      change: '-2.1%'
    },
    {
      title: 'Top Category',
      value: topCategoryName || 'None',
      icon: PieChart,
      gradient: 'from-red-400 to-purple-500',
      change: topCategoryName ? `${topCategory[topCategoryName]?.toFixed(2)}` : '$0.00'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === filter
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-gradient backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-r ${stat.gradient}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;