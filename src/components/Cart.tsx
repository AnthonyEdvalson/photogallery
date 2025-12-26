import type { ClosetItem } from '../types'
import './Cart.css'

interface CartItemProps {
  item: ClosetItem
  onRemove: (itemId: string) => void
}

function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <li className="cart-item">
      {item.images.length > 0 && (
        <img
          src={item.images[0]}
          alt={item.name}
          className="cart-item-image"
        />
      )}
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-section">{item.section}</div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="cart-remove-button"
        aria-label={`Remove ${item.name}`}
      >
        Remove
      </button>
    </li>
  )
}

interface CartProps {
  items: ClosetItem[]
  onRemoveItem: (itemId: string) => void
  isOpen: boolean
  onClose: () => void
  clientName: string
}

export function Cart({ items, onRemoveItem, isOpen, onClose, clientName }: CartProps) {
  const handleSendEmail = () => {
    const itemNames = items.map(item => `• ${item.name} (${item.section})`).join('\n')
    const emailBody = `Hi,\n\nMy name is ${clientName}. I would like to request the following items for my upcoming shoot:\n\n${itemNames}\n\nPlease let me know availability and next steps.\n\nThank you!`
    const mailtoLink = `mailto:stylist@example.com?subject=Clothing Pull Request - ${clientName}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink
  }

  if (!isOpen) return null

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="cart-content">
          <div className="cart-items-panel">
            <h2>Your Selection</h2>
            
            {items.length === 0 ? (
              <p className="cart-empty-text">No equipment selected yet.</p>
            ) : (
              <ul className="cart-list">
                {items.map(item => (
                  <CartItem key={item.id} item={item} onRemove={onRemoveItem} />
                ))}
              </ul>
            )}
          </div>

          <div className="cart-info-panel">
            <div className="cart-info-content">
              <h2>Ready to Submit?</h2>
              
              <div className="cart-info-section">
                <h3>What happens next</h3>
                <p>
                  Once you've finalized your selection, our styling team will receive your 
                  request and begin preparing your equipment. We'll coordinate with the production 
                  team to ensure everything is ready for your shoot date.
                </p>
              </div>

              <div className="cart-info-section">
                <h3>Before the shoot</h3>
                <p>
                  A member of our wardrobe department will reach out within 24-48 hours to 
                  confirm availability and discuss any sizing requirements. We'll arrange 
                  delivery or pickup based on your production schedule.
                </p>
              </div>

              <div className="cart-info-section">
                <h3>Day of shoot</h3>
                <p>
                  All selected pieces will be steamed, pressed, and organized by look. 
                  Our team can provide on-set support if needed. Please return all equipment 
                  within 48 hours of wrap, or additional fees may apply.
                </p>
              </div>

              <div className="cart-info-section">
                <h3>Questions?</h3>
                <p>
                  Contact our styling coordinator at stylist@example.com or 
                  call the wardrobe department directly for urgent requests.
                </p>
              </div>
            </div>

            <div className="cart-submit-section">
              <button 
                className="cart-submit-button"
                onClick={handleSendEmail}
                disabled={items.length === 0}
              >
                Send Request via Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CartToggleButtonProps {
  itemCount: number
  onClick: () => void
}

export function CartToggleButton({ itemCount, onClick }: CartToggleButtonProps) {
  return (
    <button className="cart-toggle-button" onClick={onClick} aria-label="Open cart">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span className="cart-toggle-badge">{itemCount}</span>
      )}
    </button>
  )
}
