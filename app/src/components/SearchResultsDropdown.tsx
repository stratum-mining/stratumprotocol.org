'use client';

import { useEffect, useState } from 'react';
import unifiedData from '../data/unified-data';
import { useTranslation } from "react-i18next";

interface SearchResult {
  type: 'blog';
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
  const { t } = useTranslation();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = unifiedData.filter((item) =>
      item.type === 'spec' &&
      (
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.content?.toLowerCase().includes(query.toLowerCase())
      )
    );

    setResults(filtered as SearchResult[]);
    setShowDropdown(true);
  }, [query]);

  if (!query.trim() || !showDropdown) {
    return null;
  }

  return (
    <ul className="absolute left-0 md:left-[35%] mt-3 md:mt-0 w-full bg-black border border-gray-600 rounded max-h-80 overflow-y-auto z-50 shadow-lg">
      {results.length > 0 ? (
        results.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
            onClick={() =>
              onNavigate(`/specification/${item.slug}?query=${encodeURIComponent(query)}`)
            }
          >
            <div className="text-sm uppercase text-gray-500">Specification</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-400">{t("navigation.searchNoResults")}</li>
      )}
    </ul>
  );
}
