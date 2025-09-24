import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchFilter {
  key: string;
  label: string;
  options: string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, string[]>) => void;
  filters?: SearchFilter[];
  placeholder?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  filters = [],
  placeholder = "Search..."
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query, activeFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeFilters, onSearch]);

  const addFilter = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: [...(prev[filterKey] || []), value]
    }));
  };

  const removeFilter = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: (prev[filterKey] || []).filter(v => v !== value)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).flat().length;
  }, [activeFilters]);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className={`flex items-center relative transition-all duration-300 ${
          searchFocused ? 'transform scale-105' : ''
        }`}>
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pl-10 pr-20 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 focus:border-blue-500 transition-all duration-300"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 transition-all duration-300 ${
              activeFilterCount > 0 ? 'bg-blue-100 border-blue-300' : ''
            }`}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-500 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center animate-slideInDown">
          <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
          {Object.entries(activeFilters).map(([filterKey, values]) =>
            values.map(value => (
              <Badge
                key={`${filterKey}-${value}`}
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-all duration-200"
                onClick={() => removeFilter(filterKey, value)}
              >
                {value}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border p-4 animate-slideInDown">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => (
              <div key={filter.key} className="space-y-2">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">
                  {filter.label}
                </h4>
                <div className="space-y-1">
                  {filter.options.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(activeFilters[filter.key] || []).includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addFilter(filter.key, option);
                          } else {
                            removeFilter(filter.key, option);
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};