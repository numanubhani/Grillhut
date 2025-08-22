import React from 'react';
import { Search } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="bg-black/95 backdrop-blur-md border-b border-yellow-500/30 py-4 sticky top-16 z-40 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg font-semibold'
                  : 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-500/30'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg font-semibold'
                    : 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-500/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-800 text-white border border-yellow-500/30 rounded-full pl-10 pr-4 py-2 w-64 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;