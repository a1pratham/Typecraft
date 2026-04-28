// ===========================
// components/LiveStats.jsx
// WPM + time display during test
// ===========================

import React from 'react'
import { formatTime } from '../utils/analytics'
import './LiveStats.css'

export default function LiveStats({ wpm, accuracy, timeLeft, elapsed, phase, timed }) {
  if (phase === 'idle') return null

  return (
    <div className="live-stats">
      <div className="live-stat live-stat--wpm">
        <span className="live-stat__value">{wpm}</span>
        <span className="live-stat__label">wpm</span>
      </div>

      {timed ? (
        <div className={`live-stat live-stat--time ${timeLeft <= 5 ? 'live-stat--danger' : ''}`}>
          <span className="live-stat__value">{timeLeft}</span>
          <span className="live-stat__label">sec</span>
        </div>
      ) : (
        <div className="live-stat live-stat--time">
          <span className="live-stat__value">{formatTime(elapsed)}</span>
          <span className="live-stat__label">elapsed</span>
        </div>
      )}

      <div className="live-stat live-stat--acc">
        <span className="live-stat__value">{accuracy}<span className="pct">%</span></span>
        <span className="live-stat__label">acc</span>
      </div>
    </div>
  )
}
