// ===========================
// components/HistoryModal.jsx
// Past tests & personal bests
// ===========================

import React, { useState } from 'react'
import { getHistory, clearHistory, getPersonalBests } from '../utils/analytics'
import './HistoryModal.css'

export default function HistoryModal({ onClose }) {
  const [history, setHistory] = useState(() => getHistory())
  const bests = getPersonalBests(history)

  const handleClear = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fade-in">
        <div className="modal-header">
          <h2 className="modal-title">history</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Personal bests */}
        <div className="pb-row">
          <PBCard label="best wpm"    value={bests.bestWPM}      color="cyan"   />
          <PBCard label="best acc"    value={`${bests.bestAccuracy}%`} color="purple" />
          <PBCard label="avg wpm"     value={bests.avgWPM}       color="yellow" />
          <PBCard label="total tests" value={bests.totalTests}   color="pink"   />
        </div>

        {/* History table */}
        {history.length === 0 ? (
          <div className="history-empty">
            <span>no tests yet — start typing!</span>
          </div>
        ) : (
          <div className="history-list">
            <div className="history-list-header">
              <span>wpm</span>
              <span>raw</span>
              <span>acc</span>
              <span>cons</span>
              <span>err</span>
              <span>mode</span>
              <span>date</span>
            </div>
            {history.map((h, i) => (
              <div key={h.id} className="history-row">
                <span className="hr-wpm">{h.wpm}</span>
                <span className="hr-raw">{h.rawWpm}</span>
                <span className="hr-acc">{h.accuracy}%</span>
                <span className="hr-con">{h.consistency}%</span>
                <span className="hr-err">{h.errors}</span>
                <span className="hr-mode">{h.mode}</span>
                <span className="hr-date">{new Date(h.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            clear history
          </button>
        )}
      </div>
    </div>
  )
}

function PBCard({ label, value, color }) {
  return (
    <div className={`pb-card pb-card--${color}`}>
      <div className="pb-card__value">{value}</div>
      <div className="pb-card__label">{label}</div>
    </div>
  )
}
