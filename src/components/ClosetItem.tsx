import { useState, useEffect, useRef, useCallback } from 'react'
import type { ClosetItem as ClosetItemType } from '../types'
import { AddToListButton } from './AddToListButton'
import './ClosetItem.css'

interface ClosetItemProps {
  item: ClosetItemType
  inCart: boolean
  onToggleCart: (itemId: string) => void
  onOpenDetail: (item: ClosetItemType) => void
  isCartEnabled: boolean
}

export function ClosetItem({ item, inCart, onToggleCart, onOpenDetail, isCartEnabled }: ClosetItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [autoCycleEnabled, setAutoCycleEnabled] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const hasMultipleImages = item.images.length > 1

  // Fade in when card enters viewport
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
  }, [item.images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)
  }, [item.images.length])

  // Auto-cycle on hover
  useEffect(() => {
    if (isHovering && autoCycleEnabled && hasMultipleImages) {
      intervalRef.current = window.setInterval(() => {
        nextImage()
      }, 1500)
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isHovering, autoCycleEnabled, hasMultipleImages, nextImage])

  // Reset state when mouse leaves
  const handleMouseLeave = () => {
    setIsHovering(false)
    setAutoCycleEnabled(true)
    setCurrentImageIndex(0)
  }

  const handleNavClick = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation()
    setAutoCycleEnabled(false)
    if (direction === 'prev') {
      prevImage()
    } else {
      nextImage()
    }
  }

  const handleCardClick = () => {
    onOpenDetail(item)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCart(item.id)
  }

  return (
    <div
      ref={cardRef}
      className={`item-card ${isVisible ? 'visible' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="item-image-container">
        <img
          src={item.images[currentImageIndex]}
          alt={item.name}
          className="item-image"
        />
        
        {hasMultipleImages && (
          <>
            <button
              className={`image-nav-button image-nav-prev ${isHovering ? 'visible' : ''}`}
              onClick={(e) => handleNavClick(e, 'prev')}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className={`image-nav-button image-nav-next ${isHovering ? 'visible' : ''}`}
              onClick={(e) => handleNavClick(e, 'next')}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>
      
      <h4 className="item-title">
        {item.name}
        {item.size && <span className="item-size-text"> ({item.size})</span>}
      </h4>
      {item.featured && (
        <span className="item-featured-badge">★ Featured</span>
      )}
      <p className="item-section-text">{item.section}</p>
      <div className="item-card-spacer" />
      {isCartEnabled && (
        <AddToListButton
          inCart={inCart}
          onToggle={handleButtonClick}
        />
      )}
    </div>
  )
}
