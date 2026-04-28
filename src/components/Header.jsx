// ===========================
// components/Header.jsx
// ===========================

import React from 'react'
import './Header.css'

export default function Header({ onHistoryClick }) {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-t">Type</span>
        <span className="logo-c">Craft</span>
        <div className="logo-cursor" />
      </div>

      <nav className="header-nav">
        <button className="nav-btn" onClick={onHistoryClick} title="View your history">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span>history</span>
        </button>
      </nav>
    </header>
  )
}
