import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../utils/constants';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const allCategories = ['All', ...CATEGORIES.map(cat => cat.name)];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const categoryInfo = CATEGORIES.find(cat => cat.name === category);
          const isSelected = selectedCategory === category;

          return (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? category === 'All'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                    : `bg-gradient-to-r ${categoryInfo?.color || 'from-gray-400 to-gray-600'} text-white border-transparent`
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                {categoryInfo && <span>{categoryInfo.icon}</span>}
                <span className="text-sm font-medium">{category}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;