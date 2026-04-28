// ===========================
// components/TypingArea.jsx
// The core typing UI
// ===========================

import React, { useEffect, useRef, useCallback } from 'react'
import './TypingArea.css'

const VISIBLE_LINES = 3
const CHARS_PER_LINE_APPROX = 60

export default function TypingArea({
  targetText,
  typedChars,
  currentIdx,
  phase,
  onKeyDown,
  quoteInfo,
}) {
  const containerRef = useRef(null)
  const cursorRef    = useRef(null)
  const inputRef     = useRef(null)

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [targetText])

  // Scroll cursor into view
  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current
      const container = containerRef.current
      const cursorTop = cursor.offsetTop
      const lineH = parseFloat(getComputedStyle(container).lineHeight) || 38

      // Keep cursor in second visible row
      const targetScroll = Math.max(0, cursorTop - lineH)
      container.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [currentIdx])

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="typing-wrapper" onClick={handleContainerClick}>
      {phase === 'idle' && (
        <div className="typing-hint">
          <span className="hint-icon">⌨</span>
          <span>start typing to begin</span>
        </div>
      )}

      {/* Hidden input captures keystrokes */}
      <input
        ref={inputRef}
        className="typing-hidden-input"
        onKeyDown={onKeyDown}
        readOnly
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        tabIndex={0}
      />

      <div className="typing-container" ref={containerRef}>
        <div className="typing-text">
          {targetText.split('').map((char, i) => {
            const typed = typedChars[i]
            let cls = 'char'

            if (i === currentIdx) {
              cls += ' char--cursor'
            } else if (typed) {
              cls += typed.correct ? ' char--correct' : ' char--wrong'
            } else {
              cls += ' char--untyped'
            }

            // Extra class for wrong space (make visible)
            if (char === ' ' && typed && !typed.correct) {
              cls += ' char--wrong-space'
            }

            return (
              <span
                key={i}
                className={cls}
                ref={i === currentIdx ? cursorRef : null}
              >
                {char}
              </span>
            )
          })}
        </div>
      </div>

      {quoteInfo && phase !== 'finished' && (
        <div className="quote-author">— {quoteInfo.author}</div>
      )}
    </div>
  )
}
