import { useRef } from 'react'
import './ClosetHeader.css'
import headingImgLeft from '../assets/heading-img-left.png'
import headingImgRight from '../assets/heading-img-right.png'
import headingBackground from '../assets/heading-bg.webp'
import { ScrollIndicator } from './ScrollIndicator'

type ClosetHeaderProps = {
  clientName: string | null
}

export function ClosetHeader({ clientName }: ClosetHeaderProps) {
  const infoRef = useRef<HTMLDivElement | null>(null)

  return (
    <header className="closet-header">
      <div className="closet-header__banner">
        <img 
          src={headingBackground} 
          alt="Fantasy closet banner" 
          className="closet-header__banner-image"
        />
        <h1 className="closet-header__banner-title">{clientName ? `${clientName}'s ` : ''}<span className="font-alt-char">F</span>antasy <span className="font-alt-char">C</span>loset</h1>
        <ScrollIndicator targetRef={infoRef} />
      </div>

      <div className="closet-header__info" ref={infoRef}>
        <div className="closet-header__hero">
          <div className="closet-header__image-left">
            <img 
              src={headingImgLeft} 
              alt="Fantasy closet showcase" 
            />
          </div>
          
          <div className="closet-header__content">
            <h2 className="closet-header__subtitle">Create Your Character</h2>
            
            <div className="closet-header__text">
              <p>
                <strong>Welcome to the Fantasy Closet!</strong>
              </p>
              <p>
                The closet is ever-growing and we do our best to keep the inventory size inclusive and updated frequently. <a href="https://www.oliviaedvalson.com/contact#a">Measurements are available upon request.</a>
              </p>
              <p>
                Photographers / Stylists can rent equipment for pickup (Central MA) <a href="https://www.oliviaedvalson.com/contact#b">contact us for more information.</a>
              </p>
            </div>
          </div>
          
          <div className="closet-header__image-right">
            <img 
              src={headingImgRight}
              alt="Fantasy closet showcase" 
            />
          </div>
        </div>
      </div>
    </header>
  )
}

