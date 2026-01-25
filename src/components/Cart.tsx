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

const _a = 'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLw'
const _b = 'MUZBSXBRTFNlMjViODBndDNLZ2xpeFoyaUZZUm5uZlBVTHIzNDVHZTlseWFPbEoxOGRSc0NTNmc'
const _c = 'L3ZpZXdmb3JtP3VzcD1wcF91cmwmZW50cnkuMTg4MDgzODY0OD0'
const _d = 'JmVudHJ5LjE4OTk5ODM3Nj0'

export function Cart({ items, onRemoveItem, isOpen, onClose, clientName }: CartProps) {
  const handleSubmit = () => {
    const titleCaseName = clientName.replace(/\b\w/g, c => c.toUpperCase())
    const itemList = items.map(item => `- ${item.name} (${item.section})`).join('\n')
    const formUrl = atob(_a) + atob(_b) + atob(_c) + encodeURIComponent(titleCaseName) + atob(_d) + encodeURIComponent(itemList)
    window.open(formUrl, '_blank')
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
                  When you click the submit button, you'll be taken to a form pre-filled with your selections.
                  Submit the form, and we will review your
                  request / confirm that your items are available on the day of your shoot.
                  If there are any conflicts, we'll let you know and suggest items
                  of similar nature. Using your requested items and the styling questionnaire,
                  we will present you with a plan for your photoshoot!
                </p>
              </div>

              <div className="cart-info-section">
                <h3>Questions?</h3>
                <p>
                  We're here to help! Contact <a href="mailto:studio@oliviaedvalson.com" target="_blank">studio@oliviaedvalson.com</a> with any questions you might have. 
                </p>
              </div>
            </div>

            <div className="cart-submit-section">
              <button 
                className="cart-submit-button"
                onClick={handleSubmit}
                disabled={items.length === 0}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

