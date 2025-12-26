import { useState, useRef, useEffect } from 'react'
import type { ClosetItem } from '../types'
import './SectionSelector.css'

interface SectionSelectorProps {
  sections: string[]
  selectedSection: string
  onSelectSection: (section: string) => void
  allItems: ClosetItem[]
}

export function SectionSelector({ 
  sections, 
  selectedSection, 
  onSelectSection, 
  allItems 
}: SectionSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSection = (section: string) => {
    onSelectSection(section)
    setDropdownOpen(false)
  }

  return (
    <div className="section-selector" ref={dropdownRef}>
      <button 
        className="section-selector-trigger"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="section-selector-label">
          {selectedSection === 'All' ? 'All Equipment' : selectedSection}
        </span>
        <svg 
          className={`section-selector-arrow ${dropdownOpen ? 'section-selector-arrow--open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {dropdownOpen && (
        <div className="section-dropdown">
          <button
            className={`section-option ${selectedSection === 'All' ? 'section-option--active' : ''}`}
            onClick={() => handleSelectSection('All')}
          >
            <span className="section-option-name">All Equipment</span>
            <span className="section-option-count">{allItems.length}</span>
          </button>
          <div className="section-dropdown-divider" />
          {sections.map(section => {
            const count = allItems.filter(i => i.section === section).length
            return (
              <button
                key={section}
                className={`section-option ${selectedSection === section ? 'section-option--active' : ''}`}
                onClick={() => handleSelectSection(section)}
              >
                <span className="section-option-name">{section}</span>
                <span className="section-option-count">{count}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

