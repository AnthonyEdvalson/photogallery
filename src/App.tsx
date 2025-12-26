import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAirtable } from './hooks/useAirtable'
import { ClosetHeader } from './components/ClosetHeader'
import { ClosetGrid } from './components/ClosetGrid'
import { Cart, CartToggleButton } from './components/Cart'
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
  const { items, sections, loading, loadingMore, error } = useAirtable();
  const [selectedSection, setSelectedSection] = useState<string>('All')
  const [cart, setCart] = useState<Set<string>>(() => loadCartFromStorage())
  const [searchQuery, setSearchQuery] = useState<string>('')
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

  function toggleCart(itemId: string) {
    setCart(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  function removeFromCart(itemId: string) {
    setCart(prev => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const filteredItems = items.filter(item => {
    const matchesSection = selectedSection === 'All' || item.section === selectedSection
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = query === '' || 
      item.name.toLowerCase().includes(query) ||
      (item.tags && item.tags.toLowerCase().includes(query))
    return matchesSection && matchesSearch
  })

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
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        cart={cart}
        onToggleCart={toggleCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedItem={selectedItem}
        onOpenItem={handleOpenItem}
        onCloseItem={handleCloseItem}
        loadingMore={loadingMore}
        isCartEnabled={isCartEnabled}
      />

      {isCartEnabled && (
        <CartToggleButton 
          itemCount={cartItems.length} 
          onClick={() => setIsCartOpen(true)} 
        />
      )}

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
