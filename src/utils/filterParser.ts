/**
 * Utility functions for parsing and converting filter formats according to FacturaScripts API documentation
 */

/**
 * Parses filter parameters from URL search params and converts them to FacturaScripts API format
 * Supports operators: _gt, _gte, _lt, _lte, _neq, _like
 * @param searchParams - URLSearchParams object from the request
 * @returns Object with filter and operation parameters in FacturaScripts format
 */
export function parseFiltersFromSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Handle all filter[...] parameters
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter[') && key.endsWith(']')) {
      // Extract field name from filter[field] format
      const field = key.slice(7, -1); // Remove 'filter[' and ']'
      if (field) {
        params[key] = value;
      }
    } else if (key.startsWith('operation[') && key.endsWith(']')) {
      // Handle operation[field]=OR overrides
      const field = key.slice(10, -1); // Remove 'operation[' and ']'
      if (field && value.toUpperCase() === 'OR') {
        params[key] = 'OR';
      }
    }
  });
  
  return params;
}

/**
 * Legacy function to maintain compatibility with existing simple filter format
 * Converts "field:value" format to FacturaScripts filter[field]=value format
 * @param filterParam - Filter string in format "field:value" or "field1:value1,field2:value2"
 * @returns Object with filter parameters in FacturaScripts format
 */
export function parseFilters(filterParam: string): Record<string, string> {
  const filterParams: Record<string, string> = {};
  
  if (!filterParam || typeof filterParam !== 'string') {
    return filterParams;
  }

  // Split multiple filters by comma
  const filters = filterParam.split(',');
  
  for (const filter of filters) {
    const trimmedFilter = filter.trim();
    if (!trimmedFilter) continue;
    
    // Split by first colon to handle values that might contain colons
    const colonIndex = trimmedFilter.indexOf(':');
    if (colonIndex === -1) continue;
    
    const field = trimmedFilter.substring(0, colonIndex).trim();
    const value = trimmedFilter.substring(colonIndex + 1).trim();
    
    if (field && value) {
      // Convert to FacturaScripts filter format: filter[field]=value
      filterParams[`filter[${field}]`] = value;
    }
  }
  
  return filterParams;
}

/**
 * Parses sort parameters from URL search params and converts them to FacturaScripts API format
 * @param searchParams - URLSearchParams object from the request
 * @returns Object with sort parameters in FacturaScripts format
 */
export function parseSortFromSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Handle all sort[...] parameters
  searchParams.forEach((value, key) => {
    if (key.startsWith('sort[') && key.endsWith(']')) {
      // Extract field name from sort[field] format
      const field = key.slice(5, -1); // Remove 'sort[' and ']'
      if (field && (value.toUpperCase() === 'ASC' || value.toUpperCase() === 'DESC')) {
        params[key] = value.toUpperCase();
      }
    }
  });
  
  return params;
}

/**
 * Legacy function to maintain compatibility with existing simple order format
 * Parses order string and converts it to FacturaScripts API format
 * @param orderParam - Order string in format "field:asc" or "field:desc"
 * @returns Object with order parameters in FacturaScripts format
 */
export function parseOrder(orderParam: string): Record<string, string> {
  const orderParams: Record<string, string> = {};
  
  if (!orderParam || typeof orderParam !== 'string') {
    return orderParams;
  }

  const colonIndex = orderParam.indexOf(':');
  if (colonIndex === -1) return orderParams;
  
  const field = orderParam.substring(0, colonIndex).trim();
  const direction = orderParam.substring(colonIndex + 1).trim().toLowerCase();
  
  if (field && (direction === 'asc' || direction === 'desc')) {
    // Convert to FacturaScripts sort format: sort[field]=ASC|DESC
    orderParams[`sort[${field}]`] = direction.toUpperCase();
  }
  
  return orderParams;
}

/**
 * Normalizes text for _like searches by converting to lowercase and removing accents
 * @param text - Text to normalize
 * @returns Normalized text for search
 */
export function normalizeLikeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics/accents
}

/**
 * Parses all URL parameters and converts them to FacturaScripts API format
 * @param url - Full URL with search parameters
 * @returns Object containing limit, offset, and all filter/sort parameters
 */
export function parseUrlParameters(url: string): {
  limit: number;
  offset: number;
  additionalParams: Record<string, string>;
} {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;
  
  // Parse limit and offset
  const limitParam = searchParams.get('limit');
  const offsetParam = searchParams.get('offset');
  const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 50;
  const offset = offsetParam && !isNaN(parseInt(offsetParam)) ? parseInt(offsetParam) : 0;
  
  // Parse all other parameters
  const additionalParams: Record<string, string> = {};
  
  // Add filter and operation parameters
  Object.assign(additionalParams, parseFiltersFromSearchParams(searchParams));
  
  // Add sort parameters
  Object.assign(additionalParams, parseSortFromSearchParams(searchParams));
  
  // Handle legacy filter and order parameters for backward compatibility
  const legacyFilter = searchParams.get('filter');
  const legacyOrder = searchParams.get('order');
  
  if (legacyFilter) {
    Object.assign(additionalParams, parseFilters(legacyFilter));
  }
  
  if (legacyOrder) {
    Object.assign(additionalParams, parseOrder(legacyOrder));
  }
  
  return {
    limit,
    offset,
    additionalParams,
  };
}