import { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react'
import Fuse from 'fuse.js'
import { useAirtable } from './hooks/useAirtable'
import { ClosetHeader } from './components/ClosetHeader'
import { ClosetGrid } from './components/ClosetGrid'
import { Cart } from './components/Cart'
import { Footer } from './components/Footer'
import type { FilterSelection } from './types'
import './App.css'

const CART_STORAGE_KEY = 'photogallery-cart'

// Get client name from URL query parameter
function getClientNameFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('name')
}

// Parse item UID from URL hash (e.g., #item=42)
function getItemUidFromHash(): number | null {
  const hash = window.location.hash
  if (!hash) return null
  const match = hash.match(/^#item=(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

// Update URL hash with item UID
function setItemUidInHash(uid: number | null): void {
  if (uid !== null) {
    window.history.pushState(null, '', `#item=${uid}`)
  } else {
    // Clear hash without adding history entry for close action
    window.history.pushState(null, '', window.location.pathname + window.location.search)
  }
}

function loadCartFromStorage(): Set<string> {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return new Set(parsed)
      }
    }
  } catch (e) {
    console.warn('Failed to load cart from localStorage:', e)
  }
  return new Set()
}

function App() {
  const { items, sections, collections, loading, loadingMore, error } = useAirtable();
  const [selectedFilter, setSelectedFilter] = useState<FilterSelection>({ type: 'all' })
  const [cart, setCart] = useState<Set<string>>(() => loadCartFromStorage())
  const [searchQuery, setSearchQuery] = useState<string>('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedItemUid, setSelectedItemUid] = useState<number | null>(() => getItemUidFromHash())
  
  // Get client name from URL - enables cart functionality when present
  const clientName = useMemo(() => getClientNameFromUrl(), [])
  const isCartEnabled = clientName !== null

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...cart]))
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e)
    }
  }, [cart]);

  useEffect(() => {
    console.log(`       _________
     _/,.\`-;\`,\`”\\_
   _/”,_________.\`\\_  
  /\`.\`/  . * .  \\.”,\\ 
 /,'./ *\` wOw \`* \\\`.-\\
[====]           [====]
 |  |  __ [_] __  |  |
 \\  | /._>   <_,\\ |  /
 |\\ |/           \\| /|
 | \\||/--v. ;v--\\||/ |
 \\  || \`-'   \`-' ||  /
 |\\ ||_,  <O>  ,_|| /|
 | \\| /”       “\\ |/ |
 |  ||           ||  |
/____\\\\         //____\\
[____] \\_______/ [____]

Speak friend and enter.`);
    (window as any).mellon = "Yay! You solved the riddle :) You're now in the cool club.";
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      setSelectedItemUid(getItemUidFromHash())
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Open item detail (updates URL)
  const handleOpenItem = useCallback((uid: number) => {
    setSelectedItemUid(uid)
    setItemUidInHash(uid)
  }, [])

  // Close item detail (updates URL)
  const handleCloseItem = useCallback(() => {
    setSelectedItemUid(null)
    setItemUidInHash(null)
  }, [])

  const toggleCart = useCallback((itemId: string) => {
    setCart(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }, [])

  function removeFromCart(itemId: string) {
    setCart(prev => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['name', 'tags', 'section', 'collections'],
    threshold: 0.9,
    ignoreLocation: true,
  }), [items])

  const filteredItems = useMemo(() => {
    const query = deferredSearchQuery.trim()
    
    // Get search results (or all items if no query)
    let results = query ? fuse.search(query).map(r => r.item) : items
    
    // Apply filter
    if (selectedFilter.type === 'section') {
      results = results.filter(item => item.section === selectedFilter.value)
    } else if (selectedFilter.type === 'collection') {
      results = results.filter(item => item.collections.includes(selectedFilter.value))
    }
    
    // Easter egg: only show wapon for exact match
    if (query !== 'WAPON') {
      results = results.filter(item => item.id !== 'wapon-10000')
    }
    
    return results
  }, [items, fuse, selectedFilter, deferredSearchQuery])

  const cartItems = items.filter(item => cart.has(item.id))
  const selectedItem = selectedItemUid !== null ? items.find(item => item.uid === selectedItemUid) ?? null : null

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="app-container">
      <ClosetHeader clientName={clientName} />
      <ClosetGrid
        items={filteredItems}
        allItems={items}
        sections={sections}
        collections={collections}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        cart={cart}
        onToggleCart={toggleCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedItem={selectedItem}
        onOpenItem={handleOpenItem}
        onCloseItem={handleCloseItem}
        loadingMore={loadingMore}
        isCartEnabled={isCartEnabled}
        cartItemCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <Footer isClient={clientName !== null} />

      {isCartEnabled && (
        <Cart
          items={cartItems}
          onRemoveItem={removeFromCart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          clientName={clientName}
        />
      )}
    </div>
  )
}

export default App
