import { useEffect, useRef, useState, type RefObject } from 'react'
import './ScrollIndicator.css'

type ScrollIndicatorProps = {
  targetRef: RefObject<HTMLElement | null>
}

export function ScrollIndicator({ targetRef }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const dismissTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  const dismissWithFade = () => {
    if (isDismissed || isFadingOut) return
    setIsFadingOut(true)
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current)
    }
    dismissTimerRef.current = window.setTimeout(() => {
      setIsDismissed(true)
    }, 600)
  }

  useEffect(() => {
    if (isDismissed || isFadingOut) return

    if (window.scrollY > 0) {
      dismissWithFade()
      return
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [isDismissed, isFadingOut])

  useEffect(() => {
    if (isDismissed || isFadingOut) return

    const handleScroll = () => {
      if (window.scrollY > 0) {
        dismissWithFade()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed, isFadingOut])

  const handleClick = () => {
    dismissWithFade()
    targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (isDismissed) return null

  return (
    <button
      type="button"
      className={`closet-header__scroll-indicator${isVisible ? ' is-visible' : ''}${isFadingOut ? ' is-fading-out' : ''}`}
      onClick={handleClick}
      aria-label="Scroll to header information"
    >
        <svg width="64" height="128" viewBox="0 0 64 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43 50.207L33 60.207V89.6338C34.4754 90.1573 35.5 91.3397 35.5 93C35.5 94.8288 34.9811 96.8882 34.4766 98.4648C34.2994 99.0185 34.1185 99.5168 33.9629 99.9326L44.2686 94.5566L45.792 93.7617L44.9326 95.25L31.9326 117.767L31.5 118.517L31.0674 117.767L18.0674 95.25L17.208 93.7617L18.7314 94.5566L29.0361 99.9326C28.8806 99.5168 28.7006 99.0184 28.5234 98.4648C28.0189 96.8882 27.5 94.8288 27.5 93C27.5 91.3397 28.5246 90.1573 30 89.6338V60.207L20 50.207V33.793L31 44.793V89.332C31.1405 89.3082 31.2973 89.293 31.4639 89.293C31.6545 89.293 31.8376 89.3146 32 89.3438V44.793L43 33.793V50.207ZM31.5 115.454L41.7031 98.0889L40 99L31.5 113.723L23 99L21.4551 98.0479L31.5 115.454ZM31.5 91C29.0001 91.0001 29 95.0001 31.5 99C34 95 34 91 31.5 91ZM21 49.793L30 58.793V55.207L21 46.207V49.793ZM33 55.207V58.793L42 49.793V46.207L33 55.207ZM21 44.793L30 53.793V50.207L21 41.207V44.793ZM33 50.207V53.793L42 44.793V41.207L33 50.207ZM21 39.793L30 48.793V45.207L21 36.207V39.793ZM33 45.207V48.793L42 39.793V36.207L33 45.207Z" fill="var(--accent)"/>
        </svg>

    </button>
  )
}

