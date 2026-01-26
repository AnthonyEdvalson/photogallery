import { useEffect } from 'react'
import type { ClosetItem } from '../types'
import { AddToListButton } from './AddToListButton'
import './ItemDetailModal.css'

interface ItemDetailModalProps {
  item: ClosetItem
  inCart: boolean
  onToggleCart: (itemId: string) => void
  onClose: () => void
  isCartEnabled: boolean
}

export function ItemDetailModal({ item, inCart, onToggleCart, onClose, isCartEnabled }: ItemDetailModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const tags = item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="item-detail-overlay" onClick={handleBackdropClick}>
      <div className="item-detail-modal">
        <button className="item-detail-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="item-detail-layout">
          <div className={`item-detail-images ${item.images.length === 1 ? 'item-detail-images--single' : ''}`}>
            {item.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${item.name} - Image ${idx + 1}`}
                className="item-detail-image"
              />
            ))}
          </div>

          <div className="item-detail-info">
            <div className="item-detail-info-sticky">
              <h2 className="item-detail-title">{item.name}</h2>
              {tags.length > 0 && (
                <div className="item-detail-tags-section">
                  <h3 className="item-detail-label">Tags</h3>
                  <div className="item-detail-tags">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="item-detail-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="item-detail-meta">
                <div className="item-detail-meta-row">
                  <span className="item-detail-meta-label">Section</span>
                  <span className="item-detail-meta-value">{item.section}</span>
                </div>
                {item.size && <div className="item-detail-meta-row">
                  <span className="item-detail-meta-label">Size</span>
                  <span className="item-detail-meta-value">{item.size}</span>
                </div>}
                {item.tags && <div className="item-detail-meta-row">
                  <span className="item-detail-meta-label">Tags</span>
                  <span className="item-detail-meta-value">{item.tags}</span>
                </div>}
                {item.note && <div className="item-detail-meta-row">
                  <span className="item-detail-meta-label">Note</span>
                  <span className="item-detail-meta-value">{item.note}</span>
                </div>}
              </div>

              <div className="item-detail-actions">
                {isCartEnabled && (
                  <AddToListButton
                    inCart={inCart}
                    onToggle={(_e) => onToggleCart(item.id)}
                    size="large"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
