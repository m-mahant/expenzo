import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CHART_COLORS } from '../utils/constants';

const ExpenseChart = ({ expenses, chartType = 'pie' }) => {
  const categoryData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount,
      });
    }
    return acc;
  }, []);

  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-800 dark:text-white font-semibold">
            {`${payload[0].name}: ${payload[0].value.toFixed(2)}`}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {`${((payload[0].value / totalAmount) * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Expense Overview
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            Add some expenses to see your spending chart
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-gradient backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Expense Overview
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {chartType === 'pie' ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        {categoryData.map((item) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: CHART_COLORS[item.name] }}
            />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {item.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${item.value.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExpenseChart;