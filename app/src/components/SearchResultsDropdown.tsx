// app/components/SearchResultsDropdown.tsx
'use client';

import { useEffect, useState } from 'react';
import unifiedData from '../data/unified-data';

interface SearchResult {
  type: 'blog' | 'spec';
  title: string;
  description: string;
  slug: string;
}

interface SearchResultsDropdownProps {
  query: string;
  onNavigate: (url: string) => void;
}

export default function SearchResultsDropdown({ query, onNavigate }: SearchResultsDropdownProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = unifiedData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.content?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered as SearchResult[]);
    setShowDropdown(true);
  }, [query]);

  // If no query or no results and query exists, show nothing or "No results"
  if (!query.trim() || !showDropdown) {
    return null;
  }

  return (
    <ul className="absolute left-0 mt-3 md:mt-15 w-full bg-black border border-gray-600 rounded max-h-80 overflow-y-auto z-50 shadow-lg">
      {results.length > 0 ? (
        results.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
            onClick={() =>
              onNavigate(
                item.type === 'blog'
                  ? `/blog/${item.slug}?query=${encodeURIComponent(query)}`
                  : `/specification/${item.slug}?query=${encodeURIComponent(query)}`
              )
            }
          >
            <div className="text-sm uppercase text-gray-500">
              {item.type === 'blog' ? 'Blog Post' : 'Specification'}
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-400">No results found</li>
      )}
    </ul>
  );
}