'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  error?: boolean;
  className?: string;
  optionClassName?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const variantClasses = {
  default: 'bg-[var(--bg-primary)] border border-[var(--border-primary)]',
  outline: 'bg-transparent border border-[var(--border-primary)]',
  filled: 'bg-[var(--bg-secondary)] border border-transparent',
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  error = false,
  className = '',
  optionClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(option => option.value === value) || null
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const option = options.find(option => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = selectedOption 
            ? options.findIndex(opt => opt.value === selectedOption.value)
            : -1;
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          const nextOption = options[nextIndex];
          if (nextOption && !nextOption.disabled) {
            setSelectedOption(nextOption);
            onChange?.(nextOption.value);
          }
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = selectedOption 
            ? options.findIndex(opt => opt.value === selectedOption.value)
            : options.length;
          const prevIndex = Math.max(currentIndex - 1, 0);
          const prevOption = options[prevIndex];
          if (prevOption && !prevOption.disabled) {
            setSelectedOption(prevOption);
            onChange?.(prevOption.value);
          }
        }
        break;
    }
  };

  return (
    <div ref={selectRef} className="relative">
      <motion.div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center justify-between w-full rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]',
          sizeClasses[size],
          variantClasses[variant],
          error 
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30' 
            : 'hover:border-[var(--border-secondary)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <div className="flex-shrink-0">
              {selectedOption.icon}
            </div>
          )}
          <span className={cn(
            'truncate',
            selectedOption 
              ? 'text-[var(--text-primary)]' 
              : 'text-[var(--text-tertiary)]'
          )}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors',
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[var(--bg-tertiary)]',
                    selectedOption?.value === option.value && 'bg-[var(--color-primary-50)]',
                    optionClassName
                  )}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {option.icon && (
                      <div className="flex-shrink-0">
                        {option.icon}
                      </div>
                    )}
                    <span className={cn(
                      'truncate text-sm',
                      selectedOption?.value === option.value
                        ? 'text-[var(--color-primary-700)] font-medium'
                        : 'text-[var(--text-primary)]'
                    )}>
                      {option.label}
                    </span>
                  </div>
                  
                  {selectedOption?.value === option.value && (
                    <Check className="w-4 h-4 text-[var(--color-primary-600)] flex-shrink-0 ml-2" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Multi-select variant
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  values?: string[];
  onChange?: (values: string[]) => void;
  maxSelected?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  values = [],
  placeholder = 'Select options',
  onChange,
  maxSelected,
  disabled = false,
  size = 'md',
  variant = 'default',
  error = false,
  className = '',
  optionClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(
    options.filter(option => values.includes(option.value))
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const selected = options.filter(option => values.includes(option.value));
    setSelectedOptions(selected);
  }, [values, options]);

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    
    const isSelected = selectedOptions.some(selected => selected.value === option.value);
    let newSelected: SelectOption[];
    
    if (isSelected) {
      newSelected = selectedOptions.filter(selected => selected.value !== option.value);
    } else {
      if (maxSelected && selectedOptions.length >= maxSelected) {
        return; // Don't allow more selections
      }
      newSelected = [...selectedOptions, option];
    }
    
    setSelectedOptions(newSelected);
    onChange?.(newSelected.map(opt => opt.value));
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} selected`;
  };

  return (
    <div ref={selectRef} className="relative">
      <motion.div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center justify-between w-full rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]',
          sizeClasses[size],
          variantClasses[variant],
          error 
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30' 
            : 'hover:border-[var(--border-secondary)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <span className={cn(
          'truncate',
          selectedOptions.length > 0
            ? 'text-[var(--text-primary)]' 
            : 'text-[var(--text-tertiary)]'
        )}>
          {getDisplayText()}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => {
                const isSelected = selectedOptions.some(selected => selected.value === option.value);
                const canSelect = !maxSelected || selectedOptions.length < maxSelected || isSelected;
                
                return (
                  <motion.div
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors',
                      option.disabled || !canSelect
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[var(--bg-tertiary)]',
                      isSelected && 'bg-[var(--color-primary-50)]',
                      optionClassName
                    )}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {option.icon && (
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                      )}
                      <span className={cn(
                        'truncate text-sm',
                        isSelected
                          ? 'text-[var(--color-primary-700)] font-medium'
                          : 'text-[var(--text-primary)]'
                      )}>
                        {option.label}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--color-primary-600)] flex-shrink-0 ml-2" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};