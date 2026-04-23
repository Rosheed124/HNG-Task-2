import React, { useState, useRef, useEffect } from 'react';
import { InvoiceStatus } from '../../types';
import { ChevronDown } from 'lucide-react';

interface FilterProps {
  selectedFilters: InvoiceStatus[];
  onFilterChange: (filters: InvoiceStatus[]) => void;
}

const Filter: React.FC<FilterProps> = ({ selectedFilters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses: InvoiceStatus[] = ['draft', 'pending', 'paid'];

  const toggleFilter = (status: InvoiceStatus) => {
    if (selectedFilters.includes(status)) {
      onFilterChange(selectedFilters.filter(s => s !== status));
    } else {
      onFilterChange([...selectedFilters, status]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filter-container" ref={dropdownRef}>
      <button className="filter-btn" onClick={() => setIsOpen(!isOpen)}>
        Filter <span className="hide-mobile">by status</span>
        <ChevronDown size={14} style={{ color: '#7C5DFA', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          {statuses.map(status => (
            <label key={status} className="filter-label">
              <div className={`checkbox ${selectedFilters.includes(status) ? 'checked' : ''}`}>
                {selectedFilters.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4.5L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                checked={selectedFilters.includes(status)} 
                onChange={() => toggleFilter(status)}
                style={{ display: 'none' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{status}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
