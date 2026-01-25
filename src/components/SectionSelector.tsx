import { useState, useRef, useEffect } from 'react'
import type { ClosetItem, FilterSelection } from '../types'
import './SectionSelector.css'

interface SectionSelectorProps {
  sections: string[]
  collections: string[]
  selectedFilter: FilterSelection
  onSelectFilter: (filter: FilterSelection) => void
  allItems: ClosetItem[]
}

function getFilterLabel(filter: FilterSelection): string {
  if (filter.type === 'all') return 'All Equipment'
  if (filter.type === 'collection') {
    // Strip leading * from featured collections for display
    return filter.value.startsWith('*') ? filter.value.slice(1) : filter.value
  }
  return filter.value
}

function isFilterEqual(a: FilterSelection, b: FilterSelection): boolean {
  if (a.type !== b.type) return false
  if (a.type === 'all') return true
  return (a as { value: string }).value === (b as { value: string }).value
}

export function SectionSelector({ 
  sections, 
  collections,
  selectedFilter, 
  onSelectFilter, 
  allItems 
}: SectionSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (filter: FilterSelection) => {
    onSelectFilter(filter)
    setDropdownOpen(false)
  }

  // Sort collections: featured (*-prefixed) first, then alphabetical
  const sortedCollections = [...collections].sort((a, b) => {
    const aFeatured = a.startsWith('*')
    const bFeatured = b.startsWith('*')
    if (aFeatured && !bFeatured) return -1
    if (!aFeatured && bFeatured) return 1
    return a.localeCompare(b)
  })

  const getCollectionCount = (collection: string) => 
    allItems.filter(i => i.collections.includes(collection)).length

  const getSectionCount = (section: string) => 
    allItems.filter(i => i.section === section).length

  const displayLabel = getFilterLabel(selectedFilter)
  const isFiltered = selectedFilter.type !== 'all'

  return (
    <div className="section-selector" ref={dropdownRef}>
      <button 
        className={`section-selector-trigger ${isFiltered ? 'section-selector-trigger--active' : ''}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-label={`Filter: ${displayLabel}`}
      >
        <svg 
          className="section-selector-filter-icon"
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none"
          aria-hidden="true"
        >
          <path 
            d="M3 4.5h18M6 9.5h12M9 14.5h6M11 19.5h2" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        <span className="section-selector-label">
          {displayLabel}
        </span>
        <svg 
          className={`section-selector-arrow ${dropdownOpen ? 'section-selector-arrow--open' : ''}`}
          width="18" 
          height="18" 
          viewBox="0 0 12 12" 
          fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {dropdownOpen && (
        <div className="section-dropdown">
          <button
            className={`section-option ${selectedFilter.type === 'all' ? 'section-option--active' : ''}`}
            onClick={() => handleSelect({ type: 'all' })}
          >
            <span className="section-option-name">All Equipment</span>
            <span className="section-option-count">{allItems.length}</span>
          </button>
          
          {sortedCollections.length > 0 && (
            <>
              <div className="section-dropdown-divider" />
              <div className="section-group-label">Collections</div>
              {sortedCollections.map(collection => {
                const count = getCollectionCount(collection)
                const isFeatured = collection.startsWith('*')
                const displayName = isFeatured ? collection.slice(1) : collection
                const filter: FilterSelection = { type: 'collection', value: collection }
                const isActive = isFilterEqual(selectedFilter, filter)
                return (
                  <button
                    key={collection}
                    className={`section-option ${isActive ? 'section-option--active' : ''}`}
                    onClick={() => handleSelect(filter)}
                  >
                    <span className="section-option-name">{displayName}</span>
                    <span className="section-option-count">{count}</span>
                  </button>
                )
              })}
            </>
          )}
          
          <div className="section-dropdown-divider" />
          <div className="section-group-label">Sections</div>
          {sections.map(section => {
            const count = getSectionCount(section)
            const filter: FilterSelection = { type: 'section', value: section }
            const isActive = isFilterEqual(selectedFilter, filter)
            return (
              <button
                key={section}
                className={`section-option ${isActive ? 'section-option--active' : ''}`}
                onClick={() => handleSelect(filter)}
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
