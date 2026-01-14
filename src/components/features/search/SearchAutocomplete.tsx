'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Home, Clock, X, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'property' | 'neighborhood' | 'priceRange';
  title: string;
  subtitle?: string;
  icon: 'property' | 'neighborhood' | 'price';
}

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSelect?: (result: SearchResult) => void;
}

// Mock data - in production, this would come from an API
const mockNeighborhoods = [
  { id: 'bebek', name: 'Bebek', district: 'Beşiktaş' },
  { id: 'galata', name: 'Galata', district: 'Beyoğlu' },
  { id: 'nisantasi', name: 'Nişantaşı', district: 'Şişli' },
  { id: 'cihangir', name: 'Cihangir', district: 'Beyoğlu' },
  { id: 'sariyer', name: 'Sarıyer', district: 'Sarıyer' },
  { id: 'kandilli', name: 'Kandilli', district: 'Üsküdar' },
  { id: 'arnavutkoy', name: 'Arnavutköy', district: 'Beşiktaş' },
  { id: 'levent', name: 'Levent', district: 'Beşiktaş' },
];

const priceRanges = [
  { id: 'under-500k', label: 'Under €500,000', min: 0, max: 500000 },
  { id: '500k-1m', label: '€500,000 - €1,000,000', min: 500000, max: 1000000 },
  { id: '1m-2m', label: '€1,000,000 - €2,000,000', min: 1000000, max: 2000000 },
  { id: '2m-5m', label: '€2,000,000 - €5,000,000', min: 2000000, max: 5000000 },
  { id: 'over-5m', label: 'Over €5,000,000', min: 5000000, max: null },
];

export function SearchAutocomplete({
  placeholder,
  className,
  onSelect,
}: SearchAutocompleteProps) {
  const t = useTranslations('Search');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const [recentSearches, setRecentSearches] = useLocalStorage<SearchResult[]>(
    'recent-searches',
    []
  );

  const debouncedQuery = useDebounce(query, 300);

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const lowerQuery = searchQuery.toLowerCase();
      const searchResults: SearchResult[] = [];

      // Search neighborhoods
      mockNeighborhoods
        .filter(
          (n) =>
            n.name.toLowerCase().includes(lowerQuery) ||
            n.district.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 4)
        .forEach((n) => {
          searchResults.push({
            id: n.id,
            type: 'neighborhood',
            title: n.name,
            subtitle: n.district,
            icon: 'neighborhood',
          });
        });

      // Search price ranges if query contains numbers
      if (/\d/.test(searchQuery)) {
        priceRanges.slice(0, 2).forEach((range) => {
          searchResults.push({
            id: range.id,
            type: 'priceRange',
            title: range.label,
            subtitle: 'Price Range',
            icon: 'price',
          });
        });
      }

      // Add property type results
      const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Yalı'];
      propertyTypes
        .filter((type) => type.toLowerCase().includes(lowerQuery))
        .slice(0, 2)
        .forEach((type) => {
          searchResults.push({
            id: type.toLowerCase(),
            type: 'property',
            title: type,
            subtitle: 'Property Type',
            icon: 'property',
          });
        });

      setResults(searchResults);
      setIsLoading(false);
    }, 200);
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.id !== result.id);
      return [result, ...filtered].slice(0, 5);
    });

    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);

    if (onSelect) {
      onSelect(result);
    } else {
      // Default navigation
      if (result.type === 'neighborhood') {
        router.push(`/neighborhoods/${result.id}`);
      } else if (result.type === 'property') {
        router.push(`/properties?type=${result.id}`);
      } else if (result.type === 'priceRange') {
        router.push(`/properties?priceRange=${result.id}`);
      }
    }
  };

  // Remove from recent searches
  const removeRecent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((r) => r.id !== id));
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const items = query ? results : recentSearches;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          handleSelect(items[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'neighborhood':
        return <MapPin size={16} className="text-accent-gold" />;
      case 'property':
        return <Home size={16} className="text-primary" />;
      case 'price':
        return <TrendingUp size={16} className="text-green-600" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  const displayItems = query ? results : recentSearches;
  const showDropdown = isOpen && (displayItems.length > 0 || isLoading);

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('placeholder')}
          className={cn(
            'w-full pl-12 pr-10 py-3 rounded-lg border border-border',
            'bg-white text-text-primary placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-200'
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full left-0 right-0 mt-2 z-50',
            'bg-white rounded-lg shadow-xl border border-border',
            'max-h-[400px] overflow-y-auto'
          )}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && displayItems.length > 0 && (
            <div>
              {/* Section Header */}
              {!query && recentSearches.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gray-50">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <Clock size={12} />
                    {t('recentSearches')}
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary hover:underline"
                  >
                    {t('clearAll')}
                  </button>
                </div>
              )}

              {/* Items */}
              <ul>
                {displayItems.map((item, index) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSelect(item)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left',
                        'hover:bg-gray-50 transition-colors',
                        activeIndex === index && 'bg-gray-50'
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getIcon(item.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      {!query && (
                        <button
                          onClick={(e) => removeRecent(e, item.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <Search size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">{t('noResults')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t('tryDifferentKeywords')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
