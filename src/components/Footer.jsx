// ===========================
// components/Footer.jsx
// ===========================

import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-credits">
        Made by{' '}
        <span className="footer-name">Pratham</span>
        {' '}with{' '}
        <span className="footer-heart">♥</span>
      </div>
      <div className="footer-shortcuts">
        <span><kbd>Tab</kbd> + <kbd>Enter</kbd> restart</span>
        <span><kbd>Esc</kbd> reset</span>
      </div>
    </footer>
  )
}
