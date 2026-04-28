// ===========================
// App.jsx
// Root component
// ===========================

import React, { useState, useEffect, useCallback } from 'react'
import Header      from './components/Header.jsx'
import Footer      from './components/Footer.jsx'
import SettingsBar from './components/SettingsBar.jsx'
import LiveStats   from './components/LiveStats.jsx'
import TypingArea  from './components/TypingArea.jsx'
import Results     from './components/Results.jsx'
import HistoryModal from './components/HistoryModal.jsx'
import { useTypingTest } from './hooks/useTypingTest'
import './styles/App.css'

export default function App() {
  const [showHistory, setShowHistory] = useState(false)

  const {
    settings, targetText, quoteInfo,
    typedChars, currentIdx, errors,
    phase, elapsed, timeLeft,
    liveWPM, liveAccuracy,
    result,
    handleKeyDown,
    restart,
    updateSettings,
  } = useTypingTest()

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobal = (e) => {
      // Tab + Enter = restart
      if (e.key === 'Tab') {
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        restart()
      }
    }
    window.addEventListener('keydown', handleGlobal)
    return () => window.removeEventListener('keydown', handleGlobal)
  }, [restart])

  const handleNewTest = useCallback(() => {
    updateSettings({}) // same settings, new words
  }, [updateSettings])

  return (
    <div className="app">
      <Header onHistoryClick={() => setShowHistory(true)} />

      <main className="main">
        <div className="main-inner">

          {/* Settings bar — hidden during test */}
          <SettingsBar
            settings={settings}
            onUpdate={updateSettings}
            disabled={phase === 'running'}
          />

          {/* Live stats */}
          <div className="stats-row">
            <LiveStats
              wpm={liveWPM}
              accuracy={liveAccuracy}
              timeLeft={timeLeft}
              elapsed={elapsed}
              phase={phase}
              timed={settings.timed && settings.mode === 'words'}
            />
          </div>

          {/* Main typing area or results */}
          <div className="content-area">
            {phase !== 'finished' ? (
              <TypingArea
                targetText={targetText}
                typedChars={typedChars}
                currentIdx={currentIdx}
                phase={phase}
                onKeyDown={handleKeyDown}
                quoteInfo={quoteInfo}
              />
            ) : (
              <Results
                result={result}
                quoteInfo={quoteInfo}
                onRestart={restart}
                onNewTest={handleNewTest}
              />
            )}
          </div>

          {/* Restart button (idle/running) */}
          {phase !== 'finished' && (
            <div className="restart-row">
              <button className="restart-btn" onClick={restart} title="Restart (Esc)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                </svg>
                restart
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* History modal */}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
