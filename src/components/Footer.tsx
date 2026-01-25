import './Footer.css'
import { AnimatedLogo } from './AnimatedLogo'
import footerBg from '../assets/footer.webp'

type FooterProps = {
  isClient: boolean
}

export function Footer({ isClient }: FooterProps) {
  return (
    <footer className="footer">
      {!isClient && (
        <section className="footer-cta">
          <img src={footerBg} alt="" className="footer-cta__bg" />
          <div className="footer-cta__content">
            <h2 className="footer-cta__heading">
              <span className="font-alt-char-ss03">R</span>eady to <span className="font-alt-char-ss03">B</span>ook? <span className="font-alt-char-ss03">H</span>uzzah!
            </h2>
            <p className="footer-cta__subtext">↓ Contact us to get started ↓</p>
            <a href="https://www.oliviaedvalson.com/contact" className="footer-cta__button">
              Inquire
            </a>
          </div>
        </section>
      )}
      <div className="footer__logo">
        <AnimatedLogo />
      </div>
      <div className="footer__sub">
        <span>Site by Tony Edvalson</span>
        <span>© {new Date().getFullYear()} Olivia Edvalson</span>
      </div>
    </footer>
  )
}

