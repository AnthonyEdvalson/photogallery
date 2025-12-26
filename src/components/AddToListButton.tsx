import './AddToListButton.css'

interface AddToListButtonProps {
  inCart: boolean
  onToggle: (e: React.MouseEvent) => void
  size?: 'default' | 'large'
}

export function AddToListButton({ inCart, onToggle, size = 'default' }: AddToListButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`add-to-list-button add-to-list-button--${size} ${inCart ? 'add-to-list-button--in-cart' : ''}`}
    >
      {inCart ? '✓ In List - Remove' : 'Add to List'}
    </button>
  )
}

