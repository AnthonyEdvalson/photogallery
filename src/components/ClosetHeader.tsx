import './ClosetHeader.css'
import headingImgLeft from '../assets/heading-img-left.webp'
import headingImgRight from '../assets/heading-img-right.webp'
import headingBackground from '../assets/heading-bg.webp'

type ClosetHeaderProps = {
  clientName: string | null
}

export function ClosetHeader({ clientName }: ClosetHeaderProps) {
  return (
    <header className="closet-header">
      {/* SVG clip path for arch-shaped images (2:3 aspect ratio) */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
            {/* 
              For 2:3 aspect ratio: semicircle top takes 1/3 of height
              Path: bottom-left → up left side → arc across top → down right side → close
            */}
            <path d="M 0 1 L 0 0.333 A 0.5 0.333 0 0 1 1 0.333 L 1 1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="closet-header__banner">
        <img 
          src={headingBackground} 
          alt="Fantasy closet banner" 
          className="closet-header__banner-image"
        />
        <h1 className="closet-header__banner-title">{clientName ? `${clientName}'s ` : ''}Fantasy Closet</h1>
      </div>

      <div className="closet-header__info">
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
                We believe that fantasy should be accessible to everyone. The closet is ever-growing 
                and we do our best to keep the inventory size inclusive and updated frequently.
              </p>
              <p>
                <a href="https://www.oliviaedvalson.com/contact#a">Measurements are available upon request.</a>
              </p>
              <p>
                Photographers / Stylists can rent any equipment for pickup (Boston Area). <a href="https://www.oliviaedvalson.com/contact#b">Inquire for rates.</a>
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

