// ===========================
// components/SettingsBar.jsx
// ===========================

import React from 'react'
import { MODES, TIME_OPTIONS, WORD_OPTIONS } from '../hooks/useTypingTest'
import './SettingsBar.css'

export default function SettingsBar({ settings, onUpdate, disabled }) {
  const { mode, timed, timeLimit, wordCount, numbers, punctuation } = settings

  return (
    <div className={`settings-bar ${disabled ? 'settings-disabled' : ''}`}>
      {/* Mode selector */}
      <div className="settings-group">
        <ToggleBtn active={mode === MODES.WORDS}  onClick={() => onUpdate({ mode: MODES.WORDS })}  label="words" />
        <ToggleBtn active={mode === MODES.QUOTE}  onClick={() => onUpdate({ mode: MODES.QUOTE })}  label="quote" />
        <ToggleBtn active={mode === MODES.CODE}   onClick={() => onUpdate({ mode: MODES.CODE })}   label="code"  />
      </div>

      <div className="settings-divider" />

      {/* Timed / untimed (only for words mode) */}
      {mode === MODES.WORDS && (
        <>
          <div className="settings-group">
            <ToggleBtn active={timed}  onClick={() => onUpdate({ timed: true })}  label="timed" />
            <ToggleBtn active={!timed} onClick={() => onUpdate({ timed: false })} label="words" />
          </div>
          <div className="settings-divider" />
        </>
      )}

      {/* Time / word count options */}
      {mode === MODES.WORDS && timed && (
        <div className="settings-group">
          {TIME_OPTIONS.map(t => (
            <ToggleBtn key={t} active={timeLimit === t} onClick={() => onUpdate({ timeLimit: t })} label={`${t}s`} />
          ))}
        </div>
      )}

      {mode === MODES.WORDS && !timed && (
        <div className="settings-group">
          {WORD_OPTIONS.map(w => (
            <ToggleBtn key={w} active={wordCount === w} onClick={() => onUpdate({ wordCount: w })} label={`${w}`} />
          ))}
        </div>
      )}

      {/* Extras */}
      {mode === MODES.WORDS && (
        <>
          <div className="settings-divider" />
          <div className="settings-group">
            <ToggleBtn active={numbers}     onClick={() => onUpdate({ numbers: !numbers })}         label="123"   icon />
            <ToggleBtn active={punctuation} onClick={() => onUpdate({ punctuation: !punctuation })} label="!@#"   icon />
          </div>
        </>
      )}
    </div>
  )
}

function ToggleBtn({ active, onClick, label, icon }) {
  return (
    <button
      className={`settings-toggle ${active ? 'settings-toggle--active' : ''} ${icon ? 'settings-toggle--icon' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
