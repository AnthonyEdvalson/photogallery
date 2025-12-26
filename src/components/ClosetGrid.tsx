import type { ClosetItem as ClosetItemType } from '../types'
import { ClosetItem } from './ClosetItem'
import { ItemDetailModal } from './ItemDetailModal'
import { SectionSelector } from './SectionSelector'
import './ClosetGrid.css'

interface ClosetGridProps {
  items: ClosetItemType[]
  allItems: ClosetItemType[]
  sections: string[]
  selectedSection: string
  onSelectSection: (section: string) => void
  cart: Set<string>
  onToggleCart: (itemId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedItem: ClosetItemType | null
  onOpenItem: (uid: number) => void
  onCloseItem: () => void
  loadingMore: boolean
  isCartEnabled: boolean
}

export function ClosetGrid({ 
  items, 
  allItems,
  sections,
  selectedSection, 
  onSelectSection,
  cart, 
  onToggleCart, 
  searchQuery, 
  selectedItem,
  onSearchChange,
  onOpenItem,
  onCloseItem,
  isCartEnabled,
  loadingMore,
}: ClosetGridProps) {
  const handleOpenDetail = (item: ClosetItemType) => {
    onOpenItem(item.uid)
  }

  // Check if we're in a filtered state (search or specific section)
  const isFiltered = searchQuery.trim() !== '' || selectedSection !== 'All'
  
  // Get featured items for the dedicated featured section
  const featuredItems = !isFiltered ? items.filter(item => item.featured) : []
  
  // Sort items to put featured first, then sort by original order
  const sortWithFeaturedFirst = (itemsToSort: ClosetItemType[]) => {
    return [...itemsToSort].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }

  // Group items by section when showing all
  const groupedItems = selectedSection === 'All' 
    ? (() => {
        const groups: { section: string; items: ClosetItemType[] }[] = []
        
        // Add featured section at the start if not filtered and there are featured items
        if (!isFiltered && featuredItems.length > 0) {
          groups.push({ section: 'Featured', items: featuredItems })
        }
        
        // Add regular sections with featured items sorted first
        sections.forEach(section => {
          const sectionItems = items.filter(item => item.section === section)
          if (sectionItems.length > 0) {
            groups.push({ section, items: sortWithFeaturedFirst(sectionItems) })
          }
        })
        
        return groups
      })()
    : null

  return (
    <div className="items-container">
      <div className="grid-header">
        <div className="header-top">
          <SectionSelector
            sections={sections}
            selectedSection={selectedSection}
            onSelectSection={onSelectSection}
            allItems={allItems}
          />

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear" 
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      
      {groupedItems ? (
        <div className="grouped-items">
          {groupedItems.map(({ section, items: sectionItems }) => (
            <div key={section} className="section-group">
              <h3 className="section-group-header">{section}</h3>
              <div className="items-grid">
                {sectionItems.map(item => (
                  <ClosetItem
                    key={item.id}
                    item={item}
                    inCart={cart.has(item.id)}
                    onToggleCart={onToggleCart}
                    onOpenDetail={handleOpenDetail}
                    isCartEnabled={isCartEnabled}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="items-grid">
          {sortWithFeaturedFirst(items).map(item => (
            <ClosetItem
              key={item.id}
              item={item}
              inCart={cart.has(item.id)}
              onToggleCart={onToggleCart}
              onOpenDetail={handleOpenDetail}
              isCartEnabled={isCartEnabled}
            />
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="loading-more">
          <span className="loading-more-spinner" />
          Loading...
        </div>
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          inCart={cart.has(selectedItem.id)}
          onToggleCart={onToggleCart}
          onClose={onCloseItem}
          isCartEnabled={isCartEnabled}
        />
      )}
    </div>
  )
}
