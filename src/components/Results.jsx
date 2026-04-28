// ===========================
// components/Results.jsx
// Full analytics after test
// ===========================

import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { getGrade, formatTime } from '../utils/analytics'
import './Results.css'

export default function Results({ result, onRestart, onNewTest, quoteInfo }) {
  if (!result) return null

  const {
    wpm, rawWpm, accuracy, consistency,
    errors, correctChars, totalChars, elapsedSec,
    timeline, problematic, mode
  } = result

  const grade = getGrade(wpm, accuracy)

  return (
    <div className="results animate-fade-in">
      {/* Grade + headline */}
      <div className="results-hero">
        <div className="results-grade" style={{ color: grade.color, borderColor: grade.color }}>
          {grade.label}
        </div>
        <div className="results-headline">
          <div className="results-wpm">
            <span className="results-wpm__value">{wpm}</span>
            <span className="results-wpm__unit">wpm</span>
          </div>
          <div className="results-subtitle">{grade.desc}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="results-stats-grid">
        <StatCard label="raw wpm"    value={rawWpm}     unit=""   color="cyan"   />
        <StatCard label="accuracy"   value={accuracy}   unit="%"  color="purple" />
        <StatCard label="consistency" value={consistency} unit="%" color="yellow" />
        <StatCard label="errors"     value={errors}     unit=""   color="pink"   />
        <StatCard label="correct"    value={correctChars} unit="" color="cyan"   />
        <StatCard label="time"       value={formatTime(elapsedSec)} unit="" color="purple" />
      </div>

      {/* WPM over time chart */}
      {timeline.length > 2 && (
        <div className="results-chart">
          <h3 className="results-section-title">wpm over time</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00f5d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f72585" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f72585" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="second"
                tick={{ fill: '#6b6b8a', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={v => `${v}s`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b6b8a', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={wpm} stroke="rgba(0,245,212,0.3)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="wpm"    stroke="#00f5d4" strokeWidth={2} fill="url(#wpmGrad)" dot={false} />
              <Area type="monotone" dataKey="errors" stroke="#f72585" strokeWidth={1.5} fill="url(#errGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <LegendItem color="#00f5d4" label="wpm" />
            <LegendItem color="#f72585" label="errors/sec" />
          </div>
        </div>
      )}

      {/* Problematic characters */}
      {problematic.length > 0 && (
        <div className="results-section">
          <h3 className="results-section-title">trouble keys</h3>
          <div className="problem-chars">
            {problematic.map(({ char, errorRate }) => (
              <div key={char} className="problem-char">
                <span className="problem-char__key">{char === ' ' ? '␣' : char}</span>
                <div className="problem-char__bar-wrap">
                  <div
                    className="problem-char__bar"
                    style={{ width: `${errorRate}%` }}
                  />
                </div>
                <span className="problem-char__pct">{errorRate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote source */}
      {quoteInfo && (
        <div className="results-quote-credit">
          <span className="quote-text-label">"{result.quote || ''}"</span>
          <span className="quote-author-label">— {quoteInfo.author}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="results-actions">
        <button className="results-btn results-btn--primary" onClick={onRestart}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
          </svg>
          retry same
        </button>
        <button className="results-btn results-btn--secondary" onClick={onNewTest}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          new test
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__value">{value}{unit}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="tooltip-time">{label}s</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tooltip-row" style={{ color: p.stroke }}>
          <span>{p.dataKey}</span>
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="legend-item">
      <div className="legend-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span>{label}</span>
    </div>
  )
}
