import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = '선택',
  onChange,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption;

  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative min-w-0" ref={dropdownRef}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-2.5 h-10 border-none rounded-xl bg-indigo-500 text-white text-base cursor-pointer shadow-sm overflow-hidden"
        onClick={handleToggle}
      >
        <span className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-left ${isPlaceholder ? 'italic opacity-80' : ''}`}>
          {displayText}
        </span>
        <span className={`text-xs ml-2 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] max-h-[220px] overflow-y-auto z-20">
          {searchable && (
            <input
              ref={searchInputRef}
              type="text"
              className="w-full px-2 py-1.5 my-1 border border-gray-300 rounded-lg text-sm"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <div
            className="px-3 py-2 text-base cursor-pointer whitespace-nowrap text-gray-500 italic hover:bg-gray-100"
            onClick={() => handleSelect('')}
          >
            {placeholder}
          </div>
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-base cursor-pointer whitespace-nowrap text-gray-800 hover:bg-gray-100"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
