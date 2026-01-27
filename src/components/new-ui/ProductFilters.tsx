'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Category } from '@/data/types';
import { FilterData } from '@/types/filter';

interface ProductFiltersProps {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: FilterData;
  onFilterChange: (filterData: FilterData) => void;
  onClearFilters?: () => void;
}

/**
 * ProductFilters Component
 * Professional filter panel with search, collapsible sections, and individual scrolling
 */
export default function ProductFilters({
  sizes,
  colors,
  categories,
  filterData,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
  });

  const [searchQueries, setSearchQueries] = useState({
    colors: '',
    sizes: '',
  });

  const toggleSection = (section: 'categories' | 'colors' | 'sizes') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Handle category selection
   */
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filterData,
      categoryId: filterData.categoryId === categoryId ? '' : categoryId,
    });
  };

  /**
   * Handle color selection/deselection
   */
  const handleColorChange = (color: string) => {
    const currentColors = filterData.color ? filterData.color.split(',').filter(Boolean) : [];
    const colorIndex = currentColors.indexOf(color);

    let newColors: string[];
    if (colorIndex > -1) {
      // Remove color
      newColors = currentColors.filter((c) => c !== color);
    } else {
      // Add color
      newColors = [...currentColors, color];
    }

    onFilterChange({
      ...filterData,
      color: newColors.join(','),
    });
  };

  /**
   * Handle size selection/deselection
   */
  const handleSizeChange = (size: string) => {
    const currentSizes = filterData.size ? filterData.size.split(',').filter(Boolean) : [];
    const sizeIndex = currentSizes.indexOf(size);

    let newSizes: string[];
    if (sizeIndex > -1) {
      // Remove size
      newSizes = currentSizes.filter((s) => s !== size);
    } else {
      // Add size
      newSizes = [...currentSizes, size];
    }

    onFilterChange({
      ...filterData,
      size: newSizes.join(','),
    });
  };

  /**
   * Check if a color is selected
   */
  const isColorSelected = (color: string) => {
    const selectedColors = filterData.color ? filterData.color.split(',') : [];
    return selectedColors.includes(color);
  };

  /**
   * Check if a size is selected
   */
  const isSizeSelected = (size: string) => {
    const selectedSizes = filterData.size ? filterData.size.split(',') : [];
    return selectedSizes.includes(size);
  };

  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterData.categoryId) count++;
    if (filterData.color) count += filterData.color.split(',').filter(Boolean).length;
    if (filterData.size) count += filterData.size.split(',').filter(Boolean).length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  /**
   * Format color name for display
   */
  const formatColorName = (color: string) => {
    return color
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  /**
   * Filter colors based on search query
   */
  const filteredColors = colors.filter((color) =>
    formatColorName(color).toLowerCase().includes(searchQueries.colors.toLowerCase())
  );

  /**
   * Filter sizes based on search query
   */
  const filteredSizes = sizes.filter((size) =>
    size.toLowerCase().includes(searchQueries.sizes.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Container with overall scroll */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="p-4 space-y-4">
          {/* Categories Filter */}
          {categories.length > 0 && (
            <Collapsible
              open={expandedSections.categories}
              onOpenChange={() => toggleSection('categories')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                <span className="flex items-center gap-2">
                  Categories
                  {filterData.categoryId && (
                    <Badge variant="secondary" className="text-xs">
                      1
                    </Badge>
                  )}
                </span>
                {expandedSections.categories ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-3">
                <ScrollArea className="h-auto max-h-[200px] pr-2">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200",
                        !filterData.categoryId
                          ? "bg-gray-900 text-white font-medium shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200",
                          filterData.categoryId === category.id
                            ? "bg-gray-900 text-white font-medium shadow-sm"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Separator />

          {/* Colors Filter */}
          {colors.length > 0 && (
            <Collapsible
              open={expandedSections.colors}
              onOpenChange={() => toggleSection('colors')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                <span className="flex items-center gap-2">
                  Colors
                  {filterData.color && filterData.color.split(',').filter(Boolean).length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filterData.color.split(',').filter(Boolean).length}
                    </Badge>
                  )}
                </span>
                {expandedSections.colors ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-3">
                {/* Color Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search colors..."
                    value={searchQueries.colors}
                    onChange={(e) =>
                      setSearchQueries((prev) => ({ ...prev, colors: e.target.value }))
                    }
                    className="pl-9 h-9 text-sm"
                  />
                  {searchQueries.colors && (
                    <button
                      onClick={() => setSearchQueries((prev) => ({ ...prev, colors: '' }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Scrollable Color Grid */}
                <ScrollArea className="h-auto max-h-[250px] pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredColors.length > 0 ? (
                      filteredColors.map((color) => {
                        const selected = isColorSelected(color);
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={cn(
                              "px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
                              "border hover:shadow-sm",
                              selected
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            )}
                          >
                            {formatColorName(color)}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-2 text-center py-4 text-sm text-gray-500">
                        No colors found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Separator />

          {/* Sizes Filter */}
          {sizes.length > 0 && (
            <Collapsible
              open={expandedSections.sizes}
              onOpenChange={() => toggleSection('sizes')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                <span className="flex items-center gap-2">
                  Sizes
                  {filterData.size && filterData.size.split(',').filter(Boolean).length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filterData.size.split(',').filter(Boolean).length}
                    </Badge>
                  )}
                </span>
                {expandedSections.sizes ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-3">
                {/* Size Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search sizes..."
                    value={searchQueries.sizes}
                    onChange={(e) =>
                      setSearchQueries((prev) => ({ ...prev, sizes: e.target.value }))
                    }
                    className="pl-9 h-9 text-sm"
                  />
                  {searchQueries.sizes && (
                    <button
                      onClick={() => setSearchQueries((prev) => ({ ...prev, sizes: '' }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Scrollable Size Grid */}
                <ScrollArea className="h-auto max-h-[250px] pr-2">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredSizes.length > 0 ? (
                      filteredSizes.map((size) => {
                        const selected = isSizeSelected(size);
                        return (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            className={cn(
                              "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                              "border hover:shadow-sm",
                              selected
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            )}
                          >
                            {size}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-3 text-center py-4 text-sm text-gray-500">
                        No sizes found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filterData.categoryId && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => handleCategoryChange('')}
              >
                {categories.find((c) => c.id === filterData.categoryId)?.name}
                <X className="w-3 h-3" />
              </Badge>
            )}
            {filterData.color &&
              filterData.color.split(',').filter(Boolean).map((color) => (
                <Badge
                  key={color}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={() => handleColorChange(color)}
                >
                  {formatColorName(color)}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            {filterData.size &&
              filterData.size.split(',').filter(Boolean).map((size) => (
                <Badge
                  key={size}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
