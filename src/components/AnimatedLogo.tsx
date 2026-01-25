import { useEffect, useRef } from 'react'
import './AnimatedLogo.css'
import logoSvg from '../assets/Animateable Seal.svg?raw'

export function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const parser = new DOMParser()
    const doc = parser.parseFromString(logoSvg, 'image/svg+xml')
    const svg = doc.querySelector('svg')
    if (!svg) return

    svg.setAttribute('viewBox', '0 0 1835 1835')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.classList.add('animated-logo-svg')

    const paths = svg.querySelectorAll('path')
    
    const n = paths.length-1;
    const animatedIndices = [n - 0, n - 1, n - 2, n - 3, n - 4]
    
    paths.forEach((path, index) => {
      path.removeAttribute('fill')
      if (!animatedIndices.includes(index)) {
        path.classList.add('logo-border-path')
      }
    })

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(svg)

    const animatedPaths = animatedIndices.map(i => paths[i]).filter(Boolean)
    
    const drawSpeed = 2000
    const pathData = animatedPaths.map((path, index) => {
      const length = path.getTotalLength()
      const duration = length / drawSpeed
      const delay = index * 0.5
      return { path, length, duration, delay }
    })
    
    const maxDrawEnd = Math.max(...pathData.map(d => d.delay + d.duration))
    const fillDelay = maxDrawEnd + 0.3

    pathData.forEach(({ path, length, duration, delay }) => {
      path.style.setProperty('--path-length', `${length}`)
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      path.style.setProperty('--draw-duration', `${duration}s`)
      path.style.setProperty('--draw-delay', `${delay}s`)
      path.style.setProperty('--fill-delay', `${fillDelay}s`)
      path.classList.add('logo-animated-base')
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        pathData.forEach(({ path }) => {
          if (entry.isIntersecting) {
            path.classList.add('animated-logo-path')
          } else {
            path.classList.remove('animated-logo-path')
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="animated-logo-container"
    />
  )
}
