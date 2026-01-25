import { useCallback } from 'react'
import type { ClosetItem as ClosetItemType, FilterSelection } from '../types'
import { CartButton } from './CartButton'
import { ClosetItem } from './ClosetItem'
import { EmptyState } from './EmptyState'
import { ItemDetailModal } from './ItemDetailModal'
import { SearchInput } from './SearchInput'
import { SectionSelector } from './SectionSelector'
import './ClosetGrid.css'

interface ClosetGridProps {
  items: ClosetItemType[]
  allItems: ClosetItemType[]
  sections: string[]
  collections: string[]
  selectedFilter: FilterSelection
  onSelectFilter: (filter: FilterSelection) => void
  cart: Set<string>
  onToggleCart: (itemId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedItem: ClosetItemType | null
  onOpenItem: (uid: number) => void
  onCloseItem: () => void
  loadingMore: boolean
  isCartEnabled: boolean
  cartItemCount: number
  onOpenCart: () => void
}

export function ClosetGrid({ 
  items, 
  allItems,
  sections,
  collections,
  selectedFilter, 
  onSelectFilter,
  cart, 
  onToggleCart, 
  searchQuery, 
  selectedItem,
  onSearchChange,
  onOpenItem,
  onCloseItem,
  isCartEnabled,
  loadingMore,
  cartItemCount,
  onOpenCart,
}: ClosetGridProps) {
  const handleOpenDetail = useCallback((item: ClosetItemType) => {
    onOpenItem(item.uid)
  }, [onOpenItem])

  // Check if we're in a filtered state (search or specific filter)
  const isFiltered = searchQuery.trim() !== '' || selectedFilter.type !== 'all'
  
  // Get featured collections (those starting with *)
  const featuredCollections = collections.filter(c => c.startsWith('*'))

  // Build grouped items for the "All" view
  const groupedItems = selectedFilter.type === 'all' && !isFiltered
    ? (() => {
        const groups: { header: string; items: ClosetItemType[]; key: string; featured: boolean }[] = []
        
        // Add featured collection sections at the top
        featuredCollections.forEach(collection => {
          const collectionItems = items.filter(item => item.collections.includes(collection))
          if (collectionItems.length > 0) {
            // Strip the * prefix for display
            const displayName = collection.slice(1)
            groups.push({ header: displayName, items: collectionItems, key: `collection-${collection}`, featured: true })
          }
        })
        
        // Add regular sections
        sections.forEach(section => {
          const sectionItems = items.filter(item => item.section === section)
          if (sectionItems.length > 0) {
            groups.push({ header: section, items: sectionItems, key: `section-${section}`, featured: false })
          }
        })
        
        return groups
      })()
    : null

  return (
    <div className="items-container">
      <div className="grid-header">
        <div className="header-top">
          <div className="filter-search-group">
            <SectionSelector
              sections={sections}
              collections={collections}
              selectedFilter={selectedFilter}
              onSelectFilter={onSelectFilter}
              allItems={allItems}
            />
            <SearchInput value={searchQuery} onChange={onSearchChange} />
          </div>

          {isCartEnabled && (
            <CartButton itemCount={cartItemCount} onClick={onOpenCart} />
          )}
        </div>
      </div>
      
      {items.length === 0 && isFiltered ? (
        <EmptyState searchQuery={searchQuery} selectedFilter={selectedFilter} />
      ) : groupedItems ? (
        <div className="grouped-items">
          {groupedItems.map(({ header, items: groupItems, key, featured }) => (
            <div key={key} className={`section-group ${featured ? 'section-group--featured' : ''}`}>
              <h3 className="section-group-header">{header}</h3>
              <div className="items-grid">
                {groupItems.map(item => (
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
          {items.map(item => (
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
